// API客户端 - 前端与Vercel后端通信
// 此文件封装所有与后端的通信逻辑

class APIClient {
    constructor() {
        // 生产环境使用Vercel域名，开发环境使用localhost
        this.baseURL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000' 
            : window.location.origin;
        
        this.sessionToken = this.getSessionToken();
    }

    // 获取存储的sessionToken
    getSessionToken() {
        return localStorage.getItem('sessionToken');
    }

    // 保存sessionToken
    setSessionToken(token) {
        if (token) {
            localStorage.setItem('sessionToken', token);
            this.sessionToken = token;
        } else {
            localStorage.removeItem('sessionToken');
            this.sessionToken = null;
        }
    }

    // 通用请求方法
    async request(action, data = {}) {
        try {
            // 添加sessionToken到请求数据
            if (this.sessionToken) {
                data.sessionToken = this.sessionToken;
            }

            const response = await fetch(`${this.baseURL}/api/leancloud`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action,
                    data
                })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || '请求失败');
            }

            return result.data;
        } catch (error) {
            console.error('API请求失败:', error);
            throw error;
        }
    }

    // ==================== 用户认证相关 ====================
    
    // 用户登录
    async login(username, password) {
        const result = await this.request('login', { username, password });
        this.setSessionToken(result.sessionToken);
        return result;
    }

    // 用户登出
    async logout() {
        await this.request('logout');
        this.setSessionToken(null);
    }

    // 获取当前用户
    async getCurrentUser() {
        if (!this.sessionToken) {
            return null;
        }
        try {
            return await this.request('getCurrentUser', { 
                sessionToken: this.sessionToken 
            });
        } catch (error) {
            this.setSessionToken(null);
            return null;
        }
    }

    // ==================== 数据查询 ====================
    
    // 查询数据
    async query(className, conditions = {}, options = {}) {
        return await this.request('query', {
            className,
            conditions,
            options
        });
    }

    // 简化的查询方法
    async findAll(className, options = {}) {
        return await this.query(className, {}, options);
    }

    async findOne(className, conditions) {
        const results = await this.query(className, conditions, { limit: 1 });
        return results.length > 0 ? results[0] : null;
    }

    async findById(className, objectId) {
        const results = await this.query(className, { objectId }, { limit: 1 });
        return results.length > 0 ? results[0] : null;
    }

    // ==================== 数据操作 ====================
    
    // 保存新数据
    async save(className, data) {
        return await this.request('save', { className, data });
    }

    // 更新数据
    async update(className, objectId, data) {
        return await this.request('update', { className, objectId, data });
    }

    // 删除数据
    async delete(className, objectId) {
        return await this.request('delete', { className, objectId });
    }

    // 批量保存
    async saveAll(className, dataArray) {
        return await this.request('saveAll', { className, dataArray });
    }

    // ==================== 文件上传 ====================
    
    // 上传文件
    async uploadFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const base64Data = e.target.result.split(',')[1];
                    const result = await this.request('uploadFile', {
                        filename: file.name,
                        base64Data: base64Data,
                        mimeType: file.type
                    });
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(file);
        });
    }

    // ==================== 业务专用方法 ====================

    // 跟单数据查询
    async queryTracking(filters = {}, page = 1, pageSize = 20) {
        const conditions = {};
        const skip = (page - 1) * pageSize;

        // 构建查询条件
        if (filters.arrivalDate) {
            conditions.arrivalDate = { 
                operator: 'equalTo', 
                value: filters.arrivalDate 
            };
        }
        if (filters.billNo) {
            conditions.billNo = { 
                operator: 'contains', 
                value: filters.billNo 
            };
        }
        if (filters.containerNo) {
            conditions.containerNo = { 
                operator: 'contains', 
                value: filters.containerNo 
            };
        }
        if (filters.declareDate) {
            conditions.declareDate = { 
                operator: 'equalTo', 
                value: filters.declareDate 
            };
        }
        if (filters.customsStatus) {
            conditions.customsStatus = { 
                operator: 'equalTo', 
                value: filters.customsStatus 
            };
        }

        return await this.query('Tracking', conditions, {
            limit: pageSize,
            skip: skip,
            descending: 'arrivalDate'
        });
    }

    // 报关数据查询
    async queryCustoms(filters = {}, page = 1, pageSize = 20) {
        const conditions = {};
        const skip = (page - 1) * pageSize;

        if (filters.arrivalDate) {
            conditions.arrivalDate = { 
                operator: 'equalTo', 
                value: filters.arrivalDate 
            };
        }
        if (filters.billNo) {
            conditions.billNo = { 
                operator: 'contains', 
                value: filters.billNo 
            };
        }
        if (filters.containerNo) {
            conditions.containerNo = { 
                operator: 'contains', 
                value: filters.containerNo 
            };
        }
        if (filters.customsNo) {
            conditions.customsNo = { 
                operator: 'contains', 
                value: filters.customsNo 
            };
        }

        return await this.query('CustomsData', conditions, {
            limit: pageSize,
            skip: skip,
            descending: 'arrivalDate'
        });
    }

    // 常用链接查询
    async queryQuickLinks() {
        return await this.query('QuickLinks', {}, {
            ascending: 'order'
        });
    }

    // HS编码查询
    async queryHSCode(filters = {}, page = 1, pageSize = 20) {
        const conditions = {};
        const skip = (page - 1) * pageSize;

        if (filters.hsCode) {
            conditions.hsCode = { 
                operator: 'contains', 
                value: filters.hsCode 
            };
        }
        if (filters.productName) {
            conditions.productName = { 
                operator: 'contains', 
                value: filters.productName 
            };
        }

        return await this.query('HSCode', conditions, {
            limit: pageSize,
            skip: skip
        });
    }

    // 出口商查询
    async queryExporter(filters = {}, page = 1, pageSize = 20) {
        const conditions = {};
        const skip = (page - 1) * pageSize;

        if (filters.foreignConsignee) {
            conditions.foreignConsignee = { 
                operator: 'contains', 
                value: filters.foreignConsignee 
            };
        }
        if (filters.shipperRecordNo) {
            conditions.shipperRecordNo = { 
                operator: 'contains', 
                value: filters.shipperRecordNo 
            };
        }

        return await this.query('Exporter', conditions, {
            limit: pageSize,
            skip: skip
        });
    }
}

