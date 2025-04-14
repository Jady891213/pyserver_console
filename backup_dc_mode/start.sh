#!/bin/bash

# ======================================================================
# Python Web编辑器 - 一键启动脚本 (集成版)
# 作者: Claude
# 适用于Mac OS系统
# ======================================================================

# ----------------------------------------------------------------------
# 1. 配置参数
# ----------------------------------------------------------------------

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # 无颜色

# 端口配置 (使用不太常用的端口以避免冲突)
BACKEND_PORT=5566
FRONTEND_PORT=8088

# 存储进程ID
BACKEND_PID=""
FRONTEND_PID=""

# 项目根目录
ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
SERVER_FILE="$ROOT_DIR/server.py"
SCRIPT_JS_FILE="$ROOT_DIR/script.js"

# ----------------------------------------------------------------------
# 2. 辅助函数
# ----------------------------------------------------------------------

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 打印分隔线
print_separator() {
    echo -e "${BLUE}--------------------------------------${NC}"
}

# 信号处理：捕获CTRL+C，优雅终止所有进程
handle_exit() {
    print_message "$YELLOW" "\n正在终止服务..."
    
    # 终止后端服务器
    if [ ! -z "$BACKEND_PID" ]; then
        print_message "$BLUE" "终止后端服务(PID: $BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null
    fi
    
    # 终止前端服务器
    if [ ! -z "$FRONTEND_PID" ]; then
        print_message "$BLUE" "终止前端服务(PID: $FRONTEND_PID)"
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    # 清理临时文件
    if [ -f "$ROOT_DIR/temp_server.py" ]; then
        print_message "$BLUE" "清理临时文件..."
        rm -f "$ROOT_DIR/temp_server.py"
    fi
    
    print_message "$GREEN" "服务已全部停止，谢谢使用！"
    exit 0
}

# 检查端口占用
check_port() {
    local port=$1
    local service_name=$2
    
    if lsof -i :$port > /dev/null 2>&1; then
        print_message "$RED" "错误: 端口 $port ($service_name) 已被占用"
        return 1
    fi
    return 0
}

# 获取可用端口
get_available_port() {
    local start_port=$1
    local current_port=$start_port
    
    while ! check_port $current_port "测试端口"; do
        current_port=$((current_port + 1))
        if [ $current_port -gt $((start_port + 1000)) ]; then
            print_message "$RED" "无法找到可用端口"
            exit 1
        fi
    done
    
    echo $current_port
}

# 获取本机IP地址
get_local_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        local ip=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -n 1 | awk '{print $2}')
        if [ -z "$ip" ]; then
            echo "localhost"
        else
            echo "$ip"
        fi
    else
        # Linux
        local ip=$(ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v '127.0.0.1' | head -n 1)
        if [ -z "$ip" ]; then
            echo "localhost"
        else
            echo "$ip"
        fi
    fi
}

# 更新前端API地址
update_frontend_api_url() {
    local backend_port=$1
    local local_ip=$2
    local script_file=$3
    local temp_file=$(mktemp)
    
    print_message "$BLUE" "正在更新前端API地址..."
    
    # 使用sed替换API URL (允许使用localhost或任何IP地址)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed "s|http://[^/]*/api/run|http://${local_ip}:${backend_port}/api/run|g" "$script_file" > "$temp_file"
    else
        # Linux/其他
        sed "s|http://[^/]*/api/run|http://${local_ip}:${backend_port}/api/run|g" "$script_file" > "$temp_file"
    fi
    
    # 检查是否成功
    if [ $? -ne 0 ]; then
        print_message "$RED" "更新API地址失败"
        rm -f "$temp_file"
        return 1
    fi
    
    # 替换原文件
    mv "$temp_file" "$script_file"
    
    print_message "$GREEN" "已将前端API地址更新为: http://${local_ip}:${backend_port}/api/run"
    return 0
}

# 创建必要的环境
setup_environment() {
    # 检测Python是否安装
    if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
        print_message "$RED" "错误: 未检测到Python，请先安装Python 3.6+"
        exit 1
    fi
    
    # 检测pip是否安装
    if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
        print_message "$RED" "错误: 未检测到pip，请先安装pip"
        exit 1
    fi
    
    # 确定Python命令
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
    else
        PYTHON_CMD="python"
    fi
    
    # 确定pip命令
    if command -v pip3 &> /dev/null; then
        PIP_CMD="pip3"
    else
        PIP_CMD="pip"
    fi
    
    return 0
}

# 杀掉占用端口的进程
kill_port_process() {
    local port=$1
    local service_name=$2
    
    # 查找占用端口的进程PID
    local pid=$(lsof -t -i :$port 2>/dev/null)
    
    if [ -n "$pid" ]; then
        print_message "$YELLOW" "发现进程(PID: $pid)占用$service_name端口($port)，正在终止..."
        kill -9 $pid > /dev/null 2>&1
        sleep 1
        
        # 确认端口已释放
        if lsof -i :$port > /dev/null 2>&1; then
            print_message "$RED" "无法释放端口 $port，请手动关闭占用该端口的程序"
            return 1
        else
            print_message "$GREEN" "端口 $port 已成功释放"
            return 0
        fi
    fi
    
    return 0
}

# 检查端口占用并尝试释放
check_and_free_port() {
    local port=$1
    local service_name=$2
    
    if lsof -i :$port > /dev/null 2>&1; then
        print_message "$YELLOW" "端口 $port ($service_name) 已被占用"
        print_message "$BLUE" "尝试自动释放端口..."
        
        if ! kill_port_process $port "$service_name"; then
            print_message "$RED" "无法自动释放端口 $port"
            return 1
        fi
    fi
    
    return 0
}

