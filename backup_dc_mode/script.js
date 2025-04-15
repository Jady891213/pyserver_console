// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 初始化CodeMirror编辑器
    const editor = CodeMirror(document.getElementById('code-editor'), {
        mode: 'python',
        theme: 'neat',  // 使用更简洁的主题
        lineNumbers: true,
        indentUnit: 4,
        smartIndent: true,
        indentWithTabs: false,
        lineWrapping: false,
        gutters: ['CodeMirror-linenumbers'],
        extraKeys: {
            'F5': runScript
        },
        matchBrackets: true,
        styleActiveLine: true, // 高亮当前行
        fontSize: "13px",
        lineHeight: 1.5,
        readOnly: true // 设置为只读模式
    });
    
    // 初始化执行逻辑编辑器
    const executionLogicEditor = CodeMirror(document.getElementById('execution-logic-editor'), {
        mode: 'python',
        theme: 'neat',
        lineNumbers: true,
        indentUnit: 4,
        smartIndent: true,
        indentWithTabs: false,
        lineWrapping: false,
        gutters: ['CodeMirror-linenumbers'],
        matchBrackets: true,
        styleActiveLine: true,
        fontSize: "13px",
        lineHeight: 1.5
    });

    // 设置编辑器样式
    const cmElement = document.querySelector('.CodeMirror');
    if (cmElement) {
        cmElement.style.fontSize = '13px';
        cmElement.style.fontFamily = "'Consolas', 'Source Code Pro', monospace";
    }

    // 所有编辑器应用统一样式
    document.querySelectorAll('.CodeMirror').forEach(cm => {
        cm.style.fontSize = '13px';
        cm.style.fontFamily = "'Consolas', 'Source Code Pro', monospace";
        cm.style.height = '100%';
    });

    // 为只读编辑器添加特殊样式
    document.querySelector('.editor-container').classList.add('readonly-editor');

    // 设置默认代码
    const defaultCode = `def main(params):
    
    print(f"打印测试")
    return params
    
`;
    editor.setValue(defaultCode);
    
    // 设置执行逻辑编辑器的默认代码
    const executionLogicCode = `# 确定一个背景scope范围
SCOPE(Y["2021"],
      S["Actual"],
      V["Working"],
      P["YearTotal"].Base(),
      Product["TotalProduct"].Base())

# 计算
BLOCK[A["Total_Sales"]] = \\
    BLOCK[A['Volume']] * BLOCK[A['Price'], P['NoPeriod']]`;
    
    executionLogicEditor.setValue(executionLogicCode);
    
    // 更新预览代码
    updatePreviewCode();
    
    // 当执行逻辑编辑器内容变化时，更新预览代码
    executionLogicEditor.on('change', function() {
        updatePreviewCode();
    });
    
    // 更新预览代码函数
    function updatePreviewCode() {
        const deepCubeScript = executionLogicEditor.getValue();
        
        // 组合成完整的Python代码，添加必要的导入和初始化
        const fullCode = `from deepcube.cube.cube import DeepCube

# 实例化DeepCube对象
cube = DeepCube('finance_cube')

# 定义维度别名
Y = cube.year
P = cube.period
S = cube.scenario
V = cube.version
A = cube.account
D = cube.dept
Product = cube.product

# 定义简写
SCOPE = cube.scope
BLOCK = cube.loc

${deepCubeScript}

def main(params):
    print("开始执行DeepCube脚本...")
    
    try:
        # 这里会执行上面的DeepCube代码
        # 返回计算结果作为执行成功的数据
        return {
            "is_success": True,
            "notification": {
                "success": {
                    "title": "计算成功",
                    "description": "DeepCube脚本计算完成"
                }
            },
            "data": params
        }
    except Exception as e:
        print(f"执行错误: {str(e)}")
        return {
            "is_success": False,
            "notification": {
                "error": {
                    "title": "计算失败",
                    "description": str(e)
                }
            }
        }
`;
        
        // 更新编辑器内容
        editor.setValue(fullCode);
    }

    // 获取模态框元素
    const modal = document.getElementById('modal');
    const scriptTypeModal = document.getElementById('script-type-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementsByClassName('close')[0];
    const modalOk = document.getElementById('modal-ok');
    const modalCancel = document.getElementById('modal-cancel');
    
    // 运行确认弹框元素
    const runConfirmModal = document.getElementById('run-confirm-modal');
    const runModalClose = document.querySelector('.run-modal-close');
    const runModalCancel = document.getElementById('run-modal-cancel');
    const runModalOk = document.getElementById('run-modal-ok');
    const runScriptName = document.getElementById('run-script-name');
    const runModalParamsEditor = document.getElementById('run-modal-params-editor');
    const paramsFormatError = document.getElementById('params-format-error'); 
    const runScriptType = document.getElementById('run-script-type');

    // 脚本类型切换相关元素
    const scriptTypeSwitch = document.getElementById('script-type-switch');
    const scriptTypeLabel = document.querySelector('.script-type');
    const settingScriptTypeSwitch = document.getElementById('setting-script-type-switch');
    const settingScriptTypeLabel = document.getElementById('setting-script-type');
    const scriptTypeRadios = document.querySelectorAll('input[name="script-type"]');
    const scriptTypeOk = document.getElementById('script-type-ok');
    const scriptTypeCancel = document.getElementById('script-type-cancel');
    const scriptTypeCloseBtn = scriptTypeModal.querySelector('.close');

    // 侧边栏相关元素
    const iconButtons = document.querySelectorAll('.icon-button');
    const sidebars = document.querySelectorAll('.sidebar');
    const closeSidebarBtns = document.querySelectorAll('.close-sidebar');
    const categoryHeaders = document.querySelectorAll('.category-header');
    const templateItems = document.querySelectorAll('.template-item');
    
    // 预览相关元素
    const sidebarPreview = document.querySelector('.sidebar-preview');
    const sidebarPreviewContent = document.querySelector('.sidebar-preview-content');
    const previewClose = document.querySelector('.preview-close');
    
    // 元素设置相关元素
    const elementCode = document.getElementById('element-code');
    const elementName = document.getElementById('element-name');
    const toolbarTitle = document.querySelector('.toolbar-left span');
    const scriptType = document.querySelector('.script-type');
    
    // 控制台相关元素
    const consoleTabs = document.querySelectorAll('.console-tab');
    const consolePanels = document.querySelectorAll('.console-panel');
    const resultJsonPreview = document.getElementById('result-json-preview');
    const consoleOutput = document.getElementById('console-output');
    const paramsJsonPreview = document.getElementById('params-json-preview');
    const consoleContainer = document.querySelector('.console-container');
    const consoleClose = document.querySelector('.console-close');
    const consoleIconBtn = document.getElementById('console-btn');
    
    // 作业日志相关元素
    const logContainer = document.querySelector('.log-container');
    const logClose = document.getElementById('log-close');
    const logIconBtn = document.getElementById('log-btn');
    const jobLogList = document.getElementById('job-log-list');

    // 设置工具栏标题默认值为py_script（与元素编码默认值一致）
    toolbarTitle.textContent = 'py_script';

    // 初始化功能
    initSidebars();
    initSidebarResize();
    initSettingSections();
    initScriptTypeSwitch();
    initConsoleState();
    initLogState();
    populateJobLog(); // 预先生成一些作业日志
    initExampleData(); // 初始化示例数据
    initStepsList(); // 初始化步骤列表
    // 删除不存在的函数调用
    initCopyButtons(); // 初始化复制按钮
    initParamsManager(); // 初始化参数管理功能
    initCubeModelFeatures(); // 初始化财务模型功能
    
    // 默认激活运行参数图标
    document.querySelector('#cube-btn').click();
    
    // 默认激活控制台，显示控制台内容
    setTimeout(() => {
        consoleIconBtn.click();
    }, 100);

    // 初始化预览面板的展开/收起功能
    initPreviewPanel();

    // 图标按钮点击事件
    iconButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.id.replace('-btn', '-sidebar');
            const targetSidebar = document.getElementById(targetId);
            
            // 切换激活状态
            iconButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 显示相应的侧边栏
            sidebars.forEach(sidebar => sidebar.classList.remove('active'));
            if (targetSidebar) {
                targetSidebar.classList.add('active');
            }
            
            // 隐藏预览区，如果切换到非代码模板的侧边栏
            if (targetId !== 'code-sidebar') {
                sidebarPreview.classList.remove('visible');
            }
        });
    });
    
    // 关闭侧边栏按钮
    closeSidebarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sidebar = this.closest('.sidebar');
            sidebar.classList.remove('active');
            
            // 取消对应图标按钮的激活状态
            iconButtons.forEach(btn => btn.classList.remove('active'));
        });
    });
    
    // 预览区关闭按钮
    previewClose.addEventListener('click', function() {
        sidebarPreview.classList.remove('visible');
        // 移除所有模板项的激活状态
        templateItems.forEach(item => item.classList.remove('active'));
    });
    
    // 类别标题默认展开
    categoryHeaders.forEach(header => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('i.fa-chevron-up, i.fa-chevron-down');
        const docLink = header.querySelector('.doc-link');
        
        // 确保所有分组默认展开
        content.classList.add('expanded');
        if (icon && icon.classList.contains('fa-chevron-down')) {
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
        
        // 点击事件控制展开/折叠
        header.addEventListener('click', function(event) {
            // 如果点击的是文档链接，不触发折叠效果
            if (docLink && (event.target === docLink || docLink.contains(event.target))) {
                event.stopPropagation();
                return;
            }
            
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                if (icon) icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            } else {
                content.classList.add('expanded');
                if (icon) icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
        
        // 为文档链接添加单独的点击事件，防止冒泡
        if (docLink) {
            docLink.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        }
    });
    
    // 模板项点击事件和预览功能
    templateItems.forEach(item => {
        // 点击事件 - 在侧边栏内显示代码预览
        item.addEventListener('click', function(event) {
            event.preventDefault();
            
            // 清除其他模板项的激活状态
            templateItems.forEach(t => t.classList.remove('active'));
            // 设置当前项为激活状态
            this.classList.add('active');
            
            // 获取模板名称
            const templateName = this.textContent;
            
            // 从templateData中获取对应的代码
            const template = window.templateData.find(t => t.name === templateName);
            let templateCode = template ? template.code : '';
            
            // 显示预览区
            sidebarPreview.classList.add('visible');
            
            // 设置预览内容
            showCodePreview(templateCode);
            
            // 添加一个日志到结果控制台
            logToResultConsole(`已预览"${templateName}"模板`);
        });
    });
    
    // 预览区操作按钮事件
    const previewCopy = document.querySelector('.preview-copy');
    const previewInsert = document.querySelector('.preview-insert');
    
    // 修复复制功能
    previewCopy.addEventListener('click', function() {
        // 获取保存的原始代码
        const codeElement = sidebarPreviewContent.querySelector('code');
        const originalCode = codeElement ? codeElement.getAttribute('data-original-code') : sidebarPreviewContent.textContent;
        
        navigator.clipboard.writeText(originalCode)
            .then(() => {
                logToResultConsole('已复制代码到剪贴板');
            })
            .catch(err => {
                logToErrorConsole('复制失败: ' + err);
            });
    });
    
    // 修复插入功能
    previewInsert.addEventListener('click', function() {
        // 获取保存的原始代码
        const codeElement = sidebarPreviewContent.querySelector('code');
        const originalCode = codeElement ? codeElement.getAttribute('data-original-code') : sidebarPreviewContent.textContent;
        
        editor.setValue(originalCode);
        logToResultConsole('已将代码插入到编辑器');
    });
    
    // 控制台标签切换事件
    consoleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // 切换标签激活状态
            consoleTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 切换面板显示
            consolePanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(`${tabName}-console`).classList.add('active');
        });
    });

    // 关闭模态框
    modalClose.onclick = function() {
        modal.style.display = 'none';
    };
    
    modalCancel.onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    
    // 控制台收起/展开按钮点击事件
    consoleClose.addEventListener('click', function() {
        // 隐藏控制台
        consoleContainer.style.display = 'none';
        // 移除激活状态
        consoleIconBtn.classList.remove('active');
    });
    
    // 作业日志收起/展开按钮点击事件
    logClose.addEventListener('click', function() {
        // 隐藏日志面板
        logContainer.style.display = 'none';
        // 移除激活状态
        logIconBtn.classList.remove('active');
    });

    // 控制台按钮点击事件 - 显示/隐藏控制台
    consoleIconBtn.addEventListener('click', function() {
        // 如果控制台已显示，则隐藏它
        if (consoleContainer.style.display === 'flex') {
            consoleContainer.style.display = 'none';
            this.classList.remove('active');
            return;
        }
        
        // 激活控制台图标
        this.classList.add('active');
        logIconBtn.classList.remove('active');
        
        // 显示控制台，隐藏日志面板
        consoleContainer.style.display = 'flex';
        
        // 确保控制台高度设置正确
        if (!consoleContainer.style.height || consoleContainer.style.height === 'auto') {
            const viewportHeight = window.innerHeight;
            const initialHeight = Math.floor(viewportHeight / 3);
            consoleContainer.style.height = initialHeight + 'px';
        }
        
        // 隐藏日志面板
        logContainer.style.display = 'none';
        
        // 默认激活第一个tab
        const firstConsoleTab = document.querySelector('.console-container .console-tab:first-child');
        if (firstConsoleTab) {
            // 取消所有tab激活状态
            document.querySelectorAll('.console-container .console-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            // 激活第一个tab
            firstConsoleTab.classList.add('active');
            
            // 显示对应面板
            const tabName = firstConsoleTab.getAttribute('data-tab');
            document.querySelectorAll('.console-container .console-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`${tabName}-console`).classList.add('active');
        }
    });
    
    // 作业日志按钮点击事件 - 显示/隐藏日志面板
    logIconBtn.addEventListener('click', function() {
        // 如果日志面板已显示，则隐藏它
        if (logContainer.style.display === 'flex') {
            logContainer.style.display = 'none';
            this.classList.remove('active');
            return;
        }
        
        // 激活日志图标
        this.classList.add('active');
        consoleIconBtn.classList.remove('active');
        
        // 显示日志面板，隐藏控制台
        logContainer.style.display = 'flex';
        
        // 确保日志面板高度正确设置为屏幕的1/3（如果之前未设置）
        if (!logContainer.style.height || logContainer.style.height === 'auto') {
            const viewportHeight = window.innerHeight;
            const initialHeight = Math.floor(viewportHeight / 3);
            logContainer.style.height = initialHeight + 'px';
        }
        
        // 隐藏控制台
        consoleContainer.style.display = 'none';
        
        // 默认激活第一个tab
        const firstLogTab = document.querySelector('.log-container .console-tab:first-child');
        if (firstLogTab) {
            // 取消所有tab激活状态
            document.querySelectorAll('.log-container .console-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            // 激活第一个tab
            firstLogTab.classList.add('active');
            
            // 显示对应面板
            const tabName = firstLogTab.getAttribute('data-tab');
            document.querySelectorAll('.log-container .console-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`${tabName}-console`).classList.add('active');
        }
    });

    // 添加控制台输出的函数
    function logToResultConsole(message) {
        logToConsole(message);
    }
    
    // 添加错误输出的函数
    function logToErrorConsole(message) {
        logToConsole(message, 'error');
        
        // 自动切换到控制台标签
        consoleTabs.forEach(tab => tab.classList.remove('active'));
        consolePanels.forEach(panel => panel.classList.remove('active'));
        document.querySelector('.console-tab[data-tab="console"]').classList.add('active');
        document.getElementById('console-console').classList.add('active');
    }

    // 运行脚本的函数 - 实际执行Python代码
    function runScript() {
        const code = editor.getValue();
        
        // 清空控制台和结果面板
        consoleOutput.innerHTML = '';
        
        // 准备参数对象
        const paramsObject = {};
        try {
            // 尝试从控制台的参数面板获取参数
            const paramsJsonPreview = document.getElementById('params-json-preview');
            if (paramsJsonPreview && paramsJsonPreview.dataset.originalJson) {
                const paramsJson = paramsJsonPreview.dataset.originalJson;
                Object.assign(paramsObject, JSON.parse(paramsJson));
            }
        } catch (e) {
            logToErrorConsole('解析参数时出错: ' + e.message);
        }
        
        // 开始记录控制台输出
        logToResultConsole('========== 执行脚本 ==========');
        logToJobLog('开始执行脚本', 'info');
        
        // 计时开始
        const startTime = new Date().getTime();
        
        // 更新执行时间为0
        updateExecutionTime(0);
        
        // 确保控制台显示
        consoleContainer.style.display = 'flex';
        consoleIconBtn.classList.add('active');
        
        // 切换到控制台选项卡
        consoleTabs.forEach(tab => tab.classList.remove('active'));
        consolePanels.forEach(panel => panel.classList.remove('active'));
        document.querySelector('.console-tab[data-tab="console"]').classList.add('active');
        document.getElementById('console-console').classList.add('active');
        
        if (consoleClose.querySelector('i')) {
            consoleClose.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
        }
        
        // 请求数据
        const requestData = {
            code: code,
            params: paramsObject
        };
        
        // 获取后端API地址 - 默认使用5001端口，可以通过环境变量配置
        const backendUrl = 'http://192.168.128.1:5566/api/run';
        
        // 发送请求到后端
        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            // 计算实际执行时间
            const execTimeMs = data.execution_time;
            
            // 更新执行时间显示
            updateExecutionTime(execTimeMs);
            
            // 处理控制台输出
            // 首先显示标准输出
            if (data.stdout && data.stdout.length > 0) {
                data.stdout.forEach(line => {
                    logToConsole(line);
                });
            }
            
            // 然后显示标准错误（如果有）
            if (data.stderr && data.stderr.length > 0) {
                logToErrorConsole(data.stderr);
            }
            
            // 处理结果数据
            const resultData = {
                "is_success": data.is_success,
                "data": data.result || {},
                "execution_time": execTimeMs
            };
            
            // 添加执行结果到控制台
            if (data.is_success) {
                logToConsole('========== 执行完成 ========== 耗时: ' + (execTimeMs / 1000).toFixed(2) + '秒', 'success');
                logToJobLog(`========== 执行完成 ========== 耗时: ${(execTimeMs / 1000).toFixed(2)}秒`, 'success');
            } else {
                logToConsole('脚本执行失败，耗时: ' + (execTimeMs / 1000).toFixed(2) + '秒', 'error');
                logToJobLog(`脚本执行失败，耗时: ${(execTimeMs / 1000).toFixed(2)}秒`, 'error');
            }
            
            // 在结果面板显示JSON
            displayJsonData(resultData, resultJsonPreview);
            
            // 切换到结果标签
            consoleTabs.forEach(tab => tab.classList.remove('active'));
            consolePanels.forEach(panel => panel.classList.remove('active'));
            document.querySelector('.console-tab[data-tab="result"]').classList.add('active');
            document.getElementById('result-console').classList.add('active');
        })
        .catch(error => {
            const endTime = new Date().getTime();
            const execTimeMs = endTime - startTime;
            
            updateExecutionTime(execTimeMs);
            
            logToErrorConsole('执行请求出错: ' + error.message);
            logToJobLog('执行请求出错: ' + error.message, 'error');
            
            // 创建错误结果
            const errorResult = {
                "is_success": false,
                "error": error.message,
                "execution_time": execTimeMs
            };
            
            // 显示错误结果
            displayJsonData(errorResult, resultJsonPreview);
        });
    }
    
    // 输出到控制台
    function logToConsole(message, type = 'normal') {
        // 如果是第一次添加内容，清除暂无数据提示
        if (consoleOutput.querySelector('.no-data-placeholder')) {
            consoleOutput.innerHTML = '';
        }
        
        const line = document.createElement('div');
        line.textContent = message;
        
        if (type === 'error') {
            line.className = 'error-output';
        } else if (type === 'success') {
            line.className = 'success-output';
        } else if (type === 'warning') {
            line.className = 'warning-output';
        }
        
        consoleOutput.appendChild(line);
        // 滚动到底部
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    // 更新执行时间
    function updateExecutionTime(timeMs) {
        const executionTimeElement = document.getElementById('execution-time');
        if (executionTimeElement) {
            executionTimeElement.textContent = `运行时长 ${timeMs}ms`;
        }
    }

    // 运行脚本按钮
    document.getElementById('run-script').addEventListener('click', function() {
        // 获取参数对象
        const paramsObject = {};
        try {
            const paramsJsonPreview = document.getElementById('params-json-preview');
            if (paramsJsonPreview && paramsJsonPreview.dataset.originalJson) {
                const paramsJson = paramsJsonPreview.dataset.originalJson;
                Object.assign(paramsObject, JSON.parse(paramsJson));
            }
        } catch (e) {
            logToErrorConsole('解析参数时出错: ' + e.message);
            return;
        }
        
        // 更新运行确认弹框信息
        runScriptName.textContent = document.querySelector('.toolbar-left span').textContent || 'py_script';
        runScriptType.textContent = scriptTypeLabel.textContent || '通用';
        
        // 格式化参数并显示
        const formattedParams = JSON.stringify(paramsObject, null, 2);
        runModalParamsEditor.value = formattedParams;
        
        // 清除错误信息
        paramsFormatError.textContent = '';
        
        // 显示运行确认弹框
        runConfirmModal.style.display = 'block';
    });
    
    // 验证JSON格式的函数
    function validateJSON(jsonString) {
        try {
            JSON.parse(jsonString);
            return { isValid: true };
        } catch (e) {
    return {
                isValid: false, 
                error: e.message 
            };
        }
    }
    
    // 参数编辑器输入事件 - 实时验证JSON
    runModalParamsEditor.addEventListener('input', function() {
        const jsonString = this.value.trim();
        
        // 如果为空，不验证
        if (!jsonString) {
            paramsFormatError.textContent = '';
            return;
        }
        
        // 验证JSON格式
        const validation = validateJSON(jsonString);
        if (!validation.isValid) {
            paramsFormatError.textContent = '参数格式错误: ' + validation.error;
        } else {
            paramsFormatError.textContent = '';
        }
    });
    
    // 运行确认弹框关闭按钮
    runModalClose.addEventListener('click', function() {
        runConfirmModal.style.display = 'none';
    });
    
    // 运行确认弹框取消按钮
    runModalCancel.addEventListener('click', function() {
        runConfirmModal.style.display = 'none';
    });
    
    // 运行确认弹框确定按钮
    runModalOk.addEventListener('click', function() {
        // 获取并验证用户编辑的参数
        const paramsString = runModalParamsEditor.value.trim();
        
        // 如果参数不为空，验证其格式
        if (paramsString) {
            const validation = validateJSON(paramsString);
            if (!validation.isValid) {
                paramsFormatError.textContent = '参数格式错误: ' + validation.error;
                return; // 阻止执行
            }
        }
        
        // 关闭弹框
        runConfirmModal.style.display = 'none';
        
        // 如果已修改参数，则更新参数预览面板
        if (paramsString) {
            try {
                const newParams = JSON.parse(paramsString);
                // 更新参数预览面板
                const paramsJsonPreview = document.getElementById('params-json-preview');
                if (paramsJsonPreview) {
                    displayJsonData(newParams, paramsJsonPreview);
                }
            } catch (e) {
                // JSON应该已经验证过，这里不应该发生错误
                console.error('更新参数出错:', e);
            }
        }
        
        // 执行脚本
        runScript();
    });
    
    // 点击弹框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === runConfirmModal) {
            runConfirmModal.style.display = 'none';
        }
    });
    
    // 初始欢迎信息
    logToResultConsole('DeepCube Web编辑器已启动');
    logToResultConsole('可以通过左侧图标访问不同功能');
    
    // 显示模态框的函数
    function showModal(title, message, okCallback = null) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = 'block';
        
        if (okCallback) {
            modalOk.onclick = function() {
                okCallback();
                modal.style.display = 'none';
            };
        } else {
            modalOk.onclick = function() {
                modal.style.display = 'none';
            };
        }
    }
    
    // 初始化：展开所有分类（已在HTML中设置）
    
    // 元素编码输入事件
    elementCode.addEventListener('input', function() {
        document.querySelector('.toolbar-left span:nth-of-type(1)').textContent = this.value;
    });
    
    // 初始化控制台拖拽功能
    function initConsoleResize() {
        const consoleContainer = document.querySelector('.console-container');
        const logContainer = document.querySelector('.log-container');
        
        // 为控制台添加拖拽功能
        addResizeHandlers(consoleContainer);
        
        // 为日志容器添加拖拽功能
        addResizeHandlers(logContainer);
        
        function addResizeHandlers(container) {
            let startY, startHeight;
            
            // 获取容器内的tabs元素
            const tabsElement = container.querySelector('.console-tabs');
            
            if (tabsElement) {
                // 添加一个专门的拖拽区域
                const dragHandle = document.createElement('div');
                dragHandle.className = 'console-resize-handle';
                tabsElement.appendChild(dragHandle);
                
                // 监听鼠标按下事件，开始拖拽 - 针对整个tabs区域
                tabsElement.addEventListener('mousedown', function(e) {
                    // 如果容器被收起或隐藏，不允许拖拽
                    if (container.classList.contains('collapsed') || container.style.display === 'none') {
                        return;
                    }
                    
                    // 如果点击在控制台tab、关闭按钮或执行时间上，不开始拖拽
                    if (e.target.closest('.console-tab') || 
                        e.target.closest('.console-close') || 
                        e.target.closest('.execution-time')) {
                        return;
                    }
                    
                    e.preventDefault();
                    startY = e.clientY;
                    startHeight = parseInt(document.defaultView.getComputedStyle(container).height, 10);
                    
                    // 添加拖拽中的标记类
                    document.body.classList.add('resizing-console');
                    
                    // 监听鼠标移动事件
                    document.addEventListener('mousemove', resizeContainer);
                    
                    // 监听鼠标释放事件，结束拖拽
                    document.addEventListener('mouseup', stopResize);
                });
            }
            
            // 鼠标移动时调整容器高度
            function resizeContainer(e) {
                // 计算新高度（向上拖动增加高度，向下拖动减少高度）
                const newHeight = startHeight - (e.clientY - startY);
                
                // 设置最小高度限制 (100px)
                if (newHeight >= 100) {
                    container.style.height = newHeight + 'px';
                    
                    // 将新高度保存到CSS变量，使得其他组件也能感知高度变化
                    if(container.classList.contains('console-container')) {
                        document.documentElement.style.setProperty('--console-height', newHeight + 'px');
                    }
                }
            }
            
            // 停止拖拽
            function stopResize() {
                document.removeEventListener('mousemove', resizeContainer);
                document.removeEventListener('mouseup', stopResize);
                document.body.classList.remove('resizing-console');
            }
        }
    }
    
    // 初始化控制台拖拽
    initConsoleResize();

    // 保存和上传功能
    document.getElementById('save-script').addEventListener('click', function() {
        const code = editor.getValue();
        logToResultConsole('脚本已保存');
        logToJobLog('脚本已成功保存', 'success');
    });
    
    document.getElementById('upload-script').addEventListener('click', function() {
        logToResultConsole('开始上传代码');
        logToJobLog('开始上传代码文件', 'info');
        
        setTimeout(() => {
            logToJobLog('代码文件上传完成', 'success');
        }, 1500);
    });

    // 输出结构定义部分的控制
    const enableOutputStructure = document.getElementById('enable-output-structure');
    const outputStructureGroups = document.querySelectorAll('.output-structure-group');
    
    if (enableOutputStructure) {
        enableOutputStructure.addEventListener('change', function() {
            outputStructureGroups.forEach(group => {
                if (this.checked) {
                    group.style.display = 'block';
                } else {
                    group.style.display = 'none';
                }
        });
    });
    }
    
    // 初始化折叠区域
    function initSettingSections() {
        const sections = document.querySelectorAll('.setting-section');
        const tabs = document.querySelectorAll('.setting-tab');
        
        // 隐藏财务模型标签页
        const financeTab = document.querySelector('.setting-tab[data-section="finance"]');
        if (financeTab) {
            financeTab.style.display = 'none';
        }
        
        // 默认显示第一个可见的标签页
        const firstVisibleTab = document.querySelector('.setting-tab:not([style*="display: none"])');
        if (firstVisibleTab) {
            firstVisibleTab.classList.add('active');
            const sectionId = firstVisibleTab.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        }
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.style.display !== 'none') {  // 只处理可见的标签页
                    const sectionId = tab.getAttribute('data-section');
                    
                    // 移除所有标签和内容的active类
                    tabs.forEach(t => t.classList.remove('active'));
                    sections.forEach(s => s.classList.remove('active'));
                    
                    // 添加当前标签和内容的active类
                    tab.classList.add('active');
                    document.getElementById(sectionId).classList.add('active');
                }
            });
        });
    }
    
    // 初始化侧边栏
    function initSidebars() {
        // 为每个侧边栏添加调整大小的元素
        sidebars.forEach(sidebar => {
            const resizer = document.createElement('div');
            resizer.className = 'sidebar-resizer';
            sidebar.appendChild(resizer);
        });

        // 确保所有折叠部分默认展开
        const sectionContents = document.querySelectorAll('.section-content');
        sectionContents.forEach(content => {
            content.classList.add('expanded');
            const header = content.previousElementSibling;
            if (header && header.querySelector('i')) {
                header.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
    }
    
    // 初始化侧边栏宽度调整功能
    function initSidebarResize() {
        const resizers = document.querySelectorAll('.sidebar-resizer');
        
        resizers.forEach(resizer => {
            let startX, startWidth;
            
            resizer.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                startX = e.clientX;
                const sidebar = this.parentElement;
                startWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
                
                document.addEventListener('mousemove', resizeSidebar);
                document.addEventListener('mouseup', stopResize);
                
                // 添加激活状态
            this.classList.add('active');
            });
            
            function resizeSidebar(e) {
                const sidebar = resizer.parentElement;
                const newWidth = startWidth + (e.clientX - startX);
                
                // 检查最小和最大宽度
                const minWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-min-width'));
                const maxWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-max-width'));
                
                if (newWidth >= minWidth && newWidth <= maxWidth) {
                    sidebar.style.width = newWidth + 'px';
                }
            }
            
            function stopResize() {
                document.removeEventListener('mousemove', resizeSidebar);
                document.removeEventListener('mouseup', stopResize);
                
                // 移除激活状态
                resizer.classList.remove('active');
            }
        });
    }
    
    // 显示代码预览，确保纯文本显示而不是HTML
    function showCodePreview(code) {
        const previewElement = document.getElementById('preview-code');
        
        // 清空预览元素的内容
        previewElement.innerHTML = '';
        
        // 创建一个包含纯文本的代码元素
        const codeElement = document.createElement('code');
        
        // 保存原始代码作为属性
        codeElement.setAttribute('data-original-code', code);
        
        // 设置纯文本内容
        codeElement.textContent = code;
        
        // 应用高亮
        highlightCode(codeElement);
        
        // 添加到预览元素
        previewElement.appendChild(codeElement);
    }
    
    // 代码高亮函数
    function highlightCode(element) {
        const code = element.textContent;
        
        // 创建一个文档片段，用于保存高亮后的内容
        const fragment = document.createDocumentFragment();
        
        // 按行分割代码
        const lines = code.split('\n');
        
        lines.forEach((line, index) => {
            // 创建行容器
            const lineElement = document.createElement('div');
            lineElement.className = 'code-line';
            
            // 高亮注释
            if (line.trim().startsWith('#')) {
                const commentElement = document.createElement('span');
                commentElement.className = 'comment';
                commentElement.textContent = line;
                lineElement.appendChild(commentElement);
            }
            // 处理其他代码行
            else {
                // 分割并处理各部分
                let remaining = line;
                let lastIndex = 0;
                
                // 关键字正则表达式
                const keywordRegex = /\b(import|from|def|class|if|elif|else|for|while|in|try|except|finally|return|yield|with|as|continue|break|and|or|not|is|None|True|False)\b/g;
                let match;
                
                // 重置正则表达式
                keywordRegex.lastIndex = 0;
                
                while ((match = keywordRegex.exec(line)) !== null) {
                    // 添加关键字前的部分
                    if (match.index > lastIndex) {
                        const beforeText = document.createTextNode(line.substring(lastIndex, match.index));
                        lineElement.appendChild(beforeText);
                    }
                    
                    // 添加关键字
                    const keyword = document.createElement('span');
                    keyword.className = 'keyword';
                    keyword.textContent = match[0];
                    lineElement.appendChild(keyword);
                    
                    lastIndex = match.index + match[0].length;
                }
                
                // 添加剩余部分
                if (lastIndex < line.length) {
                    const afterText = document.createTextNode(line.substring(lastIndex));
                    lineElement.appendChild(afterText);
                }
                
                // 如果没有匹配到任何关键字，直接添加整行
                if (lastIndex === 0) {
                    lineElement.textContent = line;
                }
            }
            
            fragment.appendChild(lineElement);
            
            // 在每行后添加换行符，除了最后一行
            if (index < lines.length - 1) {
                fragment.appendChild(document.createElement('br'));
            }
        });
        
        // 清空原有内容并添加高亮后的内容
        element.innerHTML = '';
        element.appendChild(fragment);
    }
    
    // 应用代码高亮（使用本地高亮而不是HTML替换）
    function applyCodeHighlight(code, element) {
        // 设置原始文本并应用高亮
        showCodePreview(code);
    }

    // 初始化脚本类型切换功能
    function initScriptTypeSwitch() {
        // 获取警告提示元素
        const scriptTypeWarning = document.getElementById('script-type-warning');
        
        // 设置初始脚本类型状态
        updateScriptTypeDisplay('DeepCube计算脚本');
        
        // 顶部脚本类型点击事件
        scriptTypeSwitch.addEventListener('click', function() {
            openScriptTypeModal();
        });
        
        // 设置中的脚本类型点击事件
        settingScriptTypeSwitch.addEventListener('click', function() {
            openScriptTypeModal();
        });
        
        // 监听单选按钮变更事件
        scriptTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const currentType = scriptTypeLabel.textContent;
                
                // 如果选择的类型与当前类型不同，显示警告提示
                if (this.value !== currentType) {
                    // 显示警告并重新触发动画
                    scriptTypeWarning.style.display = 'block';
                    scriptTypeWarning.style.animation = 'none';
                    // 触发重排
                    void scriptTypeWarning.offsetWidth;
                    scriptTypeWarning.style.animation = 'warning-flash 1.5s ease-in-out';
                } else {
                    // 隐藏警告
                    scriptTypeWarning.style.display = 'none';
                }
            });
        });
        
        // 确定按钮
        scriptTypeOk.addEventListener('click', function() {
            // 获取选中的脚本类型
            let selectedType = '';
            scriptTypeRadios.forEach(radio => {
                if (radio.checked) {
                    selectedType = radio.value;
                }
            });
            
            // 更新所有显示位置
            updateScriptTypeDisplay(selectedType);
            
            // 关闭弹窗
            scriptTypeModal.style.display = 'none';
            
            // 隐藏警告提示
            scriptTypeWarning.style.display = 'none';
            
            // 记录操作
            logToResultConsole(`已将脚本类型设置为"${selectedType}"`);
        });
        
        // 取消按钮
        scriptTypeCancel.addEventListener('click', function() {
            scriptTypeModal.style.display = 'none';
            // 隐藏警告提示
            scriptTypeWarning.style.display = 'none';
        });
        
        // 关闭按钮
        scriptTypeCloseBtn.addEventListener('click', function() {
            scriptTypeModal.style.display = 'none';
            // 隐藏警告提示
            scriptTypeWarning.style.display = 'none';
        });
        
        // 点击弹窗外部关闭
        window.addEventListener('click', function(event) {
            if (event.target === scriptTypeModal) {
                scriptTypeModal.style.display = 'none';
                // 隐藏警告提示
                scriptTypeWarning.style.display = 'none';
            }
        });
    }
    
    // 打开脚本类型选择弹窗
    function openScriptTypeModal() {
        // 根据当前脚本类型选中对应单选按钮
        const currentType = scriptTypeLabel.textContent;
        scriptTypeRadios.forEach(radio => {
            if (radio.value === currentType) {
                radio.checked = true;
            }
        });
        
        // 隐藏警告提示
        const scriptTypeWarning = document.getElementById('script-type-warning');
        scriptTypeWarning.style.display = 'none';
        
        // 显示弹窗
        scriptTypeModal.style.display = 'block';
    }
    
    // 更新所有脚本类型显示
    function updateScriptTypeDisplay(type) {
        // 更新顶部工具栏显示
        scriptTypeLabel.textContent = type;
        
        // 更新设置中的显示
        settingScriptTypeLabel.textContent = type;
        
        // 设置样式
        if (type === 'DeepCube计算脚本') {
            scriptTypeLabel.classList.add('script-type-deepcube');
            settingScriptTypeLabel.classList.add('script-type-deepcube');
        } else {
            scriptTypeLabel.classList.remove('script-type-deepcube');
            settingScriptTypeLabel.classList.remove('script-type-deepcube');
        }
    }

    // 初始化控制台状态
    function initConsoleState() {
        // 默认设置控制台高度为屏幕的1/3
        const viewportHeight = window.innerHeight;
        const initialHeight = Math.floor(viewportHeight / 3);
        
        // 设置控制台初始高度
        consoleContainer.style.height = initialHeight + 'px';
        
        // 同时更新CSS变量，确保所有相关组件都能感知高度变化
        document.documentElement.style.setProperty('--console-height', initialHeight + 'px');
        
        // 默认隐藏控制台，但在点击控制台按钮时会显示
        consoleContainer.style.display = 'none';
    }

    // 初始化作业日志状态
    function initLogState() {
        // 设置日志面板高度为屏幕的1/3
        const viewportHeight = window.innerHeight;
        const initialHeight = Math.floor(viewportHeight / 3);
        
        // 设置日志面板初始高度
        logContainer.style.height = initialHeight + 'px';
        
        // 默认隐藏日志面板
        logContainer.style.display = 'none';
    }

    // 生成示例作业日志
    function populateJobLog() {
        // 使用从logData.js引入的数据
        const logEntries = window.logData || [];
        
        // 清空现有日志
        jobLogList.innerHTML = '';
        
        // 添加日志条目
        logEntries.forEach(entry => {
            const statusClass = entry.type === 'warning' ? 'log-status-warning' : 
                              entry.type === 'error' ? 'log-status-error' : 
                              entry.type === 'success' ? 'log-status-success' : 'log-status-info';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.startTime}</td>
                <td>${entry.endTime}</td>
                <td>${entry.user}</td>
                <td class="${statusClass}">${entry.status}</td>
                <td><a href="javascript:void(0)" class="log-action-link" data-log-id="${entry.id}">查看</a></td>
            `;
            jobLogList.appendChild(row);
        });
        
        // 添加日志详情查看功能
        const logActions = document.querySelectorAll('.log-action-link');
        logActions.forEach(action => {
            action.addEventListener('click', function() {
                const logId = this.getAttribute('data-log-id');
                showLogDetailSidebar(logId);
            });
        });

        // 更新分页信息
        document.querySelector('.page-info').textContent = `显示第 1-${logEntries.length} 项结果，共 ${logEntries.length} 项`;
    }

    // 显示日志详情侧边栏
    function showLogDetailSidebar(logId) {
        // 找到对应的日志数据
        const logId_int = parseInt(logId);
        const logEntry = window.logData.find(entry => entry.id === logId_int);
        
        if (!logEntry) return;

        // 填充详情侧边栏
        document.getElementById('detail-job-name').textContent = logEntry.jobName;
        document.getElementById('detail-operation-target').textContent = logEntry.operationTarget;
        document.getElementById('detail-app').textContent = logEntry.app;
        document.getElementById('detail-user').textContent = logEntry.email;
        document.getElementById('detail-submit-time').textContent = logEntry.submitTime;
        document.getElementById('detail-start-time').textContent = logEntry.startTime;
        document.getElementById('detail-end-time').textContent = logEntry.endTime || '进行中';
        
        // 设置状态并应用相应的样式类
        const statusEl = document.getElementById('detail-status');
        statusEl.textContent = logEntry.status;
        
        // 清除所有状态类
        statusEl.classList.remove('log-status-success', 'log-status-error', 'log-status-warning', 'log-status-info');
        
        // 添加对应状态类
        statusEl.classList.add(`log-status-${logEntry.type}`);

        // 示例结果数据
        const resultData = {
            "is_success": logEntry.type === 'success',
            "data": {
                "total_records": 234,
                "processed_records": 234,
                "summary": {
                    "total_headcount": 234,
                    "total_salary": 3504580.45,
                    "avg_salary": 14977.69
                }
            },
            "execution_time": logEntry.type === 'info' ? null : 3.0
        };
        
        // 显示结果JSON
        displayJsonData(resultData, document.getElementById('detail-result'));
        
        // 显示侧边栏
        document.getElementById('log-detail-sidebar').classList.add('visible');
    }
    
    // 日志详情侧边栏关闭按钮事件
    document.getElementById('detail-close').addEventListener('click', function() {
        document.getElementById('log-detail-sidebar').classList.remove('visible');
    });

    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(btn => {
        if (btn.textContent) { // 排除带图标的按钮
            btn.addEventListener('click', function() {
                // 移除所有按钮的激活状态
                pageButtons.forEach(b => b.classList.remove('active'));
                // 设置当前按钮为激活状态
                this.classList.add('active');
                // 这里应该添加加载对应页数据的逻辑
                // 更新分页信息文本
                const page = this.textContent;
                const itemsPerPage = document.querySelector('.page-size').value;
                const start = (page - 1) * itemsPerPage + 1;
                const end = start + parseInt(itemsPerPage) - 1;
                document.querySelector('.page-info').textContent = `显示第 ${start}-${end} 项结果，共 10000 项`;
            });
        }
    });
    
    // 每页显示条数变化
    document.querySelector('.page-size').addEventListener('change', function() {
        const itemsPerPage = this.value;
        // 更新分页信息
        const totalItems = window.logData ? window.logData.length : 0;
        document.querySelector('.page-info').textContent = `显示第 1-${Math.min(itemsPerPage, totalItems)} 项结果，共 ${totalItems} 项`;
        // 这里应该添加重新加载数据的逻辑
    });

    // 添加作业日志输出的函数
    function logToJobLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const fullTimestamp = new Date().toLocaleString();
        const status = type === 'warning' ? '警告' : 
                     type === 'error' ? '失败' : 
                     type === 'success' ? '成功' : '进行中';
        const statusClass = type === 'warning' ? 'log-status-warning' : 
                          type === 'error' ? 'log-status-error' : 
                          type === 'success' ? 'log-status-success' : 'log-status-info';
        
        // 生成唯一ID
        const logId = Date.now();
        
        // 创建新的日志数据
        const newLogEntry = {
            id: logId,
            jobName: 'HR_budget.action.query_hc_duration',
            operationTarget: 'Python脚本',
            app: '人力预算 (v0.2 最新试用版演示)',
            user: 'wenjun.zhou',
            email: 'wenjun.zhou@proinnova.com.cn',
            submitTime: fullTimestamp,
            startTime: fullTimestamp,
            endTime: type === 'info' ? '' : fullTimestamp,
            status: status,
            type: type,
            hasAttachment: false
        };
        
        // 添加到日志数据
        if (window.logData) {
            window.logData.unshift(newLogEntry);
        }
        
        // 创建日志条目
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${newLogEntry.startTime}</td>
            <td>${newLogEntry.endTime}</td>
            <td>${newLogEntry.user}</td>
            <td class="${statusClass}">${status}</td>
            <td><a href="javascript:void(0)" class="log-action-link" data-log-id="${logId}">查看</a></td>
        `;
        
        // 添加点击事件
        row.querySelector('.log-action-link').addEventListener('click', function() {
            showLogDetailSidebar(logId);
        });
        
        // 添加到列表
        jobLogList.prepend(row);
        
        // 更新分页信息
        const currentCount = window.logData ? window.logData.length : 1;
        document.querySelector('.page-info').textContent = `显示第 1-${Math.min(currentCount, 20)} 项结果，共 ${currentCount} 项`;
    }

    // 初始化示例数据
    function initExampleData() {
        // 示例结果数据（JSON格式）
        const resultData = "暂无数据，运行后查看";
        
        // 示例参数数据
        const paramsData = {
            "param1": "2024"
        };
        
        // 在控制台中显示这些示例数据
        displayJsonData(resultData, resultJsonPreview);
        displayJsonData(paramsData, paramsJsonPreview);
        
        // 为控制台输出添加一些示例内容
        consoleOutput.innerHTML = `
<div>[09:17:03] 开始执行脚本...</div>
<div>[09:17:04] 正在连接到数据源...</div>
<div>[09:17:05] 成功连接数据源</div>
<div>[09:17:06] 正在获取invoice_details表数据</div>
<div>[09:17:07] 已获取customers表数据，共123条记录</div>
<div>[09:17:08] 已获取profit_centers表数据，共15条记录</div>
<div>[09:17:09] 已获取areas表数据，共8条记录</div>
<div>[09:17:10] 已获取costs表数据，共1500条记录</div>
<div>[09:17:12] 正在合并数据...</div>
<div class="success-output">[09:17:14] 数据合并完成，共处理1534条记录</div>
<div class="success-output">[09:17:15] 脚本执行完成，耗时: 12.5秒</div>
`;
    }
    
    // 显示JSON数据的函数
    function displayJsonData(data, container) {
        // 保存原始数据以便复制
        container.dataset.originalJson = JSON.stringify(data);
        
        // 清空容器
        container.innerHTML = '';
        
        // 移除暂无数据提示
        const placeholder = container.querySelector('.no-data-placeholder');
        if (placeholder) {
            container.removeChild(placeholder);
        }
        
        // 创建JSON树
        const jsonTree = createJsonTree(data);
        container.appendChild(jsonTree);
        
        // 绑定展开/折叠事件
        initJsonTreeEvents(container);
    }
    
    // 创建JSON树结构
    function createJsonTree(data) {
        const root = document.createElement('div');
        root.className = 'json-tree';
        
        if (Array.isArray(data)) {
            appendArrayNode(root, data, 0);
        } else if (typeof data === 'object' && data !== null) {
            appendObjectNode(root, data, 0);
        } else {
            appendPrimitiveNode(root, data, 0);
        }
        
        return root;
    }
    
    // 添加对象节点
    function appendObjectNode(parent, obj, level) {
        const keys = Object.keys(obj);
        const isEmpty = keys.length === 0;
        
        if (isEmpty) {
            const node = createExpandableNode('object', '{}', level);
            parent.appendChild(node);
            return;
        }
        
        const node = createExpandableNode('object', '{', level, true);
        parent.appendChild(node);
        
        const childContainer = document.createElement('div');
        childContainer.className = 'json-children';
        
        keys.forEach((key, index) => {
            const childNode = document.createElement('div');
            childNode.className = 'json-node';
            childNode.style.paddingLeft = `${(level + 1) * 20}px`;
            
            const keySpan = document.createElement('span');
            keySpan.className = 'json-key';
            keySpan.textContent = `"${key}": `;
            childNode.appendChild(keySpan);
            
            if (Array.isArray(obj[key])) {
                appendArrayNode(childNode, obj[key], level + 1);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                appendObjectNode(childNode, obj[key], level + 1);
            } else {
                appendPrimitiveNode(childNode, obj[key], level + 1);
            }
            
            // 添加逗号，除了最后一个
            if (index < keys.length - 1) {
                const comma = document.createElement('span');
                comma.textContent = ',';
                childNode.appendChild(comma);
            }
            
            childContainer.appendChild(childNode);
        });
        
        parent.appendChild(childContainer);
        
        const closingBrace = document.createElement('div');
        closingBrace.className = 'json-node json-closing-bracket';
        closingBrace.style.paddingLeft = `${level * 20}px`;
        closingBrace.textContent = '}';
        parent.appendChild(closingBrace);
    }
    
    // 添加数组节点
    function appendArrayNode(parent, arr, level) {
        const isEmpty = arr.length === 0;
        
        if (isEmpty) {
            const node = createExpandableNode('array', '[]', level);
            parent.appendChild(node);
            return;
        }
        
        const node = createExpandableNode('array', '[', level, true);
        parent.appendChild(node);
        
        const childContainer = document.createElement('div');
        childContainer.className = 'json-children';
        
        arr.forEach((item, index) => {
            const childNode = document.createElement('div');
            childNode.className = 'json-node';
            childNode.style.paddingLeft = `${(level + 1) * 20}px`;
            
            if (Array.isArray(item)) {
                appendArrayNode(childNode, item, level + 1);
            } else if (typeof item === 'object' && item !== null) {
                appendObjectNode(childNode, item, level + 1);
            } else {
                appendPrimitiveNode(childNode, item, level + 1);
            }
            
            // 添加逗号，除了最后一个
            if (index < arr.length - 1) {
                const comma = document.createElement('span');
                comma.textContent = ',';
                childNode.appendChild(comma);
            }
            
            childContainer.appendChild(childNode);
        });
        
        parent.appendChild(childContainer);
        
        const closingBracket = document.createElement('div');
        closingBracket.className = 'json-node json-closing-bracket';
        closingBracket.style.paddingLeft = `${level * 20}px`;
        closingBracket.textContent = ']';
        parent.appendChild(closingBracket);
    }
    
    // 添加基本类型节点
    function appendPrimitiveNode(parent, value, level) {
        const valueElement = document.createElement('span');
        
        if (typeof value === 'string') {
            valueElement.className = 'json-string';
            valueElement.textContent = `"${value}"`;
        } else if (typeof value === 'number') {
            valueElement.className = 'json-number';
            valueElement.textContent = value;
        } else if (typeof value === 'boolean') {
            valueElement.className = 'json-boolean';
            valueElement.textContent = value;
        } else if (value === null) {
            valueElement.className = 'json-null';
            valueElement.textContent = 'null';
        } else {
            valueElement.textContent = value;
        }
        
        parent.appendChild(valueElement);
    }
    
    // 创建可展开节点
    function createExpandableNode(type, text, level, expanded = false) {
        const node = document.createElement('div');
        node.className = `json-node json-expandable ${expanded ? 'expanded' : 'collapsed'}`;
        node.style.paddingLeft = `${level * 20}px`;
        
        const toggle = document.createElement('span');
        toggle.className = 'json-toggle';
        toggle.innerHTML = expanded ? '<i class="fas fa-caret-down"></i>' : '<i class="fas fa-caret-right"></i>';
        node.appendChild(toggle);
        
        const typeSpan = document.createElement('span');
        typeSpan.className = `json-${type}-bracket`;
        typeSpan.textContent = text;
        node.appendChild(typeSpan);
        
        if (!expanded) {
            const preview = document.createElement('span');
            preview.className = 'json-preview';
            preview.textContent = type === 'object' ? ' ... }' : ' ... ]';
            node.appendChild(preview);
        }
        
        return node;
    }
    
    // 初始化JSON树的展开/折叠事件
    function initJsonTreeEvents(container) {
        const toggles = container.querySelectorAll('.json-toggle');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const node = this.parentNode;
                const isExpanded = node.classList.contains('expanded');
                
                if (isExpanded) {
                    // 折叠
                    node.classList.remove('expanded');
                    node.classList.add('collapsed');
                    
                    // 更改图标
                    this.innerHTML = '<i class="fas fa-caret-right"></i>';
                    
                    // 添加预览
                    if (!node.querySelector('.json-preview')) {
                        const isObject = node.querySelector('.json-object-bracket') !== null;
                        const preview = document.createElement('span');
                        preview.className = 'json-preview';
                        preview.textContent = isObject ? ' ... }' : ' ... ]';
                        node.appendChild(preview);
                    }
                    
                    // 隐藏子元素和闭合括号
                    const children = node.nextElementSibling;
                    const closingBracket = children ? children.nextElementSibling : null;
                    
                    if (children && children.classList.contains('json-children')) {
                        children.style.display = 'none';
                    }
                    
                    if (closingBracket && closingBracket.classList.contains('json-closing-bracket')) {
                        closingBracket.style.display = 'none';
                    }
                } else {
                    // 展开
                    node.classList.remove('collapsed');
                    node.classList.add('expanded');
                    
                    // 更改图标
                    this.innerHTML = '<i class="fas fa-caret-down"></i>';
                    
                    // 移除预览
                    const preview = node.querySelector('.json-preview');
                    if (preview) {
                        node.removeChild(preview);
                    }
                    
                    // 显示子元素和闭合括号
                    const children = node.nextElementSibling;
                    const closingBracket = children ? children.nextElementSibling : null;
                    
                    if (children && children.classList.contains('json-children')) {
                        children.style.display = 'block';
                    }
                    
                    if (closingBracket && closingBracket.classList.contains('json-closing-bracket')) {
                        closingBracket.style.display = 'block';
                    }
                }
            });
        });
    }

    // 初始化复制按钮
    function initCopyButtons() {
        // 结果复制按钮
        const copyResultBtn = document.getElementById('copy-result-btn');
        if (copyResultBtn) {
            copyResultBtn.addEventListener('click', function() {
                copyJsonContent('result-json-preview', '结果已复制到剪贴板');
            });
        }
        
        // 参数复制按钮
        const copyParamsBtn = document.getElementById('copy-params-btn');
        if (copyParamsBtn) {
            copyParamsBtn.addEventListener('click', function() {
                copyJsonContent('params-json-preview', '参数已复制到剪贴板');
            });
        }
    }
    
    // 复制JSON内容
    function copyJsonContent(elementId, successMessage) {
        const contentElement = document.getElementById(elementId);
        if (!contentElement) return;
        
        // 尝试获取JSON对象
        let jsonObject = null;
        try {
            // 如果有原始数据，使用原始数据
            if (contentElement.dataset.originalJson) {
                jsonObject = JSON.parse(contentElement.dataset.originalJson);
            } else {
                // 尝试从HTML内容中提取JSON
                const htmlContent = contentElement.innerHTML;
                // 移除HTML标签获取纯文本
                const textContent = htmlContent.replace(/<[^>]*>/g, '')
                    .replace(/&quot;/g, '"')
                    .replace(/&nbsp;/g, ' ');
                
                jsonObject = JSON.parse(textContent);
            }
            
            // 将对象转换为漂亮的JSON字符串
            const jsonString = JSON.stringify(jsonObject, null, 2);
            
            // 复制到剪贴板
            navigator.clipboard.writeText(jsonString)
                .then(() => {
                    logToResultConsole(successMessage);
                })
                .catch(err => {
                    logToErrorConsole('复制失败: ' + err);
                });
        } catch (e) {
            logToErrorConsole('无法解析JSON: ' + e.message);
        }
    }

    // 初始化参数管理功能
    function initParamsManager() {
        // 存储所有参数的数组
        let params = [];
        
        // 获取DOM元素
        const paramsBtn = document.getElementById('params-btn');
        const paramsSidebar = document.getElementById('params-sidebar');
        const paramsList = document.getElementById('params-list');
        const paramSelectBtn = document.getElementById('param-select-btn');
        const paramDropdown = document.getElementById('param-dropdown');
        const paramSearchInput = document.querySelector('.param-search-input');
        const paramDropdownList = document.querySelector('.param-dropdown-list');
        
        // 维度字段选项
        const dimensionFields = [
            { name: 'scenario', alias: 'S' },
            { name: 'version', alias: 'V' },
            { name: 'year', alias: 'Y' },
            { name: 'period', alias: 'P' },
            { name: 'account', alias: 'A' },
            { name: 'product', alias: 'Product' }
        ];
        
        // 点击参数图标显示参数侧边栏
        paramsBtn.addEventListener('click', function() {
            // 切换激活状态
            iconButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 显示参数侧边栏
            sidebars.forEach(sidebar => sidebar.classList.remove('active'));
            paramsSidebar.classList.add('active');
            
            // 刷新参数列表
            renderParamsList();
        });
        
        // 设置脚本参数按钮点击事件
        paramSelectBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            paramDropdown.classList.toggle('show');
            renderDimensionOptions();
        });
        
        // 点击空白处收起下拉列表
        document.addEventListener('click', function(e) {
            if (!paramDropdown.contains(e.target) && e.target !== paramSelectBtn) {
                paramDropdown.classList.remove('show');
            }
        });
        
        // 搜索维度字段
        paramSearchInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase();
            const options = paramDropdownList.querySelectorAll('.param-option');
            
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                if (text.includes(searchText)) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            });
        });
        
        // 渲染维度字段选项
        function renderDimensionOptions() {
            const dropdownList = document.querySelector('.param-dropdown-list');
            dropdownList.innerHTML = '';
            
            // 获取维度字段数据
            const dimensionFields = [
                { name: 'year', alias: 'Y' },
                { name: 'period', alias: 'P' },
                { name: 'scenario', alias: 'S' },
                { name: 'version', alias: 'V' },
                { name: 'product', alias: 'Product' },
                { name: 'account', alias: 'A' }
            ];
            
            dimensionFields.forEach(field => {
                const option = document.createElement('div');
                option.className = 'param-option';
                option.innerHTML = `
                    <input type="checkbox" id="param-${field.name}" data-name="${field.name}" data-alias="${field.alias}">
                    <label for="param-${field.name}">cube1.${field.name}</label>
                `;
                
                // 添加选择事件
                option.querySelector('input').addEventListener('change', function() {
                    const isSelected = this.checked;
                    const fieldName = this.getAttribute('data-name');
                    const fieldAlias = this.getAttribute('data-alias');
                    
                    if (isSelected) {
                        addParam(fieldName, fieldAlias);
                    } else {
                        removeParam(fieldName);
                    }
                });
                
                dropdownList.appendChild(option);
            });
        }
        
        // 添加参数
        function addParam(name, alias) {
            // 检查是否已存在
            if (params.some(param => param.name === name)) {
                return;
            }
            
            // 生成编码，使用"p${字段别名}"的格式
            const code = `p${alias}`;
            
            // 添加参数
            params.push({
                name: name,
                code: code,
                type: 'string',
                defaultValue: ''
            });
            
            // 重新渲染参数列表
            renderParamsList();
        }
        
        // 删除参数
        function removeParam(name) {
            const index = params.findIndex(param => param.name === name);
            if (index !== -1) {
                params.splice(index, 1);
                renderParamsList();
                updateParamsPreview();
            }
        }
        
        // 渲染参数列表
        function renderParamsList() {
            // 清空列表
            paramsList.innerHTML = '';
            
            // 如果没有参数，显示提示信息
            if (params.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-params-message';
                emptyMessage.textContent = '还没有添加任何参数';
                paramsList.appendChild(emptyMessage);
                return;
            }
            
            // 添加每个参数到列表
            params.forEach(param => {
                const paramItem = document.createElement('div');
                paramItem.className = 'param-item';
                
                // 显示默认值的CSS类
                const defaultValueClass = param.defaultValue && param.defaultValue.trim() !== '' ? 'param-default-value' : 'param-default-value-none';
                // 显示默认值的文本
                const defaultValueText = param.defaultValue && param.defaultValue.trim() !== '' ? param.defaultValue : 'None';
                
                paramItem.innerHTML = `
                    <div class="param-info">
                        <div class="param-code">${param.code}</div>
                        <div class="param-type">${param.type}</div>
                        <div class="${defaultValueClass}">默认值: ${defaultValueText}</div>
                    </div>
                `;
                
                paramsList.appendChild(paramItem);
            });
        }
        
        // 更新控制台中的参数预览
        function updateParamsPreview() {
            const paramsJsonPreview = document.getElementById('params-json-preview');
            if (!paramsJsonPreview) return;
            
            // 创建参数对象
            const paramsObject = {};
            params.forEach(param => {
                paramsObject[param.code] = param.defaultValue;
            });
            
            // 显示参数JSON
            displayJsonData(paramsObject, paramsJsonPreview);
        }
    }

    // 初始化预览面板的展开/收起功能
    function initPreviewPanel() {
        const previewPanel = document.getElementById('preview-panel');
        const leftPanel = document.querySelector('.left-panel');
        const previewCodeBtn = document.querySelector('.preview-code-btn');
        const closePreviewBtn = document.querySelector('.close-preview');
        const refreshPreviewBtn = document.querySelector('.refresh-preview');
        const copyPreviewBtn = document.querySelector('.copy-preview');
        
        // 默认收起预览面板
        previewPanel.classList.add('collapsed');
        leftPanel.classList.add('expanded');
        
        // 点击预览代码按钮
        previewCodeBtn.addEventListener('click', function() {
            previewPanel.classList.remove('collapsed');
            leftPanel.classList.remove('expanded');
        });
        
        // 点击关闭预览按钮
        closePreviewBtn.addEventListener('click', function() {
            previewPanel.classList.add('collapsed');
            leftPanel.classList.add('expanded');
        });
        
        // 点击刷新按钮 - 目前只是重新生成预览，没有实际操作
        refreshPreviewBtn.addEventListener('click', function() {
            updatePreviewCode();
            showNotification('已刷新预览代码', 'info');
        });
        
        // 点击复制按钮
        copyPreviewBtn.addEventListener('click', function() {
            const code = editor.getValue();
            navigator.clipboard.writeText(code).then(function() {
                showNotification('代码已复制到剪贴板', 'success');
            }).catch(function(err) {
                console.error('无法复制内容: ', err);
                showNotification('复制失败', 'error');
            });
        });
    }
    
    // 显示临时通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => notification.classList.add('show'), 10);
        
        // 2秒后移除通知
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // 初始化财务模型相关功能
    function initCubeModelFeatures() {
        // 获取DOM元素
        const loadCubeBtn = document.getElementById('load-cube-btn');
        const applyCubeConfigBtn = document.getElementById('apply-cube-config');
        const cubeSelect = document.getElementById('cube-select');
        const cubePath = document.getElementById('cube-path');
        const dimensionsSection = document.getElementById('dimensions-section');
        const initDataSection = document.getElementById('init-data-section');
        const apiAliasSection = document.getElementById('api-alias-section');
        const applySection = document.getElementById('apply-section');
        const addFilterBtn = document.getElementById('add-filter-btn');
        
        // 维度和API别名配置存储
        let cubeConfig = {
            cubeName: 'cube1',
            cubePath: '',
            dimensions: [
                { alias: 'Y', name: 'year' },
                { alias: 'P', name: 'period' },
                { alias: 'S', name: 'scenario' },
                { alias: 'V', name: 'version' },
                { alias: 'A', name: 'account' },
                { alias: 'Product', name: 'product' }
            ],
            filters: [
                { dimension: 'Y', value: '2021' },
                { dimension: 'S', value: 'Actual' },
                { dimension: 'V', value: 'Working' }
            ],
            apis: [
                { alias: 'SCOPE', name: 'scope' },
                { alias: 'BLOCK', name: 'loc' },
                { alias: 'SUBMIT_DATA', name: 'submit_calc' }
            ]
        };
        
        // 加载模型按钮点击事件
        if (loadCubeBtn) {
            loadCubeBtn.addEventListener('click', function() {
                // 获取用户选择的cube名和路径
                cubeConfig.cubeName = cubeSelect.querySelector('.select-value').textContent;
                cubeConfig.cubePath = cubePath.value;
                
                // 显示其他配置部分
                dimensionsSection.style.display = 'block';
                initDataSection.style.display = 'block';
                apiAliasSection.style.display = 'block';
                applySection.style.display = 'block';
                
                // 更新维度和API别名列表中的cube名称
                updateCubeReferences(cubeConfig.cubeName);
                
                // 记录操作
                logToResultConsole(`已加载财务模型: ${cubeConfig.cubeName}`);
            });
        }
        
        // 添加筛选条件按钮点击事件
        if (addFilterBtn) {
            addFilterBtn.addEventListener('click', function() {
                // 模拟添加一个新的筛选条件
                // 这里可以添加一个弹窗让用户选择维度和值
                showFilterModal();
            });
        }
        
        // 应用配置按钮点击事件
        if (applyCubeConfigBtn) {
            applyCubeConfigBtn.addEventListener('click', function() {
                // 生成脚本模板
                const templateCode = generateScriptTemplate(cubeConfig);
                
                // 将模板代码插入到编辑器
                if (typeof editor !== 'undefined') {
                    editor.setValue(templateCode);
                }
                
                // 关闭侧边栏
                document.getElementById('cube-sidebar').classList.remove('active');
                document.getElementById('cube-btn').classList.remove('active');
                
                // 记录操作
                logToResultConsole(`已应用脚本设置并生成脚本模板`);
            });
        }
        
        // 初始化删除筛选条件按钮
        initRemoveFilterButtons();
    }
    
    // 更新cube引用名称
    function updateCubeReferences(cubeName) {
        const dimensionsList = document.getElementById('dimensions-list');
        const apiAliasList = document.getElementById('api-alias-list');
        
        if (dimensionsList) {
            const dimensionNames = dimensionsList.querySelectorAll('.dimension-name');
            dimensionNames.forEach(name => {
                const currentName = name.textContent;
                const updatedName = currentName.replace(/^.*?\./, `${cubeName}.`);
                name.textContent = updatedName;
            });
        }
        
        if (apiAliasList) {
            const apiNames = apiAliasList.querySelectorAll('.api-name');
            apiNames.forEach(name => {
                const currentName = name.textContent;
                const updatedName = currentName.replace(/^.*?\./, `${cubeName}.`);
                name.textContent = updatedName;
            });
        }
        
        // 更新筛选条件中的维度别名引用
        updateFilterReferences();
    }
    
    // 更新筛选条件引用
    function updateFilterReferences() {
        // 根据维度配置更新筛选条件显示
        const filtersList = document.getElementById('init-data-filters');
        const dimensionsList = document.getElementById('dimensions-list');
        
        if (filtersList && dimensionsList) {
            const filters = filtersList.querySelectorAll('.filter-dim');
            const dimensions = Array.from(dimensionsList.querySelectorAll('.dimension-item')).map(item => {
                return {
                    alias: item.querySelector('.dimension-alias').textContent,
                    name: item.querySelector('.dimension-name').textContent.split('.').pop()
                };
            });
            
            filters.forEach(filter => {
                const filterText = filter.textContent;
                const match = filterText.match(/^([A-Za-z]+)\[/);
                if (match && match[1]) {
                    const currentAlias = match[1];
                    const currentFilter = filterText.replace(/^[A-Za-z]+\["([^"]+)"\]$/, '$1');
                    
                    // 查找匹配的维度别名
                    const dimension = dimensions.find(d => d.alias === currentAlias);
                    if (dimension) {
                        filter.textContent = `${dimension.alias}["${currentFilter}"]`;
                    }
                }
            });
        }
    }
    
    // 初始化删除筛选条件按钮
    function initRemoveFilterButtons() {
        const filtersList = document.getElementById('init-data-filters');
        
        if (filtersList) {
            const removeButtons = filtersList.querySelectorAll('.btn-remove');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filterItem = this.closest('.filter-item');
                    if (filterItem) {
                        filterItem.remove();
                    }
                });
            });
        }
    }
    
    // 显示添加筛选条件的模态框
    function showFilterModal() {
        // 这里可以实现一个模态框，让用户选择维度和值
        // 简化起见，我们直接添加一个示例筛选条件
        const filtersList = document.getElementById('init-data-filters');
        
        if (filtersList) {
            const newFilter = document.createElement('div');
            newFilter.className = 'filter-item';
            newFilter.innerHTML = `
                <div class="filter-dim">Y["2022"]</div>
                <button class="btn-small btn-remove"><i class="fas fa-times"></i></button>
            `;
            
            filtersList.appendChild(newFilter);
            
            // 为新添加的按钮绑定事件
            const removeButton = newFilter.querySelector('.btn-remove');
            removeButton.addEventListener('click', function() {
                newFilter.remove();
            });
        }
    }
    
    // 生成脚本模板
    function generateScriptTemplate(config) {
        // 构建导入语句
        const importStatement = `from deepcube.cube.cube import DeepCube`;
        
        // 构建cube实例化
        let cubeInstance = '';
        if (config.cubePath) {
            cubeInstance = `# 实例一个DeepCube对象，传参为cube元素名和path
${config.cubeName} = DeepCube('${config.cubeName}', '${config.cubePath}')`;
        } else {
            cubeInstance = `# 实例一个DeepCube对象，传参为cube元素名
${config.cubeName} = DeepCube('${config.cubeName}')`;
        }
        
        // 构建维度别名定义
        const dimensionsDefinitions = config.dimensions.map(dim => {
            return `${dim.alias} = ${config.cubeName}.${dim.name}`;
        }).join('\n');
        
        // 构建初始化数据
        const filtersArray = config.filters.map(filter => {
            return `    ${filter.dimension}["${filter.value}"]`;
        }).join(',\n');
        
        const initData = `# 从系统的财务模型中加载数据
${config.cubeName}.init_data([
${filtersArray}
])`;
        
        // 构建API别名
        const apiAliases = config.apis.map(api => {
            return `${api.alias} = ${config.cubeName}.${api.name}`;
        }).join('\n');
        
        // 构建main函数
        const mainFunction = `
def main():
    # 确定一个背景scope范围
    SCOPE(Y["2021"],
          S["Actual"],
          V["Working"],
          P["YearTotal"].Base(),
          Product["TotalProduct"].Base())

    # 在此编写计算逻辑
    # 例如：BLOCK[A["Total_Sales"]] = BLOCK[A['Volume']] * BLOCK[A['Price'], P['NoPeriod']]
    
    # 将计算结果写入系统的财务模型中
    SUBMIT_DATA()
`;
        
        // 组合所有部分
        return `${importStatement}\n\n${cubeInstance}\n\n# 为了后续计算写法简单，在这里将cube的维度赋值给同名变量\n${dimensionsDefinitions}\n\n${initData}\n\n${apiAliases}\n${mainFunction}`;
    }

    // 初始化侧边栏状态
    function initSidebar() {
        // 默认显示财务模型配置侧边栏
        document.getElementById('cube-sidebar').classList.add('active');
        document.getElementById('cube-btn').classList.add('active');
        
        // 其他侧边栏默认隐藏
        document.getElementById('code-sidebar').classList.remove('active');
        document.getElementById('params-sidebar').classList.remove('active');
        document.getElementById('settings-sidebar').classList.remove('active');
    }

    // 初始化tab切换功能
    function initTabs() {
        const tabItems = document.querySelectorAll('.sidebar-tabs .tab-item');
        const tabContents = document.querySelectorAll('.tab-content');

        tabItems.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                console.log('Tab clicked:', targetTab); // 添加调试日志
                
                // 切换tab项的active状态
                tabItems.forEach(item => {
                    item.classList.remove('active');
                });
                tab.classList.add('active');
                
                // 切换内容区域的显示
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                const targetContent = document.getElementById(`${targetTab}-content`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // 初始化维度成员树
    function initDimensionMembers() {
        const dimensionGroupsContainer = document.getElementById('dimension-groups');
        
        // 遍历维度数据
        Object.entries(dimensionMembers).forEach(([key, dimension]) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'dimension-group';
            
            // 创建维度组标题
            const headerDiv = document.createElement('div');
            headerDiv.className = 'dimension-group-header';
            headerDiv.innerHTML = `
                <i class="fas fa-chevron-right"></i>
                <span class="dimension-group-title">${dimension.name}</span>
            `;
            
            // 创建维度成员内容区
            const contentDiv = document.createElement('div');
            contentDiv.className = 'dimension-group-content';
            
            // 添加搜索框
            const searchDiv = document.createElement('div');
            searchDiv.className = 'dimension-search';
            searchDiv.innerHTML = `
                <input type="text" class="search-input" placeholder="搜索${dimension.name}...">
                <i class="fas fa-search search-icon"></i>
            `;
            
            // 递归创建树形结构
            function createTreeNodes(members) {
                const ul = document.createElement('ul');
                ul.className = 'member-tree';
                
                members.forEach(member => {
                    const li = document.createElement('li');
                    li.className = 'tree-node';
                    
                    const hasChildren = member.children && member.children.length > 0;
                    li.innerHTML = `
                        <span class="tree-node-icon">
                            <i class="fas ${hasChildren ? 'fa-caret-right' : 'fa-minus'}"></i>
                        </span>
                        <span class="tree-node-content">${member.name}</span>
                        <div class="tree-node-actions">
                            <span class="insert-btn" title="插入">
                                <i class="fas fa-plus"></i>
                            </span>
                            <div class="insert-dropdown">
                                <div class="insert-dropdown-item">该节点的所有后代</div>
                                <div class="insert-dropdown-item">该节点的所有后代（包括节点本身）</div>
                                <div class="insert-dropdown-item">该节点的所有子代</div>
                                <div class="insert-dropdown-item">该节点的所有子代（包括节点本身）</div>
                                <div class="insert-dropdown-item">该节点的所有未级节点</div>
                                <div class="insert-dropdown-item">该节点的所有未级节点（包括节点本身）</div>
                            </div>
                        </div>
                    `;
                    
                    // 添加插入按钮点击事件
                    const insertBtn = li.querySelector('.insert-btn');
                    const dropdown = li.querySelector('.insert-dropdown');
                    insertBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        dropdown.classList.toggle('show');
                    });
                    
                    // 添加下拉项点击事件
                    const dropdownItems = li.querySelectorAll('.insert-dropdown-item');
                    dropdownItems.forEach(item => {
                        item.addEventListener('click', (e) => {
                            e.stopPropagation();
                            console.log('Selected:', item.textContent, 'for member:', member.name);
                            dropdown.classList.remove('show');
                        });
                    });
                    
                    // 点击其他地方关闭下拉菜单
                    document.addEventListener('click', () => {
                        dropdown.classList.remove('show');
                    });
                    
                    if (hasChildren) {
                        const childrenUl = createTreeNodes(member.children);
                        childrenUl.style.display = 'none';
                        li.appendChild(childrenUl);
                        
                        // 添加展开/折叠功能
                        const icon = li.querySelector('.fa-caret-right');
                        li.addEventListener('click', (e) => {
                            if (e.target.closest('.insert-btn') || e.target.closest('.insert-dropdown')) {
                                return;
                            }
                            const ul = li.querySelector('ul');
                            const isExpanded = ul.style.display !== 'none';
                            ul.style.display = isExpanded ? 'none' : 'block';
                            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
                        });
                    }
                    
                    ul.appendChild(li);
                });
                
                return ul;
            }
            
            // 添加搜索功能
            searchDiv.querySelector('.search-input').addEventListener('input', (e) => {
                const searchText = e.target.value.toLowerCase();
                const treeNodes = contentDiv.querySelectorAll('.tree-node');
                
                treeNodes.forEach(node => {
                    const content = node.querySelector('.tree-node-content').textContent.toLowerCase();
                    const shouldShow = content.includes(searchText);
                    node.style.display = shouldShow ? '' : 'none';
                    
                    if (shouldShow) {
                        // 展开父节点
                        let parent = node.parentElement;
                        while (parent && parent.classList.contains('member-tree')) {
                            parent.style.display = 'block';
                            const parentNode = parent.parentElement;
                            if (parentNode && parentNode.classList.contains('tree-node')) {
                                const icon = parentNode.querySelector('.fa-caret-right');
                                if (icon) {
                                    icon.style.transform = 'rotate(90deg)';
                                }
                            }
                            parent = parent.parentElement;
                        }
                    }
                });
            });
            
            contentDiv.appendChild(searchDiv);
            contentDiv.appendChild(createTreeNodes(dimension.members));
            
            // 添加点击展开/折叠事件
            headerDiv.addEventListener('click', () => {
                groupDiv.classList.toggle('expanded');
            });
            
            groupDiv.appendChild(headerDiv);
            groupDiv.appendChild(contentDiv);
            dimensionGroupsContainer.appendChild(groupDiv);
        });
    }

    // 初始化搜索功能
    function initMemberSearch() {
        const searchInput = document.querySelector('.search-input');
        const treeNodes = document.querySelectorAll('.tree-node');
        
        searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            
            treeNodes.forEach(node => {
                const content = node.querySelector('.tree-node-content').textContent.toLowerCase();
                if (content.includes(searchText)) {
                    node.style.display = '';
                    // 展开父级维度组
                    let parent = node.closest('.dimension-group');
                    if (parent) {
                        parent.classList.add('expanded');
                    }
                } else {
                    node.style.display = 'none';
                }
            });
        });
    }

    // 全局tab切换函数（确保在全局作用域）
    function switchTab(tabId) {
        console.log('Switching to tab:', tabId);
        
        // 切换tab项的active状态
        const tabItems = document.querySelectorAll('.sidebar-tabs .tab-item');
        tabItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            }
        });
        
        // 切换内容区域的显示
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(`${tabId}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
            console.log('Activated content:', targetContent.id);
        } else {
            console.error('Target content not found:', `${tabId}-content`);
        }
    }

    // 页面完全加载后的初始化
    window.onload = function() {
        // 初始化维度成员树
        if (typeof initDimensionMembers === 'function') {
            initDimensionMembers();
        }
        
        // 初始化搜索功能
        if (typeof initMemberSearch === 'function') {
            initMemberSearch();
        }
        
        console.log('Window loaded, tabs should be working now');
    };

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化侧边栏状态
        document.getElementById('cube-sidebar').classList.add('active');
        document.getElementById('cube-btn').classList.add('active');
        
        // 初始化维度成员树
        initDimensionMembers();
        
        // 初始化搜索功能
        initMemberSearch();
        
        // 其他初始化代码
        initConsoleResize();
        initSettingSections();
        initSidebars();
        initSidebarResize();
        initScriptTypeSwitch();
        initConsoleState();
        initLogState();
        initExampleData();
        initJsonTreeEvents();
        initCopyButtons();
        initParamsManager();
        initPreviewPanel();
        initCubeModelFeatures();
        
        // 初始化函数列表
        initializeFunctionsList();
    });

    // 定义全局switchTab函数，确保在HTML中可调用
    window.switchTab = function(tabId) {
        console.log('Global switchTab called for:', tabId);
        
        // 切换tab项的active状态
        const tabItems = document.querySelectorAll('.sidebar-tabs .tab-item');
        tabItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            }
        });
        
        // 切换内容区域的显示
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(`${tabId}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
            console.log('Activated content:', targetContent.id);
        } else {
            console.error('Target content not found:', `${tabId}-content`);
        }
    };

    // 初始化函数列表
    function initializeFunctionsList() {
        const functionsList = document.getElementById('functions-list');
        
        // 遍历函数数据
        Object.entries(functionData).forEach(([category, data]) => {
            // 创建分类容器
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'function-category';
            
            // 创建分类标题
            const headerDiv = document.createElement('div');
            headerDiv.className = 'function-category-header';
            headerDiv.textContent = data.title;
            categoryDiv.appendChild(headerDiv);
            
            // 创建函数列表
            data.functions.forEach(func => {
                const functionDiv = document.createElement('div');
                functionDiv.className = 'function-item';
                functionDiv.textContent = func.name;
                
                // 添加点击事件
                functionDiv.addEventListener('click', () => {
                    // 移除其他函数的active状态
                    document.querySelectorAll('.function-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // 添加active状态到当前点击的函数
                    functionDiv.classList.add('active');
                    
                    // 显示函数详情
                    showFunctionDetail(func);
                });
                
                categoryDiv.appendChild(functionDiv);
            });
            
            functionsList.appendChild(categoryDiv);
        });
    }

    // 调用函数初始化函数列表
    initializeFunctionsList();

    // 显示函数详情
    function showFunctionDetail(func) {
        // 隐藏"未选择"提示
        document.querySelector('.no-function-selected').style.display = 'none';
        
        // 显示函数详情
        const detailInfo = document.querySelector('.function-detail-info');
        detailInfo.style.display = 'block';
        
        // 更新详情内容
        detailInfo.querySelector('.function-name').textContent = func.name;
        detailInfo.querySelector('.function-description').textContent = func.description;
        detailInfo.querySelector('.function-syntax code').textContent = func.syntax;
        detailInfo.querySelector('.function-example code').textContent = func.example;
    }

    // 初始化步骤列表功能
    function initStepsList() {
        const addStepBtn = document.querySelector('.add-step-btn');
        if (!addStepBtn) return; // 如果按钮不存在则退出

        const stepDropdown = document.getElementById('step-dropdown');
        const stepsList = document.getElementById('steps-list');
        const configPanel = document.querySelector('.config-panel');
        let steps = [];
        let currentStepId = null;

        // 添加默认步骤：财务模型设置
        const defaultStep = {
            id: 'default-step',
            type: 'cube-config',
            title: '财务模型设置',
            isDefault: true // 标记为默认步骤
        };
        steps.push(defaultStep);
        renderStep(defaultStep);
        selectStep(defaultStep.id);

        // 渲染步骤
        function renderStep(step) {
            const stepElement = document.createElement('div');
            stepElement.className = 'step-item';
            stepElement.setAttribute('data-step-id', step.id);
            stepElement.innerHTML = `
                <div class="step-number">${steps.length}</div>
                <div class="step-title">${step.title}</div>
                <div class="step-actions">
                    ${!step.isDefault ? `
                        <span class="step-action-btn delete-step" title="删除">
                            <i class="fas fa-trash"></i>
                        </span>
                    ` : ''}
                </div>
            `;

            // 点击步骤选中
            stepElement.addEventListener('click', function() {
                selectStep(step.id);
            });

            // 只为非默认步骤添加删除功能
            if (!step.isDefault) {
                const deleteBtn = stepElement.querySelector('.delete-step');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        deleteStep(step.id);
                    });
                }
            }

            stepsList.appendChild(stepElement);
        }

        // 选中步骤
        function selectStep(stepId) {
            currentStepId = stepId;
            
            // 更新步骤项的选中状态
            document.querySelectorAll('.step-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-step-id') == stepId) {
                    item.classList.add('active');
                }
            });

            // 显示配置面板
            const noStepSelected = document.querySelector('.no-step-selected');
            if (noStepSelected) {
                noStepSelected.style.display = 'none';
            }
            const configContent = document.querySelector('.step-config-content');
            if (configContent) {
                configContent.style.display = 'block';
            }

            // 根据步骤类型显示对应的配置界面
            const step = steps.find(s => s.id === stepId);
            if (step) {
                renderStepConfig(step);
            }
        }

        // 删除步骤
        function deleteStep(stepId) {
            const index = steps.findIndex(s => s.id === stepId);
            if (index > -1) {
                steps.splice(index, 1);
                // 移除步骤元素
                const stepElement = document.querySelector(`[data-step-id="${stepId}"]`);
                if (stepElement) {
                    stepElement.remove();
                }
                // 重新编号
                document.querySelectorAll('.step-item').forEach((item, idx) => {
                    item.querySelector('.step-number').textContent = idx + 1;
                });
                // 如果删除的是当前选中的步骤，清空配置面板
                if (currentStepId === stepId) {
                    currentStepId = null;
                    const noStepSelected = document.querySelector('.no-step-selected');
                    if (noStepSelected) {
                        noStepSelected.style.display = 'flex';
                    }
                    const configContent = document.querySelector('.step-config-content');
                    if (configContent) {
                        configContent.style.display = 'none';
                    }
                }
            }
        }

        // 渲染步骤配置界面
        function renderStepConfig(step) {
            const configContent = document.querySelector('.step-config-content');
            if (!configContent) return;

            // 清空配置内容
            configContent.innerHTML = '';

            // 根据步骤类型显示不同的配置界面
            switch (step.type) {
                case 'cube-config':
                    // 财务模型设置配置
                    configContent.innerHTML = `
                        <div class="config-section">
                            <h3>财务模型设置</h3>
                            
                            
                            <div class="setting-section">
                                <div class="section-header">
                                    <h3 class="setting-section-title">财务模型</h3>
                                </div>
                                <div class="setting-group">
                                    <div class="model-select-container">
                                        <div class="dropdown-select" id="cube-select">
                                            <div class="select-value">cube1</div>
                                            <i class="fas fa-chevron-down"></i>
                                        </div>
                                        <a href="#" class="model-edit-link" title="编辑财务模型">
                                            <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </div>
                                    <div class="model-path">/finance/models/cube1</div>
                                    
                                </div>
                            </div>



                            <div class="setting-section" id="dimensions-section">
                                <div class="section-header">
                                    <h3 class="setting-section-title">维度字段设置</h3>
                                    <div class="section-actions">
                                        <button class="refresh-btn" title="刷新维度数据">
                                            <i class="fas fa-sync-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="setting-group">
                                    <div class="dimensions-table">
                                        <div class="dimensions-header">
                                            <div class="dimension-col">维度</div>
                                            <div class="alias-col">别名</div>
                                            <div class="data-col">加载数据</div>
                                        </div>
                                        <div class="dimension-row">
                                            <div class="dimension-col">cube1.year</div>
                                            <div class="alias-col">
                                                <input type="text" class="alias-input" value="Y" />
                                            </div>
                                            <div class="data-col">
                                                <input type="text" class="data-input" value='Y["2021"]' />
                                            </div>
                                        </div>
                                        <div class="dimension-row">
                                            <div class="dimension-col">cube1.period</div>
                                            <div class="alias-col">
                                                <input type="text" class="alias-input" value="P" />
                                            </div>
                                            <div class="data-col">
                                                <input type="text" class="data-input" value='P["YearTotal"].Base()' />
                                            </div>
                                        </div>
                                        <div class="dimension-row">
                                            <div class="dimension-col">cube1.scenario</div>
                                            <div class="alias-col">
                                                <input type="text" class="alias-input" value="S" />
                                            </div>
                                            <div class="data-col">
                                                <input type="text" class="data-input" value='S["Actual"]' />
                                            </div>
                                        </div>
                                        <div class="dimension-row">
                                            <div class="dimension-col">cube1.version</div>
                                            <div class="alias-col">
                                                <input type="text" class="alias-input" value="V" />
                                            </div>
                                            <div class="data-col">
                                                <input type="text" class="data-input" value='V["Working"]' />
                                            </div>
                                        </div>
                                        <div class="dimension-row">
                                            <div class="dimension-col">cube1.product</div>
                                            <div class="alias-col">
                                                <input type="text" class="alias-input" value="Product" />
                                            </div>
                                            <div class="data-col">
                                                <input type="text" class="data-input" value='Product.All()' />
                                            </div>
                                        </div>
                                        <div class="dimension-separator"></div>
                                        <div class="dimension-row">
                                            <div class="dimension-col">cube1.account</div>
                                            <div class="alias-col">
                                                <input type="text" class="alias-input" value="A" />
                                            </div>
                                            <div class="data-col">
                                                <input type="text" class="data-input" value='A.All()' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    `;
                    break;

                case 'scope':
                    // SCOPE数据块配置
                    configContent.innerHTML = `
                        <div class="config-section">
                            <h3>SCOPE数据块设置</h3>
                            <div class="config-item">
                                <label>数据块名称</label>
                                <input type="text" class="config-input" placeholder="输入数据块名称" value="${step.config?.blockName || ''}">
                            </div>
                            <div class="config-item">
                                <label>维度筛选</label>
                                <div class="filter-list">
                                    <div class="filter-item">
                                        <select class="filter-dimension">
                                            <option value="Y">Year</option>
                                            <option value="P">Period</option>
                                            <option value="S">Scenario</option>
                                            <option value="V">Version</option>
                                            <option value="A">Account</option>
                                            <option value="Product">Product</option>
                                        </select>
                                        <input type="text" class="filter-value" placeholder="输入筛选值">
                                        <button class="btn-small btn-remove"><i class="fas fa-times"></i></button>
                                    </div>
                                </div>
                                <button class="btn-small add-filter">添加筛选条件</button>
                            </div>
                            <div class="config-item">
                                <label>数据块描述</label>
                                <textarea class="config-textarea" placeholder="输入数据块描述">${step.config?.description || ''}</textarea>
                            </div>
                        </div>
                    `;
                    break;

                case 'block':
                    // 数据块计算配置
                    configContent.innerHTML = `
                        <div class="config-section">
                            <h3>数据块计算设置</h3>
                            <div class="config-item">
                                <label>目标数据块</label>
                                <input type="text" class="config-input" placeholder="输入目标数据块名称" value="${step.config?.targetBlock || ''}">
                            </div>
                            <div class="config-item">
                                <label>计算公式</label>
                                <div class="formula-editor">
                                    <div class="formula-input">
                                        <input type="text" class="config-input" placeholder="输入计算公式" value="${step.config?.formula || ''}">
                                    </div>
                                    <div class="formula-tools">
                                        <button class="btn-small insert-dimension">插入维度</button>
                                        <button class="btn-small insert-operator">插入运算符</button>
                                    </div>
                                </div>
                            </div>
                            <div class="config-item">
                                <label>计算条件</label>
                                <textarea class="config-textarea" placeholder="输入计算条件（可选）">${step.config?.condition || ''}</textarea>
                            </div>
                        </div>
                    `;
                    break;

                case 'submit':
                    // 数据提交配置
                    configContent.innerHTML = `
                        <div class="config-section">
                            <h3>数据提交设置</h3>
                            <div class="config-item">
                                <label>提交范围</label>
                                <select class="config-select">
                                    <option value="all" ${step.config?.submitRange === 'all' ? 'selected' : ''}>全部数据</option>
                                    <option value="modified" ${step.config?.submitRange === 'modified' ? 'selected' : ''}>仅修改数据</option>
                                </select>
                            </div>
                            <div class="config-item">
                                <label>提交说明</label>
                                <textarea class="config-textarea" placeholder="输入提交说明">${step.config?.description || ''}</textarea>
                            </div>
                            <div class="config-item">
                                <label>提交选项</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-item">
                                        <input type="checkbox" ${step.config?.validateBeforeSubmit ? 'checked' : ''}>
                                        提交前验证数据
                                    </label>
                                    <label class="checkbox-item">
                                        <input type="checkbox" ${step.config?.createBackup ? 'checked' : ''}>
                                        创建备份
                                    </label>
                                </div>
                            </div>
                        </div>
                    `;
                    break;

                case 'rollup':
                    // ROLLUP上卷计算配置
                    configContent.innerHTML = `
                        <div class="config-section">
                            <h3>ROLLUP上卷计算设置</h3>
                            <div class="config-item">
                                <label>目标数据块</label>
                                <input type="text" class="config-input" placeholder="输入目标数据块名称" value="${step.config?.targetBlock || ''}">
                            </div>
                            <div class="config-item">
                                <label>上卷维度</label>
                                <div class="dimension-selector">
                                    <select class="config-select" multiple>
                                        <option value="Y" ${step.config?.rollupDimensions?.includes('Y') ? 'selected' : ''}>Year</option>
                                        <option value="P" ${step.config?.rollupDimensions?.includes('P') ? 'selected' : ''}>Period</option>
                                        <option value="S" ${step.config?.rollupDimensions?.includes('S') ? 'selected' : ''}>Scenario</option>
                                        <option value="V" ${step.config?.rollupDimensions?.includes('V') ? 'selected' : ''}>Version</option>
                                        <option value="A" ${step.config?.rollupDimensions?.includes('A') ? 'selected' : ''}>Account</option>
                                        <option value="Product" ${step.config?.rollupDimensions?.includes('Product') ? 'selected' : ''}>Product</option>
                                    </select>
                                </div>
                            </div>
                            <div class="config-item">
                                <label>计算方式</label>
                                <select class="config-select">
                                    <option value="sum" ${step.config?.calculationType === 'sum' ? 'selected' : ''}>求和</option>
                                    <option value="avg" ${step.config?.calculationType === 'avg' ? 'selected' : ''}>平均值</option>
                                    <option value="max" ${step.config?.calculationType === 'max' ? 'selected' : ''}>最大值</option>
                                    <option value="min" ${step.config?.calculationType === 'min' ? 'selected' : ''}>最小值</option>
                                </select>
                            </div>
                            <div class="config-item">
                                <label>计算条件</label>
                                <textarea class="config-textarea" placeholder="输入计算条件（可选）">${step.config?.condition || ''}</textarea>
                            </div>
                        </div>
                    `;
                    break;

                case 'clear':
                    // 数据清除配置
                    configContent.innerHTML = `
                        <div class="config-section">
                            <h3>数据清除设置</h3>
                            <div class="config-item">
                                <label>清除范围</label>
                                <select class="config-select">
                                    <option value="all" ${step.config?.clearRange === 'all' ? 'selected' : ''}>全部数据</option>
                                    <option value="selected" ${step.config?.clearRange === 'selected' ? 'selected' : ''}>选定范围</option>
                                </select>
                            </div>
                            <div class="config-item">
                                <label>数据块选择</label>
                                <div class="block-selector">
                                    <select class="config-select" multiple>
                                        <option value="block1" ${step.config?.selectedBlocks?.includes('block1') ? 'selected' : ''}>数据块1</option>
                                        <option value="block2" ${step.config?.selectedBlocks?.includes('block2') ? 'selected' : ''}>数据块2</option>
                                    </select>
                                </div>
                            </div>
                            <div class="config-item">
                                <label>清除选项</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-item">
                                        <input type="checkbox" ${step.config?.keepStructure ? 'checked' : ''}>
                                        保留结构
                                    </label>
                                    <label class="checkbox-item">
                                        <input type="checkbox" ${step.config?.createBackup ? 'checked' : ''}>
                                        创建备份
                                    </label>
                                </div>
                            </div>
                        </div>
                    `;
                    break;

                case 'copy':
                    // 数据复制配置
                    configContent.innerHTML = `
                        <div class="config-section">
                            <h3>数据复制设置</h3>
                            <div class="config-item">
                                <label>源数据块</label>
                                <select class="config-select">
                                    <option value="">选择源数据块</option>
                                    <option value="block1" ${step.config?.sourceBlock === 'block1' ? 'selected' : ''}>数据块1</option>
                                    <option value="block2" ${step.config?.sourceBlock === 'block2' ? 'selected' : ''}>数据块2</option>
                                </select>
                            </div>
                            <div class="config-item">
                                <label>目标数据块</label>
                                <select class="config-select">
                                    <option value="">选择目标数据块</option>
                                    <option value="block1" ${step.config?.targetBlock === 'block1' ? 'selected' : ''}>数据块1</option>
                                    <option value="block2" ${step.config?.targetBlock === 'block2' ? 'selected' : ''}>数据块2</option>
                                </select>
                            </div>
                            <div class="config-item">
                                <label>复制选项</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-item">
                                        <input type="checkbox" ${step.config?.overwrite ? 'checked' : ''}>
                                        覆盖已存在数据
                                    </label>
                                    <label class="checkbox-item">
                                        <input type="checkbox" ${step.config?.copyStructure ? 'checked' : ''}>
                                        复制结构
                                    </label>
                                </div>
                            </div>
                            <div class="config-item">
                                <label>筛选条件</label>
                                <div class="filter-list">
                                    <div class="filter-item">
                                        <select class="filter-dimension">
                                            <option value="Y">Year</option>
                                            <option value="P">Period</option>
                                            <option value="S">Scenario</option>
                                            <option value="V">Version</option>
                                            <option value="A">Account</option>
                                            <option value="Product">Product</option>
                                        </select>
                                        <input type="text" class="filter-value" placeholder="输入筛选值">
                                        <button class="btn-small btn-remove"><i class="fas fa-times"></i></button>
                                    </div>
                                </div>
                                <button class="btn-small add-filter">添加筛选条件</button>
                            </div>
                        </div>
                    `;
                    break;

                case 'export':
                    // 数据导出配置
                    configContent.innerHTML = `
                        <div class="config-section">
                            <h3>数据导出设置</h3>
                            <div class="config-item">
                                <label>导出数据块</label>
                                <select class="config-select" multiple>
                                    <option value="block1" ${step.config?.exportBlocks?.includes('block1') ? 'selected' : ''}>数据块1</option>
                                    <option value="block2" ${step.config?.exportBlocks?.includes('block2') ? 'selected' : ''}>数据块2</option>
                                </select>
                            </div>
                            <div class="config-item">
                                <label>导出格式</label>
                                <select class="config-select">
                                    <option value="excel" ${step.config?.exportFormat === 'excel' ? 'selected' : ''}>Excel</option>
                                    <option value="csv" ${step.config?.exportFormat === 'csv' ? 'selected' : ''}>CSV</option>
                                    <option value="json" ${step.config?.exportFormat === 'json' ? 'selected' : ''}>JSON</option>
                                </select>
                            </div>
                            <div class="config-item">
                                <label>导出选项</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-item">
                                        <input type="checkbox" ${step.config?.includeHeaders ? 'checked' : ''}>
                                        包含表头
                                    </label>
                                    <label class="checkbox-item">
                                        <input type="checkbox" ${step.config?.includeMetadata ? 'checked' : ''}>
                                        包含元数据
                                    </label>
                                </div>
                            </div>
                            <div class="config-item">
                                <label>导出路径</label>
                                <input type="text" class="config-input" placeholder="输入导出路径" value="${step.config?.exportPath || ''}">
                            </div>
                        </div>
                    `;
                    break;

                default:
                    configContent.innerHTML = '<div class="no-config">暂无配置选项</div>';
            }

            // 为配置项添加事件监听
            initConfigEvents(step);
        }

        // 初始化配置项事件
        function initConfigEvents(step) {
            const configContent = document.querySelector('.step-config-content');
            if (!configContent) return;

            // 监听所有输入变化
            configContent.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('change', function() {
                    if (!step.config) {
                        step.config = {};
                    }
                    
                    if (this.type === 'checkbox') {
                        step.config[this.name] = this.checked;
                    } else {
                        step.config[this.name] = this.value;
                    }
                });
            });

            // 添加筛选条件按钮事件
            const addFilterBtn = configContent.querySelector('.add-filter');
            if (addFilterBtn) {
                addFilterBtn.addEventListener('click', function() {
                    const filterList = this.previousElementSibling;
                    const newFilter = document.createElement('div');
                    newFilter.className = 'filter-item';
                    newFilter.innerHTML = `
                        <select class="filter-dimension">
                            <option value="Y">Year</option>
                            <option value="P">Period</option>
                            <option value="S">Scenario</option>
                            <option value="V">Version</option>
                            <option value="A">Account</option>
                            <option value="Product">Product</option>
                        </select>
                        <input type="text" class="filter-value" placeholder="输入筛选值">
                        <button class="btn-small btn-remove"><i class="fas fa-times"></i></button>
                    `;
                    filterList.appendChild(newFilter);
                });
            }

            // 删除筛选条件按钮事件
            configContent.querySelectorAll('.btn-remove').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.closest('.filter-item').remove();
                });
            });
        }

        // 添加步骤按钮点击事件
        addStepBtn.addEventListener('click', function(e) {
            console.log('Add step button clicked');
            e.stopPropagation();
            const btnRect = this.getBoundingClientRect();
            stepDropdown.style.position = 'absolute';
            stepDropdown.style.top = (btnRect.bottom + 2) + 'px';
            stepDropdown.style.left = (btnRect.left - 100) + 'px'; // 向左偏移以对齐按钮
            stepDropdown.style.width = '150px'; // 设置固定宽度
            stepDropdown.classList.toggle('show');
        });

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', function() {
            stepDropdown.classList.remove('show');
        });

        // 阻止下拉菜单的点击事件冒泡
        stepDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 步骤选项点击事件
        document.querySelectorAll('.step-option').forEach(option => {
            option.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const title = this.textContent;
                addStep(type, title);
                stepDropdown.classList.remove('show');
            });
        });

        // 添加步骤
        function addStep(type, title) {
            const stepId = Date.now();
            const step = {
                id: stepId,
                type: type,
                title: title,
                isDefault: false // 标记为非默认步骤
            };
            steps.push(step);
            renderStep(step);
            selectStep(stepId);
        }
    }

    // 在DOMContentLoaded事件中初始化步骤列表功能
    document.addEventListener('DOMContentLoaded', function() {
        // ... existing code ...
        
        // 初始化步骤列表功能
        initStepsList();
    });
}); 