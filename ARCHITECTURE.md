# 系统架构说明

## 架构图

```
┌─────────────────────────────────────────────────────────┐
│                       用户浏览器                          │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │  HTML/CSS/JS │    │ api-client.js│                   │
│  │  (前端页面)   │───▶│  (API封装)   │                   │
│  └──────────────┘    └──────────────┘                   │
└────────────────────────────┬────────────────────────────┘
                             │
                             │ HTTPS POST /api/leancloud
                             │ { action, data }
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Vercel Platform                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │         Serverless Function                     │     │
│  │         api/leancloud.js                        │     │
│  │                                                 │     │
│  │  ┌──────────────────────────────────────┐      │     │
│  │  │ 环境变量 (服务器端，不暴露)          │      │     │
│  │  │ - LEANCLOUD_APP_ID                   │      │     │
│  │  │ - LEANCLOUD_APP_KEY                  │      │     │
│  │  │ - LEANCLOUD_SERVER_URL               │      │     │
│  │  └──────────────────────────────────────┘      │     │
│  │                    ↓                            │     │
│  │  ┌──────────────────────────────────────┐      │     │
│  │  │ LeanCloud SDK                        │      │     │
│  │  │ - 用户认证                           │      │     │
│  │  │ - 数据查询                           │      │     │
│  │  │ - 数据保存                           │      │     │
│  │  │ - 文件上传                           │      │     │
│  │  └──────────────────────────────────────┘      │     │
│  └────────────────────────────────────────────────┘     │
└────────────────────────────┬────────────────────────────┘
                             │
                             │ LeanCloud REST API
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   LeanCloud Platform                     │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  用户数据    │  │  业务数据    │  │  文件存储    │  │
│  │   (User)     │  │  (Tracking)  │  │   (File)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 数据流程

### 1. 用户登录流程

```
用户输入账号密码
    ↓
前端调用 api.login(username, password)
    ↓
发送POST请求到 /api/leancloud
    { action: 'login', data: { username, password } }
    ↓
Vercel Serverless Function 接收请求
    ↓
使用服务器端配置调用 AV.User.logIn()
    ↓
LeanCloud 验证用户
    ↓
返回 sessionToken 给后端
    ↓
后端返回给前端 { success: true, data: { sessionToken, ... } }
    ↓
前端保存 sessionToken 到 localStorage
    ↓
后续请求都携带 sessionToken
```

### 2. 数据查询流程

```
用户访问跟单工作台
    ↓
前端调用 api.query('Tracking', conditions, options)
    ↓
发送POST请求到 /api/leancloud
    { 
        action: 'query', 
        data: { 
            className: 'Tracking',
            conditions: { billNo: 'BILL123' },
            options: { limit: 20 },
            sessionToken: 'xxx'
        }
    }
    ↓
Vercel Serverless Function
    ↓
恢复用户会话 (AV.User.become(sessionToken))
    ↓
构建查询 (new AV.Query('Tracking'))
    ↓
执行查询 query.find()
    ↓
LeanCloud 返回数据
    ↓
后端格式化数据
    ↓
返回给前端 { success: true, data: [...] }
    ↓
前端渲染数据到页面
```

### 3. 数据保存流程

```
用户点击保存按钮
    ↓
前端调用 api.save('Tracking', data)
    ↓
发送POST请求到 /api/leancloud
    { 
        action: 'save',
        data: {
            className: 'Tracking',
            data: { containerNo: 'CONT123', ... },
            sessionToken: 'xxx'
        }
    }
    ↓
Vercel Serverless Function
    ↓
恢复用户会话
    ↓
创建对象 (new ObjectClass())
    ↓
设置数据 (object.set(key, value))
    ↓
保存到LeanCloud (object.save())
    ↓
返回保存结果
    ↓
前端更新UI
```

## 安全机制

### 1. 配置隔离

```javascript
// ❌ 旧方式 - 前端暴露配置
AV.init({
    appId: 'qWTZ0xzNWk9B3bhk3vXGbfPl-gzGzoHsz',  // 暴露在源码中
    appKey: 'n1MnTEgdQGWk2jouFA55NF1n',          // 所有人可见
    serverURL: 'https://qwtz0xzn.lc-cn-n1-shared.com'
});

// ✅ 新方式 - 后端隐藏配置
// 前端
const api = new APIClient();
await api.login(username, password);

