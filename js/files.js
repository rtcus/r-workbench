// 文件管理功能模块
let fileListData = [];
let currentPage = 1;
let pageSize = 20;
let totalItems = 0;

// 加载文件列表
async function loadFileList(page = 1, resetData = false) {
    try {
        const tbody = document.getElementById('fileListBody');
        if (!tbody) return;
        
        if (resetData) {
            currentPage = page;
            fileListData = [];
        }
        
        tbody.innerHTML = '<tr><td colspan="7" class="loading">正在加载文件列表...</td></tr>';
        
        // 先查询总数
        const countQuery = new AV.Query('Tracking');
        countQuery.exists('attachments');
        const total = await countQuery.count();
        totalItems = total;
        
        // 分页查询数据
        const query = new AV.Query('Tracking');
        query.exists('attachments');
        // 添加select只返回需要的字段，减少数据传输量
        query.select('attachments', 'containerNo', 'customsNo', 'objectId');
        // 按创建时间降序排列，最新的在前
        query.descending('createdAt');
        // 分页设置
        query.skip((page - 1) * pageSize);
        query.limit(pageSize);
        
        console.log(`开始加载文件列表，第${page}页...`);
        const results = await query.find();
        console.log(`第${page}页找到 ${results.length} 条记录，总共${total}条`);
        
        const newFileData = [];
        results.forEach(item => {
            const data = item.toJSON();
            if (data.attachments && data.attachments.length > 0) {
                data.attachments.forEach(attachment => {
                    newFileData.push({
                        id: attachment.id,
                        fileName: attachment.name,
                        fileType: attachment.type,
                        containerNo: data.containerNo || '',
                        customsNo: data.customsNo || '',
                        uploadTime: attachment.uploadTime,
                        trackingId: data.objectId,
                        fileUrl: attachment.fileUrl
                    });
                });
            }
        });
        
        if (resetData) {
            fileListData = newFileData;
        } else {
            fileListData = [...fileListData, ...newFileData];
        }
        
        renderFileList();
        renderPagination();
        
    } catch (error) {
        console.error('加载文件列表失败:', error);
        const tbody = document.getElementById('fileListBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">加载文件列表失败: ' + error.message + '</td></tr>';
        }
    }
}

