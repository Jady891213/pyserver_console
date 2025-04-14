// 代码模板数据
window.templateData = [
    {
        "name": "数据库操作",
        "code": `# 使用数据库客户端
from deepfos.db import DbUtils

# 连接数据库
db = DbUtils("数据源名称")

# 执行SQL查询
ret = db.query_all("SELECT * FROM table_name WHERE id = %s", [1])
print(ret)

# 执行SQL更新
result = db.update("UPDATE table_name SET field = %s WHERE id = %s", ["value", 1])
print(f"影响行数: {result}")

# 使用数据表元素
from deepfos.element.data_table import DataTable

# 实例化数据表元素
dt = DataTable("表元素编码")

# 查询数据
df = dt.df()
print(df.head())

# 保存数据
df["value"] = 100  # 修改数据
dt.save(df)  # 保存到数据库`
    },
    {
        "name": "维度元素操作",
        "code": `# 维度元素操作示例
from deepfos.element.dimension import Dimension

# 实例化维度
dimension = Dimension("dim_dept")  # 部门维度

# 增加维度成员
member_data = {
    "code": "D001",
    "name": "财务部",
    "level": 1,
    "parent_code": ""
}
dimension.add_member(member_data)

# 删除维度成员
dimension.delete_member("D001")

# 查询维度成员
member = dimension.get_member("D001")
print(member)

# 查询所有成员
all_members = dimension.get_members()
print(all_members)

# 查询子成员
children = dimension.get_children("ParentCode")
print(children)`
    },
    {
        "name": "财务模型操作",
        "code": `# 财务模型操作示例
from deepfos.element.cube import Cube

# 实例化财务模型
model = Cube("model_finance")

# 获取维度信息
dims = model.get_dimensions()
print(dims)

# 定义筛选条件
filters = [
    {"dim": "year", "members": ["2023"]},
    {"dim": "period", "members": ["M01", "M02"]},
    {"dim": "account", "members": ["Revenue"]}
]

# 查询数据
data = model.query(filters)
print(data)

# 保存数据
new_data = {
    "year": "2023",
    "period": "M01",
    "account": "Revenue",
    "value": 1000.0
}
model.save([new_data])

# 删除数据
model.delete(filters)`
    },
    {
        "name": "业务模型操作",
        "code": `# 业务模型操作示例
from deepfos.element.model import Model

# 实例化业务模型
model = Model("model_business")

# 获取模型信息
print(f"模型名称: {model.name}")
print(f"模型表: {model.tables}")

# 从模型表取数
df = model.from_table("table_name").df()
print(df.head())

# 条件查询
df = model.from_table("table_name") \\
         .filter({"field_name": "value"}) \\
         .df()
print(df)

# 关联查询
df = model.from_table("main_table") \\
         .join("sub_table", "main_table.id = sub_table.main_id") \\
         .df()
print(df)`
    },
    {
        "name": "变量元素操作",
        "code": `# 变量元素操作示例
from deepfos.element.variable import Variable

# 实例化变量元素
var = Variable("var_system")

# 查询变量值
value = var.get_value("variable_code")
print(f"变量值: {value}")

# 查询变量完整信息
info = var.get("variable_code")
print(info)

# 遍历变量
for v in var.each():
    print(f"变量: {v.code}, 值: {v.value}")

# 删除变量
var.delete("variable_code")

# 新增变量
new_var = {
    "code": "new_var",
    "name": "新变量",
    "value": "变量值",
    "description": "这是一个新变量"
}
var.add(new_var)

# 更新变量
var.update("new_var", "新的变量值")`
    },
    {
        "name": "HTTP接口调用",
        "code": `# HTTP接口调用示例
from deepfos.api import Api

# 调用系统接口
api = Api()
result = api.call("/api/system/login", {
    "username": "admin",
    "password": "********"
})
print(result)

# 调用组件接口
api = Api("component_code")
result = api.call("/api/data/query", {
    "table": "table_name",
    "conditions": {"field": "value"}
})
print(result)

# 异步调用接口
async def call_api_async():
    api = Api()
    result = await api.call_async("/api/data/heavy_task", {
        "param1": "value1"
    })
    print(result)

# 设置超时
api = Api(timeout=30)  # 30秒超时
result = api.call("/api/long_running_task", {})`
    },
    {
        "name": "DeepUX数据源",
        "code": `# DeepUX数据源示例
def get_data(params):
    """
    DeepUX数据源函数
    
    参数:
        params: 前端传入的参数
    
    返回:
        包含data和metadata的字典
    """
    import pandas as pd
    
    # 创建示例数据
    data = {
        "部门": ["销售部", "市场部", "研发部", "财务部", "人事部"],
        "收入": [100, 80, 60, 40, 20],
        "支出": [50, 40, 80, 20, 10],
        "人数": [20, 15, 40, 5, 8]
    }
    df = pd.DataFrame(data)
    
    # 计算利润列
    df["利润"] = df["收入"] - df["支出"]
    
    # 返回数据和元数据
    return {
        "data": df.to_dict("records"),
        "metadata": {
            "columns": [
                {"name": "部门", "type": "string"},
                {"name": "收入", "type": "number"},
                {"name": "支出", "type": "number"},
                {"name": "人数", "type": "number"},
                {"name": "利润", "type": "number"}
            ]
        }
    }`
    },
    {
        "name": "并发编程",
        "code": `# 并发编程示例
import asyncio
from deepfos.element.cube import Cube
from deepfos.element.dimension import Dimension

# 异步并发示例
async def async_task(name, delay):
    print(f"开始任务: {name}")
    await asyncio.sleep(delay)
    print(f"完成任务: {name}")
    return f"{name} 结果"

async def main():
    # 创建任务列表
    tasks = [
        async_task("任务1", 2),
        async_task("任务2", 1),
        async_task("任务3", 3)
    ]
    
    # 并发执行所有任务
    results = await asyncio.gather(*tasks)
    print(f"所有结果: {results}")

# 元素类的协程并发
async def use_elements():
    cube = Cube("model_finance")
    dim = Dimension("dim_dept")
    
    # 并发执行两个操作
    cube_data, dim_members = await asyncio.gather(
        cube.query_async([{"dim": "year", "members": ["2023"]}]),
        dim.get_members_async()
    )
    
    print(f"模型数据行数: {len(cube_data)}")
    print(f"维度成员数: {len(dim_members)}")`
    },
    {
        "name": "DeepCube - 多维数据分析",
        "code": `from deepcube.cube.cube import DeepCube

# 实例化DeepCube对象
cube = DeepCube('finance_cube')

# 定义维度别名
Y = cube.year
P = cube.period
S = cube.scenario
V = cube.version
A = cube.account
D = cube.dept

# 加载数据
cube.init_data([
    Y["2023"],
    S["Actual"],
    V["Working"]
])

# 定义简写
SCOPE = cube.scope
BLOCK = cube.loc

def main():
    # 设置分析范围
    SCOPE(Y["2023"],
          S["Actual"],
          V["Working"],
          P["YearTotal"].Base())
          
    # 多维数据分析
    sales_by_dept = BLOCK[A["Total_Sales"], D.All()]
    profit_margin = BLOCK[A["Profit_Margin"], D.All()]
    
    # 返回结果
    return {
        "sales": sales_by_dept,
        "margin": profit_margin
    }`
    },
    {
        "name": "DeepCube - 财务数据计算",
        "code": `from deepcube.cube.cube import DeepCube

# 实例化DeepCube对象
cube = DeepCube('financial_model')

# 定义维度别名
Y = cube.year
P = cube.period
S = cube.scenario
V = cube.version
A = cube.account

# 加载数据
cube.init_data([
    Y["2023"],
    S["Budget"],
    V["Working"]
])

SCOPE = cube.scope
BLOCK = cube.loc
SUBMIT = cube.submit_calc

def main():
    # 设置计算范围
    SCOPE(Y["2023"],
          S["Budget"],
          V["Working"],
          P["YearTotal"].Base())
    
    # 计算总销售额 = 销量 * 单价
    BLOCK[A["Total_Sales"]] = BLOCK[A["Volume"]] * BLOCK[A["Price"], P["NoPeriod"]]
    
    # 计算总成本 = 固定成本 + 可变成本
    BLOCK[A["Total_Cost"]] = BLOCK[A["Fixed_Cost"]] + BLOCK[A["Variable_Cost"]]
    
    # 计算毛利 = 总销售额 - 总成本
    BLOCK[A["Gross_Profit"]] = BLOCK[A["Total_Sales"]] - BLOCK[A["Total_Cost"]]
    
    # 提交计算结果
    SUBMIT()`
    }
]; 