// 日志数据示例
const logData = [
    { 
        id: 1, 
        jobName: 'HR_budget.action.query_hc_duration',
        operationTarget: 'Python脚本',
        app: '人力预算 (v0.2 最新试用版演示)',
        user: 'wenjun.zhou',
        email: 'wenjun.zhou@proinnova.com.cn',
        submitTime: '2025-04-11 13:36:57',
        startTime: '2025-04-11 13:36:57',
        endTime: '2025-04-11 13:37:00',
        status: '成功', 
        type: 'success',
        hasAttachment: true
    },
    { 
        id: 2, 
        jobName: 'HR_budget.action.query_hc_duration',
        operationTarget: 'Python脚本',
        app: '人力预算 (v0.2 最新试用版演示)',
        user: 'eric.hu',
        email: 'eric.hu@proinnova.com.cn', 
        submitTime: '2025-04-11 12:01:23',
        startTime: '2025-04-11 12:01:23',
        endTime: '2025-04-11 12:01:24',
        status: '成功', 
        type: 'success',
        hasAttachment: true
    },
    { 
        id: 3, 
        jobName: '删除元素',
        operationTarget: '平台',
        app: '人力预算 (v0.2 最新试用版演示)',
        user: 'wenjun.zhou',
        email: 'wenjun.zhou@proinnova.com.cn', 
        submitTime: '2025-04-11 09:50:55',
        startTime: '2025-04-11 09:50:55',
        endTime: '2025-04-11 09:50:55',
        status: '成功', 
        type: 'success',
        hasAttachment: false
    },
    { 
        id: 4, 
        jobName: 'HR_budget.action.query_hc_duration',
        operationTarget: 'Python脚本',
        app: '人力预算 (v0.2 最新试用版演示)',
        user: 'wenjun.zhou',
        email: 'wenjun.zhou@proinnova.com.cn', 
        submitTime: '2025-04-11 09:50:04',
        startTime: '2025-04-11 09:50:04',
        endTime: '2025-04-11 09:50:05',
        status: '成功', 
        type: 'success',
        hasAttachment: true
    },
    { 
        id: 5, 
        jobName: '图表源_侧金模拟',
        operationTarget: 'Python脚本',
        app: '销售绩效管理(SPM_V0版)',
        user: 'Vanitas',
        email: 'xinyi.ye@deepfinance.com', 
        submitTime: '2025-04-11 01:32:45',
        startTime: '2025-04-11 01:32:46',
        endTime: '2025-04-11 01:32:46',
        status: '成功', 
        type: 'success',
        hasAttachment: true
    },
    { 
        id: 6, 
        jobName: '图表源_侧金模拟',
        operationTarget: 'Python脚本',
        app: '销售绩效管理(SPM_V0版)',
        user: 'Vanitas',
        email: 'xinyi.ye@deepfinance.com', 
        submitTime: '2025-04-11 01:32:38',
        startTime: '2025-04-11 01:32:38',
        endTime: '2025-04-11 01:32:38',
        status: '成功', 
        type: 'success',
        hasAttachment: true
    },
    { 
        id: 7, 
        jobName: '图表源_侧金模拟',
        operationTarget: 'Python脚本',
        app: '销售绩效管理(SPM_V0版)',
        user: 'Vanitas',
        email: 'xinyi.ye@deepfinance.com', 
        submitTime: '2025-04-11 01:32:37',
        startTime: '2025-04-11 01:32:37',
        endTime: '2025-04-11 01:32:37',
        status: '成功', 
        type: 'success',
        hasAttachment: true
    },
    { 
        id: 8, 
        jobName: 'HR_budget.action.query_budget_sim',
        operationTarget: 'Python脚本',
        app: '人力预算 (v0.2 最新试用版演示)',
        user: 'lucia.li',
        email: 'lucia.li@proinnova.com.cn', 
        submitTime: '2025-04-10 22:16:26',
        startTime: '2025-04-10 22:16:26',
        endTime: '2025-04-10 22:16:26',
        status: '成功', 
        type: 'success',
        hasAttachment: true
    },
    { 
        id: 9, 
        jobName: 'HR_budget.action.query_budget_sim',
        operationTarget: 'Python脚本',
        app: '人力预算 (v0.2 最新试用版演示)',
        user: 'lucia.li',
        email: 'lucia.li@proinnova.com.cn', 
        submitTime: '2025-04-10 22:16:16',
        startTime: '2025-04-10 22:16:16',
        endTime: '2025-04-10 22:16:16',
        status: '成功', 
        type: 'success',
        hasAttachment: true
    },
    { 
        id: 10, 
        jobName: '图表源_侧金模拟',
        operationTarget: 'Python脚本',
        app: '销售绩效管理(SPM_V0版)',
        user: 'shaomiaomiao1',
        email: 'shaomiaomiao1@lx-rs.com', 
        submitTime: '2025-04-10 18:13:12',
        startTime: '2025-04-10 18:13:13',
        endTime: '2025-04-10 18:13:13',
        status: '成功', 
        type: 'success',
        hasAttachment: true
    },
    { 
        id: 11, 
        jobName: 'HR_budget.action.query_budget_sim',
        operationTarget: 'Python脚本',
        app: '人力预算 (v0.2 最新试用版演示)',
        user: 'wenjun.zhou',
        email: 'wenjun.zhou@proinnova.com.cn', 
        submitTime: '2025-04-10 15:33:21',
        startTime: '2025-04-10 15:33:21',
        endTime: '2025-04-10 15:33:25',
        status: '失败', 
        type: 'error',
        hasAttachment: true
    },
    { 
        id: 12, 
        jobName: '数据校验',
        operationTarget: 'Python脚本',
        app: '销售绩效管理(SPM_V0版)',
        user: 'eric.hu',
        email: 'eric.hu@proinnova.com.cn', 
        submitTime: '2025-04-10 14:22:16',
        startTime: '2025-04-10 14:22:16',
        endTime: '2025-04-10 14:22:18',
        status: '警告', 
        type: 'warning',
        hasAttachment: false
    },
    { 
        id: 13, 
        jobName: '数据同步',
        operationTarget: 'Python脚本',
        app: '销售绩效管理(SPM_V0版)',
        user: 'Vanitas',
        email: 'xinyi.ye@deepfinance.com', 
        submitTime: '2025-04-10 14:05:33',
        startTime: '2025-04-10 14:05:33',
        endTime: '',
        status: '进行中', 
        type: 'info',
        hasAttachment: false
    }
];

// 暴露数据给全局
window.logData = logData;