// 渲染文件列表
function renderFileList() {
    const tbody = document.getElementById('fileListBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (fileListData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">暂无文件</td></tr>';
        return;
    }
    
    fileListData.forEach((file, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <a href="#" class="file-name" data-url="${file.fileUrl}">${file.fileName}</a>
            </td>
            <td>${file.fileType}</td>
            <td>${file.containerNo}</td>
            <td>${file.customsNo}</td>
            <td>${file.uploadTime}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-file" data-url="${file.fileUrl}">
                    <i class="fas fa-eye"></i> 查看
                </button>
                <button class="btn btn-sm btn-outline-danger delete-file" data-id="${file.id}" data-tracking-id="${file.trackingId}">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // 绑定文件操作事件
    bindFileEvents();
}

// 渲染分页控件
function renderPagination() {
    const paginationContainer = document.getElementById('filePagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<nav aria-label="文件列表分页"><ul class="pagination">';
    
    // 上一页按钮
    if (currentPage > 1) {
        paginationHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="loadFileList(${currentPage - 1}, true); return false;">上一页</a>
        </li>`;
    }
    
    // 页码按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<li class="page-item ${activeClass}">
            <a class="page-link" href="#" onclick="loadFileList(${i}, true); return false;">${i}</a>
        </li>`;
    }
    
    // 下一页按钮
    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="loadFileList(${currentPage + 1}, true); return false;">下一页</a>
        </li>`;
    }
    
    paginationHTML += '</ul></nav>';
    
    // 添加页面信息
    paginationHTML += `<div class="pagination-info">
        显示第 ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalItems)} 条，共 ${totalItems} 条记录
    </div>`;
    
    paginationContainer.innerHTML = paginationHTML;
}

// 绑定文件操作事件
function bindFileEvents() {
    // 查看文件
    document.querySelectorAll('.view-file').forEach(btn => {
        btn.addEventListener('click', function() {
            const fileUrl = this.getAttribute('data-url');
            if (fileUrl && fileUrl !== '#') {
                window.open(fileUrl, '_blank');
            } else {
                alert('文件链接无效');
            }
        });
    });
    
    // 删除文件
    document.querySelectorAll('.delete-file').forEach(btn => {
        btn.addEventListener('click', async function() {
            const fileId = parseInt(this.getAttribute('data-id'));
            const trackingId = this.getAttribute('data-tracking-id');
            
            if (confirm('确定要删除这个文件吗？')) {
                await deleteFileFromTracking(trackingId, fileId);
            }
        });
    });
    
    // 文件名点击
    document.querySelectorAll('.file-name').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const fileUrl = this.getAttribute('data-url');
            if (fileUrl && fileUrl !== '#') {
                window.open(fileUrl, '_blank');
            }
        });
    });
}

// 上传文件
async function uploadFiles() {
    const fileInput = document.getElementById('fileUpload');
    const fileType = document.getElementById('fileTypeSelect').value;
    
    if (fileInput.files.length === 0) {
        alert('请选择要上传的文件');
        return;
    }
    
    try {
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < fileInput.files.length; i++) {
            const file = fileInput.files[i];
            const success = await processSingleFile(file, fileType);
            
            if (success) {
                successCount++;
            } else {
                errorCount++;
            }
        }
        
        // 重新加载文件列表（重置到第一页）
        await loadFileList(1, true);
        
        // 清空文件选择
        fileInput.value = '';
        
        if (errorCount === 0) {
            alert(`成功上传 ${successCount} 个文件`);
        } else {
            alert(`上传完成！成功 ${successCount} 个，失败 ${errorCount} 个`);
        }
        
    } catch (error) {
        console.error('文件上传失败:', error);
        alert('文件上传失败: ' + error.message);
    }
}

// 处理单个文件
async function processSingleFile(file, fileType) {
    try {
        // 解析文件名（去掉扩展名）
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        
        console.log('正在处理文件:', fileName);
        
        // 在Tracking表中查找匹配的记录 - 改进匹配逻辑
        const query = new AV.Query('Tracking');
        const orQuery = [];
        
        // 改进匹配：支持部分匹配和多种格式
        orQuery.push(new AV.Query('Tracking').contains('containerNo', fileName));
        orQuery.push(new AV.Query('Tracking').contains('customsNo', fileName));
        orQuery.push(new AV.Query('Tracking').contains('billNo', fileName));
        
        // 添加精确匹配
        orQuery.push(new AV.Query('Tracking').equalTo('containerNo', fileName));
        orQuery.push(new AV.Query('Tracking').equalTo('customsNo', fileName));
        orQuery.push(new AV.Query('Tracking').equalTo('billNo', fileName));
        
        query.or(orQuery);
        // 添加select只返回需要的字段，减少数据传输量
        query.select('attachments', 'containerNo', 'customsNo');
        
        const matchedRecords = await query.find();
        
        if (matchedRecords.length === 0) {
            console.warn(`未找到匹配的记录: ${fileName}`);
            // 提供更友好的提示
            const userChoice = confirm(`文件 "${file.name}" 无法自动匹配到任何记录。\n是否手动选择关联的记录？`);
            if (userChoice) {
                // 这里可以添加手动选择功能
                await showManualFileAssociation(file, fileType);
            }
            return false;
        }
        
        // 使用第一个匹配的记录
        const matchedRecord = matchedRecords[0];
        const trackingData = matchedRecord.toJSON();
        
        console.log('找到匹配记录:', trackingData.containerNo, trackingData.customsNo);
        
        // 使用统一的API客户端上传文件
        const uploadedFile = await api.uploadFile(file);
        
        // 获取当前记录的附件列表
        const attachments = trackingData.attachments || [];
        
        // 添加新附件
        const newAttachment = {
            id: attachments.length > 0 ? Math.max(...attachments.map(a => a.id)) + 1 : 1,
            type: fileType,
            name: file.name,
            uploadTime: new Date().toLocaleString('zh-CN'),
            fileUrl: uploadedFile.url,
            fileId: uploadedFile.objectId
        };
        
        attachments.push(newAttachment);
        
        // 更新Tracking记录
        matchedRecord.set('attachments', attachments);
        await matchedRecord.save();
        
        console.log('文件上传成功:', file.name);
        return true;
        
    } catch (error) {
        console.error('处理文件失败:', error);
        return false;
    }
}

// 显示手动关联文件界面
async function showManualFileAssociation(file, fileType) {
    try {
        // 获取所有Tracking记录供用户选择
        const query = new AV.Query('Tracking');
        query.limit(50); // 限制数量，避免数据过多
        query.descending('createdAt');
        const allRecords = await query.find();
        
        // 创建选择模态框
        const modalHtml = `
            <div class="modal fade" id="manualAssociationModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">手动关联文件</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>文件: <strong>${file.name}</strong></p>
                            <p>请选择要关联的记录:</p>
                            <div class="table-responsive" style="max-height: 400px;">
                                <table class="table table-sm table-hover">
                                    <thead>
                                        <tr>
                                            <th>选择</th>
                                            <th>柜号</th>
                                            <th>提单号</th>
                                            <th>报关单号</th>
                                            <th>到港日期</th>
                                        </tr>
                                    </thead>
                                    <tbody id="manualAssociationList">
                                        ${allRecords.map(record => {
                                            const data = record.toJSON();
                                            return `
                                                <tr>
                                                    <td>
                                                        <input type="radio" name="selectedRecord" value="${record.id}" data-container="${data.containerNo || ''}" data-customs="${data.customsNo || ''}">
                                                    </td>
                                                    <td>${data.containerNo || ''}</td>
                                                    <td>${data.billNo || ''}</td>
                                                    <td>${data.customsNo || ''}</td>
                                                    <td>${data.arrivalDate || ''}</td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-primary" id="confirmManualAssociation">确认关联</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加模态框到页面
        if (!document.getElementById('manualAssociationModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
        
        const modal = new bootstrap.Modal(document.getElementById('manualAssociationModal'));
        modal.show();
        
        // 绑定确认按钮事件
        document.getElementById('confirmManualAssociation').addEventListener('click', async function() {
            const selectedRadio = document.querySelector('input[name="selectedRecord"]:checked');
            if (!selectedRadio) {
                alert('请选择要关联的记录');
                return;
            }
            
            const recordId = selectedRadio.value;
            const containerNo = selectedRadio.getAttribute('data-container');
            const customsNo = selectedRadio.getAttribute('data-customs');
            
            try {
                // 获取选中的记录
                const trackingObj = AV.Object.createWithoutData('Tracking', recordId);
                const tracking = await trackingObj.fetch();
                const trackingData = tracking.toJSON();
                
                // 使用统一的API客户端上传文件
                const uploadedFile = await api.uploadFile(file);
                
                // 获取当前记录的附件列表
                const attachments = trackingData.attachments || [];
                
                // 添加新附件
                const newAttachment = {
                    id: attachments.length > 0 ? Math.max(...attachments.map(a => a.id)) + 1 : 1,
                    type: fileType,
                    name: file.name,
                    uploadTime: new Date().toLocaleString('zh-CN'),
                    fileUrl: uploadedFile.url,
                    fileId: uploadedFile.objectId
                };
                
                attachments.push(newAttachment);
                
                // 更新Tracking记录
                tracking.set('attachments', attachments);
                await tracking.save();
                
                modal.hide();
                alert(`文件已成功关联到柜号: ${containerNo}`);
                return true;
                
            } catch (error) {
                console.error('手动关联文件失败:', error);
                alert('关联失败: ' + error.message);
                return false;
            }
        });
        
    } catch (error) {
        console.error('显示手动关联界面失败:', error);
        alert('无法显示关联界面: ' + error.message);
        return false;
    }
}

// 从Tracking记录中删除文件
async function deleteFileFromTracking(trackingId, fileId) {
    try {
        // 获取Tracking记录
        const trackingObj = AV.Object.createWithoutData('Tracking', trackingId);
        const tracking = await trackingObj.fetch();
        const trackingData = tracking.toJSON();
        
        // 找到要删除的附件，获取文件ID
        const attachmentToDelete = trackingData.attachments.find(att => att.id === fileId);
        if (!attachmentToDelete) {
            alert('找不到要删除的文件');
            return;
        }
        
        // 过滤掉要删除的附件
        const updatedAttachments = trackingData.attachments.filter(att => att.id !== fileId);
        
        // 1. 先删除 LeanCloud 上的实际文件
        if (attachmentToDelete.fileId && typeof deleteFileFromLeanCloud === 'function') {
            await deleteFileFromLeanCloud(attachmentToDelete.fileId);
        }
        
        // 2. 更新记录
        tracking.set('attachments', updatedAttachments);
        await tracking.save();
        
        // 重新加载文件列表（重置到第一页）
        await loadFileList(1, true);
        
        alert('文件删除成功');
        
    } catch (error) {
        console.error('删除文件失败:', error);
        alert('文件删除失败: ' + error.message);
    }
}

// 绑定文件管理事件
function bindFileEvents() {
    console.log('🔗 开始绑定文件管理事件...');
    
    // 上传文件按钮
    const uploadFilesBtn = document.getElementById('uploadFiles');
    console.log('🔍 查找上传按钮:', uploadFilesBtn);
    
    if (uploadFilesBtn) {
        // 检查是否已经绑定了事件，避免重复绑定
        const isInitialized = uploadFilesBtn.hasAttribute('data-initialized');
        console.log('🔍 按钮初始化状态:', isInitialized);
        
        if (!isInitialized) {
            console.log('🔗 绑定上传事件到按钮');
            uploadFilesBtn.addEventListener('click', function(e) {
                console.log('🔘 上传按钮被点击');
                e.preventDefault();
                uploadFiles();
            });
            uploadFilesBtn.setAttribute('data-initialized', 'true');
            console.log('✅ 文件管理事件绑定完成');
        } else {
            console.log('ℹ️ 按钮已经绑定过事件');
        }
    } else {
        console.error('❌ 找不到上传按钮 #uploadFiles');
    }
}

// 显式暴露函数到全局作用域
window.loadFileList = loadFileList;
window.uploadFiles = uploadFiles;
window.bindFileEvents = bindFileEvents;

// 页面加载时也绑定一次事件
document.addEventListener('DOMContentLoaded', bindFileEvents);

console.log('✅ files.js 函数已暴露到全局作用域');
console.log('🔍 暴露后检查window.uploadFiles:', typeof window.uploadFiles);
console.log('🔍 暴露后检查window.loadFileList:', typeof window.loadFileList);
console.log('🔍 暴露后检查window.bindFileEvents:', typeof window.bindFileEvents);