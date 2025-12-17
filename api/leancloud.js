// Vercel Serverless Function - LeanCloud 后端代理
// 此文件将处理所有前端到LeanCloud的请求

const AV = require('leancloud-storage');

// 初始化LeanCloud（使用环境变量）
AV.init({
    appId: process.env.LEANCLOUD_APP_ID,
    appKey: process.env.LEANCLOUD_APP_KEY,
    masterKey: process.env.LEANCLOUD_MASTER_KEY,
    serverURL: process.env.LEANCLOUD_SERVER_URL
});

// 使用 MasterKey（后端安全）
AV.Cloud.useMasterKey();

// CORS 配置
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // 生产环境建议改为具体域名
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-LC-Session',
    'Access-Control-Max-Age': '86400'
};

// 主处理函数
module.exports = async (req, res) => {
    // 设置CORS头
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).send('');
    }

    try {
        const { action, data } = req.body;
        
        console.log(`API请求: ${action}`, data ? Object.keys(data) : 'no data');

        // 恢复会话（如果有sessionToken）
        if (data?.sessionToken) {
            try {
                const user = await AV.User.become(data.sessionToken);
                AV.User._currentUser = user;
                console.log('Session恢复成功:', user.id);
            } catch (error) {
                console.error('Session恢复失败:', error);
            }
        }

        let result;

        switch (action) {
            // 用户认证相关
            case 'login':
                result = await handleLogin(data);
                break;
            case 'logout':
                result = await handleLogout(data);
                break;
            case 'getCurrentUser':
                result = await handleGetCurrentUser(data);
                break;

            // 数据查询
            case 'query':
                result = await handleQuery(data);
                break;

            // 数据计数
            case 'count':
                result = await handleCount(data);
                break;

            // 数据保存
            case 'save':
                result = await handleSave(data);
                break;

            // 数据更新
            case 'update':
                result = await handleUpdate(data);
                break;

            // 数据删除
            case 'delete':
                result = await handleDelete(data);
                break;

            // 文件上传
            case 'uploadFile':
                result = await handleFileUpload(data);
                break;

            // 批量操作
            case 'saveAll':
                result = await handleSaveAll(data);
                break;

            default:
                throw new Error(`未知操作: ${action}`);
        }

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('API错误:', {
            action: req.body?.action || 'unknown',
            error: error.message,
            stack: error.stack,
            code: error.code
        });
        
        res.status(500).json({
            success: false,
            error: error.message,
            code: error.code || 'INTERNAL_ERROR'
        });
    }
};

