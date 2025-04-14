// 代码模板数据
window.templateData = [
    {
        "name": "数据复制",
        "code": `SCOPE(Y["2023"],
        S["Budget"],
        V["Working"],
        P["YearTotal"].Base())
    
# 从Actual复制数据到Budget
BLOCK[A["Total_Sales"], S["Budget"]] = BLOCK[A["Total_Sales"], S["Actual"]]
BLOCK[A["Headcount"], S["Budget"]] = BLOCK[A["Headcount"], S["Actual"]]
`
    },
    {
        "name": "指标判断",
        "code": `SCOPE(Y["2023"],
        S["Actual"],
        V["Working"],
        P["YearTotal"].Base())
    
    # 获取销售额
    sales = BLOCK[A["Total_Sales"], D.All()]
    
    # 获取目标销售额
    target = BLOCK[A["Target_Sales"], D.All()]
    
    `
    }
]; 