// 创建全局API客户端实例
const api = new APIClient();

// 向后兼容的AV对象模拟
const AV = {
    User: {
        current: async () => {
            const user = await api.getCurrentUser();
            if (!user) return null;
            
            // 返回与原AV.User兼容的对象
            return {
                id: user.objectId,
                get: (key) => user[key],
                getSessionToken: () => user.sessionToken,
                toJSON: () => user
            };
        },
        
        logIn: async (username, password) => {
            const user = await api.login(username, password);
            return {
                id: user.objectId,
                get: (key) => user[key],
                getSessionToken: () => user.sessionToken,
                toJSON: () => user
            };
        },
        
        logOut: async () => {
            await api.logout();
        }
    },
    
    Query: class {
        constructor(className) {
            this.className = className;
            this.conditions = {};
            this.options = {};
        }
        
        equalTo(key, value) {
            this.conditions[key] = { operator: 'equalTo', value };
            return this;
        }
        
        contains(key, value) {
            this.conditions[key] = { operator: 'contains', value };
            return this;
        }
        
        greaterThanOrEqualTo(key, value) {
            this.conditions[key] = { operator: 'greaterThanOrEqualTo', value };
            return this;
        }
        
        lessThanOrEqualTo(key, value) {
            this.conditions[key] = { operator: 'lessThanOrEqualTo', value };
            return this;
        }
        
        notEqualTo(key, value) {
            this.conditions[key] = { operator: 'notEqualTo', value };
            return this;
        }
        
        exists(key) {
            this.conditions[key] = { operator: 'exists' };
            return this;
        }
        
        doesNotExist(key) {
            this.conditions[key] = { operator: 'doesNotExist' };
            return this;
        }
        
        limit(n) {
            this.options.limit = n;
            return this;
        }
        
        skip(n) {
            this.options.skip = n;
            return this;
        }
        
        ascending(key) {
            this.options.ascending = key;
            return this;
        }
        
        descending(key) {
            this.options.descending = key;
            return this;
        }
        
        async find() {
            const results = await api.query(this.className, this.conditions, this.options);
            return results.map(obj => ({
                id: obj.objectId,
                get: (key) => obj[key],
                set: function(key, value) {
                    this[key] = value;
                    obj[key] = value;
                },
                toJSON: () => obj,
                save: async function() {
                    if (obj.objectId) {
                        const updated = await api.update(this.className, obj.objectId, obj);
                        return { id: updated.objectId, ...updated };
                    } else {
                        const saved = await api.save(this.className, obj);
                        obj.objectId = saved.objectId;
                        return { id: saved.objectId, ...saved };
                    }
                },
                destroy: async function() {
                    if (obj.objectId) {
                        await api.delete(this.className, obj.objectId);
                    }
                }
            }));
        }
        
        async first() {
            this.limit(1);
            const results = await this.find();
            return results.length > 0 ? results[0] : null;
        }
    },
    
    Object: {
        extend: (className) => {
            return class extends AV.Object {
                constructor() {
                    super();
                    this.className = className;
                    this._data = {};
                }
            };
        },
        
        createWithoutData: (ObjectClass, objectId) => {
            const obj = new ObjectClass();
            obj._data.objectId = objectId;
            return obj;
        },
        
        saveAll: async (objects) => {
            const className = objects[0]?.className;
            const dataArray = objects.map(obj => obj._data);
            const results = await api.saveAll(className, dataArray);
            return results.map((result, index) => {
                objects[index]._data.objectId = result.objectId;
                return objects[index];
            });
        },
        
        set: function(key, value) {
            this._data[key] = value;
        },
        
        get: function(key) {
            return this._data[key];
        },
        
        save: async function() {
            if (this._data.objectId) {
                const result = await api.update(this.className, this._data.objectId, this._data);
                this._data = result;
            } else {
                const result = await api.save(this.className, this._data);
                this._data = result;
            }
            return this;
        },
        
        destroy: async function() {
            if (this._data.objectId) {
                await api.delete(this.className, this._data.objectId);
            }
        },
        
        toJSON: function() {
            return this._data;
        }
    },
    
    File: class {
        constructor(name, file) {
            this.name = name;
            this.file = file;
        }
        
        async save() {
            const result = await api.uploadFile(this.file);
            this._url = result.url;
            this._name = result.name;
            return this;
        }
        
        url() {
            return this._url;
        }
        
        name() {
            return this._name;
        }
    }
};