// 用户登录
async function handleLogin({ username, password }) {
    const user = await AV.User.logIn(username, password);
    return {
        objectId: user.id,
        username: user.get('username'),
        sessionToken: user.getSessionToken(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

// 用户登出
async function handleLogout() {
    await AV.User.logOut();
    return { success: true };
}

// 获取当前用户
async function handleGetCurrentUser({ sessionToken }) {
    if (!sessionToken) {
        return null;
    }
    const user = await AV.User.become(sessionToken);
    return {
        objectId: user.id,
        username: user.get('username'),
        sessionToken: user.getSessionToken(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

// 查询数据
async function handleQuery({ className, conditions, options, orQueries }) {
    let query;

    // 处理or查询
    if (orQueries && orQueries.length > 0) {
        // 创建多个查询对象
        const queries = orQueries.map(orCondition => {
            const orQuery = new AV.Query(className);
            // 应用or查询的条件
            Object.entries(orCondition).forEach(([key, value]) => {
                if (typeof value === 'object' && value.operator) {
                    switch (value.operator) {
                        case 'equalTo':
                            orQuery.equalTo(key, value.value);
                            break;
                        case 'contains':
                            orQuery.contains(key, value.value);
                            break;
                        case 'greaterThanOrEqualTo':
                            orQuery.greaterThanOrEqualTo(key, value.value);
                            break;
                        case 'lessThanOrEqualTo':
                            orQuery.lessThanOrEqualTo(key, value.value);
                            break;
                        case 'notEqualTo':
                            orQuery.notEqualTo(key, value.value);
                            break;
                        case 'containedIn':
                            orQuery.containedIn(key, value.value);
                            break;
                        case 'notContainedIn':
                            orQuery.notContainedIn(key, value.value);
                            break;
                        case 'exists':
                            orQuery.exists(key);
                            break;
                        case 'doesNotExist':
                            orQuery.doesNotExist(key);
                            break;
                    }
                } else {
                    orQuery.equalTo(key, value);
                }
            });
            return orQuery;
        });
        
        // 合并or查询
        query = AV.Query.or(...queries);
    } else {
        // 创建单个查询对象
        query = new AV.Query(className);
        
        // 应用查询条件
        if (conditions) {
            Object.entries(conditions).forEach(([key, value]) => {
                if (typeof value === 'object' && value.operator) {
                    // 支持复杂查询操作符
                    switch (value.operator) {
                        case 'equalTo':
                            query.equalTo(key, value.value);
                            break;
                        case 'contains':
                            query.contains(key, value.value);
                            break;
                        case 'greaterThanOrEqualTo':
                            query.greaterThanOrEqualTo(key, value.value);
                            break;
                        case 'lessThanOrEqualTo':
                            query.lessThanOrEqualTo(key, value.value);
                            break;
                        case 'notEqualTo':
                            query.notEqualTo(key, value.value);
                            break;
                        case 'containedIn':
                            query.containedIn(key, value.value);
                            break;
                        case 'notContainedIn':
                            query.notContainedIn(key, value.value);
                            break;
                        case 'exists':
                            query.exists(key);
                            break;
                        case 'doesNotExist':
                            query.doesNotExist(key);
                            break;
                    }
                } else {
                    query.equalTo(key, value);
                }
            });
        }
    }

    // 应用查询选项
    if (options) {
        if (options.limit) query.limit(options.limit);
        if (options.skip) query.skip(options.skip);
        if (options.ascending) query.ascending(options.ascending);
        if (options.descending) query.descending(options.descending);
        if (options.select) query.select(...options.select);
        if (options.include) query.include(...options.include);
    }

    const results = await query.find();
    
    return results.map(obj => ({
        objectId: obj.id,
        ...obj.toJSON()
    }));
}

// 数据计数（优化性能）
async function handleCount({ className, conditions, options }) {
    const query = new AV.Query(className);

    // 应用查询条件（与 handleQuery 相同）
    if (conditions) {
        Object.entries(conditions).forEach(([key, value]) => {
            if (typeof value === 'object' && value.operator) {
                switch (value.operator) {
                    case 'equalTo':
                        query.equalTo(key, value.value);
                        break;
                    case 'contains':
                        query.contains(key, value.value);
                        break;
                    case 'greaterThanOrEqualTo':
                        query.greaterThanOrEqualTo(key, value.value);
                        break;
                    case 'lessThanOrEqualTo':
                        query.lessThanOrEqualTo(key, value.value);
                        break;
                    case 'notEqualTo':
                        query.notEqualTo(key, value.value);
                        break;
                    case 'containedIn':
                        query.containedIn(key, value.value);
                        break;
                    case 'notContainedIn':
                        query.notContainedIn(key, value.value);
                        break;
                    case 'exists':
                        query.exists(key);
                        break;
                    case 'doesNotExist':
                        query.doesNotExist(key);
                        break;
                }
            } else {
                query.equalTo(key, value);
            }
        });
    }

    // 使用 count() 而不是 find()，只返回数量
    const count = await query.count();
    return count;
}

// 保存数据
async function handleSave({ className, data }) {
    const ObjectClass = AV.Object.extend(className);
    const object = new ObjectClass();

    // 设置数据
    Object.entries(data).forEach(([key, value]) => {
        object.set(key, value);
    });

    const savedObject = await object.save();
    
    return {
        objectId: savedObject.id,
        ...savedObject.toJSON()
    };
}

// 更新数据
async function handleUpdate({ className, objectId, data }) {
    console.log(`📝 更新${className}，ID:${objectId}，数据:`, Object.keys(data));
    
    const ObjectClass = AV.Object.extend(className);
    const object = AV.Object.createWithoutData(className, objectId);

    // 更新数据
    Object.entries(data).forEach(([key, value]) => {
        console.log(`📝 设置字段: ${key} =`, typeof value === 'object' ? `Array(${value.length})` : value);
        object.set(key, value);
    });

    const savedObject = await object.save();
    
    return {
        objectId: savedObject.id,
        ...savedObject.toJSON()
    };
}

// 删除数据
async function handleDelete({ className, objectId }) {
    const ObjectClass = AV.Object.extend(className);
    const object = AV.Object.createWithoutData(className, objectId);
    await object.destroy();
    
    return { success: true, objectId };
}

// 文件上传
async function handleFileUpload({ filename, base64Data, mimeType }) {
    try {
        // 验证输入参数
        if (!filename || !base64Data) {
            throw new Error('缺少文件名或文件数据');
        }

        // 创建文件时直接设置MIME类型
        const fileOptions = {
            base64: base64Data
        };
        
        // 如果提供了MIME类型，添加到选项中
        if (mimeType) {
            fileOptions.type = mimeType;
        }
        
        // 创建文件对象
        const file = new AV.File(filename, fileOptions);
        
        console.log(`开始上传文件: ${filename}, 大小: ${base64Data.length} 字符`);

        const savedFile = await file.save();
        
        console.log(`文件上传成功: ${savedFile.id}`);
        
        // 构建返回结果，使用多种方式获取MIME类型
        let mimeTypeResult = mimeType || 'application/octet-stream';
        
        // 尝试从文件对象获取MIME类型
        if (savedFile.get && typeof savedFile.get === 'function') {
            mimeTypeResult = savedFile.get('mime') || mimeTypeResult;
        }
        
        return {
            objectId: savedFile.id,
            name: savedFile.name(),
            url: savedFile.url(),
            mimeType: mimeTypeResult
        };
    } catch (error) {
        console.error('文件上传失败:', error);
        throw new Error(`文件上传失败: ${error.message}`);
    }
}

// 批量保存
async function handleSaveAll({ className, dataArray }) {
    const ObjectClass = AV.Object.extend(className);
    const objects = dataArray.map(data => {
        const obj = new ObjectClass();
        Object.entries(data).forEach(([key, value]) => {
            obj.set(key, value);
        });
        return obj;
    });

    const savedObjects = await AV.Object.saveAll(objects);
    
    return savedObjects.map(obj => ({
        objectId: obj.id,
        ...obj.toJSON()
    }));
}
