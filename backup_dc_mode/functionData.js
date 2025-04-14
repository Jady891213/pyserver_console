// 函数数据
const functionData = {
    // 逻辑函数
    logic: {
        title: "逻辑函数",
        functions: [
            {
                name: "IIF",
                description: "条件判断函数，根据条件返回不同的值",
                syntax: "IIF(condition, trueValue, falseValue)",
                example: "IIF(A > 0, '正数', '非正数')"
            },
            {
                name: "SCOPE",
                description: "设置计算范围",
                syntax: "SCOPE(expression)",
                example: "SCOPE(A = A + 1)"
            }
        ]
    },
    // 多维计算函数
    cube: {
        title: "多维计算函数",
        functions: [
            {
                name: "ROLLUP",
                description: "向上汇总计算",
                syntax: "ROLLUP(expression)",
                example: "ROLLUP(A)"
            },
            {
                name: "CLEAR_DATA",
                description: "清除指定范围的数据",
                syntax: "CLEAR_DATA(expression)",
                example: "CLEAR_DATA(A)"
            }
        ]
    },
    // 成员函数
    member: {
        title: "成员函数",
        functions: [
            {
                name: "Base",
                description: "获取基础成员",
                syntax: "Base()",
                example: "P.Base()"
            },
            {
                name: "Descendant",
                description: "获取后代成员",
                syntax: "Descendant(level)",
                example: "A.Descendant('Level1')"
            },
            {
                name: "Children",
                description: "获取子成员",
                syntax: "Children()",
                example: "A.Children()"
            }
        ]
    },
    // 聚合函数
    aggregate: {
        title: "聚合函数",
        functions: [
            {
                name: "fn.sum",
                description: "求和",
                syntax: "fn.sum(expression)",
                example: "fn.sum(A)"
            },
            {
                name: "fn.avg",
                description: "求平均值",
                syntax: "fn.avg(expression)",
                example: "fn.avg(A)"
            },
            {
                name: "fn.max",
                description: "求最大值",
                syntax: "fn.max(expression)",
                example: "fn.max(A)"
            },
            {
                name: "fn.min",
                description: "求最小值",
                syntax: "fn.min(expression)",
                example: "fn.min(A)"
            }
        ]
    },
    // 数学函数
    math: {
        title: "数学函数",
        functions: [
            {
                name: "fn.abs",
                description: "求绝对值",
                syntax: "fn.abs(number)",
                example: "fn.abs(-5)"
            },
            {
                name: "fn.round",
                description: "四舍五入",
                syntax: "fn.round(number, decimals)",
                example: "fn.round(3.14159, 2)"
            }
        ]
    },
    // 功能函数
    utility: {
        title: "功能函数",
        functions: [
            {
                name: "DISPLAY_DATA",
                description: "显示数据",
                syntax: "DISPLAY_DATA(expression)",
                example: "DISPLAY_DATA(A)"
            },
            {
                name: "SUBMIT_DATA",
                description: "提交数据",
                syntax: "SUBMIT_DATA(expression)",
                example: "SUBMIT_DATA(A)"
            }
        ]
    }
}; 