// 后端 (Vercel Function)
AV.init({
    appId: process.env.LEANCLOUD_APP_ID,      // 环境变量，不暴露
    appKey: process.env.LEANCLOUD_APP_KEY,    // 只存在服务器端
    serverURL: process.env.LEANCLOUD_SERVER_URL
});
```

### 2. 会话管理

```javascript
// 用户登录后获取sessionToken
const user = await api.login('username', 'password');
// sessionToken: "abc123..."

// 保存到本地
localStorage.setItem('sessionToken', user.sessionToken);

// 后续请求自动携带
await api.query('Tracking', ...);  
// 自动添加 sessionToken 到请求中

// 后端验证会话
const user = await AV.User.become(sessionToken);
// 只有有效的sessionToken才能访问数据
```

### 3. CORS保护

```javascript
// Vercel Function 配置CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',  // 生产环境应限制为具体域名
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
```

### 4. 错误处理

```javascript
// 前端统一错误处理
try {
    const result = await api.query('Tracking', ...);
} catch (error) {
    console.error('查询失败:', error.message);
    // 显示用户友好的错误信息
}

// 后端错误封装
try {
    const results = await handleQuery(data);
    res.json({ success: true, data: results });
} catch (error) {
    res.json({ 
        success: false, 
        error: error.message,
        code: error.code 
    });
}
```

## 向后兼容

为了最小化代码改动，`api-client.js` 提供了AV对象的兼容层：

```javascript
// 原有代码仍然可用
const query = new AV.Query('Tracking');
query.equalTo('billNo', 'BILL123');
const results = await query.find();

// 实际执行流程
AV.Query → api.query() → /api/leancloud → LeanCloud
```

## 性能优化

### 1. 减少请求次数

```javascript
// ❌ 多次请求
const user1 = await api.findById('User', 'id1');
const user2 = await api.findById('User', 'id2');
const user3 = await api.findById('User', 'id3');

// ✅ 批量查询
const users = await api.query('User', {
    objectId: { operator: 'in', value: ['id1', 'id2', 'id3'] }
});
```

### 2. 数据分页

```javascript
// 避免一次加载太多数据
const results = await api.query('Tracking', conditions, {
    limit: 20,      // 每页20条
    skip: page * 20 // 跳过前面的数据
});
```

### 3. 选择性查询

```javascript
// 只查询需要的字段
const results = await api.query('Tracking', conditions, {
    select: ['containerNo', 'billNo', 'arrivalDate']  // 减少数据传输
});
```

## 扩展性

### 添加新的API操作

1. 在 `api/leancloud.js` 添加处理函数：

```javascript
async function handleCustomOperation(data) {
    // 自定义逻辑
    return result;
}

// 在switch中添加case
case 'customOperation':
    result = await handleCustomOperation(data);
    break;
```

2. 在 `js/api-client.js` 添加客户端方法：

```javascript
async customOperation(params) {
    return await this.request('customOperation', params);
}
```

3. 在前端调用：

```javascript
const result = await api.customOperation({ ... });
```

## 监控和日志

### Vercel Function 日志

```javascript
// 在后端添加日志
console.log('收到请求:', action);
console.log('查询条件:', conditions);
console.log('查询结果数量:', results.length);
```

在Vercel控制台查看：
- Dashboard → Project → Functions → Logs

### 前端错误追踪

```javascript
// 在 api-client.js 中
async request(action, data) {
    try {
        const response = await fetch(...);
        // 记录成功请求
        console.log('✓ API调用成功:', action);
        return result.data;
    } catch (error) {
        // 记录失败请求
        console.error('✗ API调用失败:', action, error);
        throw error;
    }
}
```

## 成本分析

### Vercel免费额度

- **Serverless Functions**: 100GB-Hours/月
- **带宽**: 100GB/月
- **构建时间**: 6000分钟/月

估算使用量（中小型应用）：
- 每月API调用: ~10,000次
- 平均执行时间: 200ms
- 总执行时间: 2000秒 = 0.56GB-Hours
- **完全在免费额度内**

### LeanCloud费用

继续使用现有LeanCloud服务，费用不变。

## 总结

通过这个架构：

✅ **安全性**: LeanCloud配置完全隐藏在后端
✅ **兼容性**: 最小化代码改动，向后兼容
✅ **可维护性**: 清晰的分层架构
✅ **性能**: Vercel全球CDN加速
✅ **成本**: 免费额度足够使用
✅ **可扩展性**: 易于添加新功能

从前端直接访问LeanCloud到通过Vercel中间层，显著提升了系统的安全性和专业性。
