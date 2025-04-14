const dimensionMembers = {
    year: {
        name: "年度",
        members: [
            { id: "2021", name: "2021年", children: [] },
            { id: "2022", name: "2022年", children: [] },
            { id: "2023", name: "2023年", children: [] },
            { id: "2024", name: "2024年", children: [] }
        ]
    },
    period: {
        name: "期间",
        members: [
            {
                id: "YearTotal",
                name: "全年",
                children: [
                    { id: "Q1", name: "第一季度", children: [
                        { id: "M1", name: "1月", children: [] },
                        { id: "M2", name: "2月", children: [] },
                        { id: "M3", name: "3月", children: [] }
                    ]},
                    { id: "Q2", name: "第二季度", children: [
                        { id: "M4", name: "4月", children: [] },
                        { id: "M5", name: "5月", children: [] },
                        { id: "M6", name: "6月", children: [] }
                    ]},
                    { id: "Q3", name: "第三季度", children: [
                        { id: "M7", name: "7月", children: [] },
                        { id: "M8", name: "8月", children: [] },
                        { id: "M9", name: "9月", children: [] }
                    ]},
                    { id: "Q4", name: "第四季度", children: [
                        { id: "M10", name: "10月", children: [] },
                        { id: "M11", name: "11月", children: [] },
                        { id: "M12", name: "12月", children: [] }
                    ]}
                ]
            }
        ]
    },
    scenario: {
        name: "场景",
        members: [
            { id: "Actual", name: "实际", children: [] },
            { id: "Budget", name: "预算", children: [] },
            { id: "Forecast", name: "预测", children: [] }
        ]
    },
    version: {
        name: "版本",
        members: [
            { id: "Working", name: "工作版本", children: [] },
            { id: "Final", name: "最终版本", children: [] },
            { id: "Approved", name: "已审批", children: [] }
        ]
    },
    account: {
        name: "指标",
        members: [
            {
                id: "PL",
                name: "损益",
                children: [
                    {
                        id: "Revenue",
                        name: "收入",
                        children: [
                            { id: "Sales", name: "销售收入", children: [] },
                            { id: "OtherRevenue", name: "其他收入", children: [] }
                        ]
                    },
                    {
                        id: "Cost",
                        name: "成本",
                        children: [
                            { id: "COGS", name: "销售成本", children: [] },
                            { id: "OperatingCost", name: "运营成本", children: [] }
                        ]
                    }
                ]
            },
            {
                id: "BS",
                name: "资产负债",
                children: [
                    {
                        id: "Assets",
                        name: "资产",
                        children: [
                            { id: "CurrentAssets", name: "流动资产", children: [] },
                            { id: "FixedAssets", name: "固定资产", children: [] }
                        ]
                    },
                    {
                        id: "Liabilities",
                        name: "负债",
                        children: [
                            { id: "CurrentLiabilities", name: "流动负债", children: [] },
                            { id: "LongTermLiabilities", name: "长期负债", children: [] }
                        ]
                    }
                ]
            }
        ]
    }
}; 