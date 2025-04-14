#!/usr/bin/env python
import os
import sys
import json
import time
import traceback
import contextlib
import io
import inspect
from flask import Flask, request, jsonify, send_from_directory, make_response
from flask_cors import CORS
import socket

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # 允许所有来源的跨域请求访问API

# 用于捕获标准输出和标准错误
class Capturing(list):
    def __enter__(self):
        self.stdout_old = sys.stdout
        self.stderr_old = sys.stderr
        self.stdout_buffer = io.StringIO()
        self.stderr_buffer = io.StringIO()
        sys.stdout = self.stdout_buffer
        sys.stderr = self.stderr_buffer
        return self
    
    def __exit__(self, *args):
        sys.stdout = self.stdout_old
        sys.stderr = self.stderr_old
        self.extend(self.stdout_buffer.getvalue().splitlines())
        self.stderr_output = self.stderr_buffer.getvalue()

# 静态文件服务
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# 执行Python代码的接口
@app.route('/api/run', methods=['POST'])
def run_code():
    try:
        data = request.get_json()
        code = data.get('code', '')
        params = data.get('params', {})
        
        # 记录执行开始时间
        start_time = time.time()
        
        # 设置结果变量
        result = None
        stdout_output = []
        stderr_output = ""
        
        # 创建本地变量字典，用于存储执行结果
        namespace = {}
        
        try:
            # 先执行代码以定义main函数
            with Capturing() as output:
                exec(code, namespace)
                
                # 检查是否定义了main函数
                if 'main' in namespace and callable(namespace['main']):
                    # 准备参数
                    main_func = namespace['main']
                    sig = inspect.signature(main_func)
                    param_count = len(sig.parameters)
                    
                    # 根据main函数的参数个数调用
                    if param_count > 0:
                        # 调用main函数，传入参数
                        result = main_func(params if params else None)
                    else:
                        # 不需要参数
                        result = main_func()
                else:
                    stderr_output = "错误: 脚本中未定义main函数，或main不是可调用的函数"
                
                # 获取标准输出和错误
                stdout_output = output
                
                # 安全地获取stderr_output
                try:
                    if hasattr(output, 'stderr_output') and not stderr_output:
                        stderr_output = output.stderr_output
                except Exception:
                    pass
                
        except Exception as e:
            # 捕获执行过程中的错误
            stderr_output = traceback.format_exc()
        
        # 计算执行时间（毫秒）
        execution_time = int((time.time() - start_time) * 1000)
        
        # 构建响应
        response = {
            "is_success": not stderr_output,
            "stdout": stdout_output,
            "stderr": stderr_output,
            "execution_time": execution_time,
            "result": result
        }
        
        return jsonify(response)
    
    except Exception as e:
        # 处理请求本身的错误
        return jsonify({
            "is_success": False,
            "error": str(e),
            "execution_time": 0
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))  # 默认使用5001端口
    
    # 获取本机局域网IP地址
    def get_local_ip():
        try:
            # 创建一个TCP套接字
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            # 连接到一个外部地址（这里不需要真正连接成功）
            s.connect(("8.8.8.8", 80))
            # 获取分配给套接字的本机IP
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception:
            return "127.0.0.1"
    
    local_ip = get_local_ip()
    
    print(f"服务器启动成功！")
    print(f"本机访问地址: http://localhost:{port}")
    print(f"局域网访问地址: http://{local_ip}:{port}")
    print(f"API地址: http://{local_ip}:{port}/api/run")
    print(f"请确保防火墙允许访问{port}端口")
    
    app.run(host='0.0.0.0', port=port, debug=True) 