# ----------------------------------------------------------------------
# 3. 脚本入口
# ----------------------------------------------------------------------

# 注册信号处理
trap handle_exit INT TERM

# 设置环境
setup_environment

# 显示欢迎信息
clear
print_message "$GREEN" "======================================"
print_message "$GREEN" "    Python Web编辑器 - 启动工具     "
print_message "$GREEN" "======================================"
print_message "$BLUE" "作者: Claude"
print_message "$BLUE" "版本: 1.0.0"
print_separator

# 检查端口和更新配置
print_message "$BLUE" "正在检查端口配置..."

# 尝试使用默认后端端口
print_message "$BLUE" "检查后端端口 $BACKEND_PORT..."
if ! check_and_free_port $BACKEND_PORT "后端API服务"; then
    # 如果无法释放默认端口，寻找可用端口
    original_backend_port=$BACKEND_PORT
    BACKEND_PORT=$(get_available_port $BACKEND_PORT)
    if [ $BACKEND_PORT -ne $original_backend_port ]; then
        print_message "$YELLOW" "已自动切换到端口 $BACKEND_PORT"
    fi
fi

# 尝试使用默认前端端口
print_message "$BLUE" "检查前端端口 $FRONTEND_PORT..."
if ! check_and_free_port $FRONTEND_PORT "前端Web服务"; then
    # 如果无法释放默认端口，寻找可用端口
    original_frontend_port=$FRONTEND_PORT
    FRONTEND_PORT=$(get_available_port $FRONTEND_PORT)
    if [ $FRONTEND_PORT -ne $original_frontend_port ]; then
        print_message "$YELLOW" "已自动切换到端口 $FRONTEND_PORT"
    fi
fi

# 获取本机IP地址
local_ip=$(get_local_ip)

# 更新前端API地址
update_frontend_api_url $BACKEND_PORT $local_ip $SCRIPT_JS_FILE

# 显示将要使用的端口
print_message "$GREEN" "将使用以下端口:"
print_message "$BLUE" "后端API: http://${local_ip}:$BACKEND_PORT/api/run"
print_message "$BLUE" "前端页面: http://${local_ip}:$FRONTEND_PORT"
print_message "$YELLOW" "使用 Ctrl+C 可以随时终止所有服务"
print_separator

# 安装依赖
print_message "$BLUE" "正在安装依赖库..."
$PIP_CMD install -r "$ROOT_DIR/requirements.txt" 
if [ $? -ne 0 ]; then
    print_message "$RED" "依赖安装失败，请检查requirements.txt文件"
    exit 1
fi
print_message "$GREEN" "依赖库安装完成"
print_separator

# 启动后端服务器
print_message "$BLUE" "正在启动后端API服务器..."

# 设置环境变量
export PORT=$BACKEND_PORT

# 启动服务器
cd "$ROOT_DIR"
$PYTHON_CMD "$SERVER_FILE" > /dev/null 2>&1 &
BACKEND_PID=$!

# 检查后端启动是否成功
sleep 2
if ! ps -p $BACKEND_PID > /dev/null; then
    print_message "$RED" "后端服务启动失败，请检查server.py文件"
    exit 1
fi
print_message "$GREEN" "后端API服务启动成功"
print_message "$GREEN" "- 端口: $BACKEND_PORT"
print_message "$GREEN" "- PID: $BACKEND_PID"
print_separator

# 启动前端服务器
print_message "$BLUE" "正在启动前端服务器..."

# 确保工作目录正确
cd "$ROOT_DIR"

# 使用Python自带的HTTP服务器启动前端，绑定到0.0.0.0以允许局域网访问
if [[ $PYTHON_CMD == "python3" ]]; then
    $PYTHON_CMD -m http.server $FRONTEND_PORT --bind 0.0.0.0 > /dev/null 2>&1 &
else
    # 旧版Python可能不支持--bind参数
    # 创建一个临时服务器脚本
    cat > "$ROOT_DIR/temp_server.py" <<EOL
import sys
import http.server
import socketserver

PORT = int(sys.argv[1])

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return  # 禁止日志输出

handler = Handler
httpd = socketserver.TCPServer(("0.0.0.0", PORT), handler)
httpd.serve_forever()
EOL
    
    $PYTHON_CMD "$ROOT_DIR/temp_server.py" $FRONTEND_PORT > /dev/null 2>&1 &
fi

FRONTEND_PID=$!

# 检查前端启动是否成功
sleep 1
if ! ps -p $FRONTEND_PID > /dev/null; then
    print_message "$RED" "前端服务启动失败"
    # 终止后端服务
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi
print_message "$GREEN" "前端服务启动成功"
print_message "$GREEN" "- 端口: $FRONTEND_PORT"
print_message "$GREEN" "- PID: $FRONTEND_PID"
print_separator

# 提示用户访问地址
print_message "$GREEN" "所有服务已成功启动!"
print_message "$BLUE" "请在浏览器中访问: http://${local_ip}:$FRONTEND_PORT"
print_message "$YELLOW" "按 Ctrl+C 可随时终止所有服务"
print_separator

# 自动打开浏览器 (仅Mac系统)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://${local_ip}:$FRONTEND_PORT"
fi

# 等待用户按下Ctrl+C，同时监控服务状态
while true; do
    sleep 1
    # 检查进程是否仍在运行
    if ! ps -p $BACKEND_PID > /dev/null || ! ps -p $FRONTEND_PID > /dev/null; then
        print_message "$RED" "服务意外终止，正在停止所有服务..."
        handle_exit
    fi
done 