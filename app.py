
from flask import Flask, render_template
import psutil
import socket
import datetime
import os

app = Flask(__name__)

def get_system_info():
    mem = psutil.virtual_memory()
    cpu = psutil.cpu_percent(interval=1, percpu=True)
    temp = os.popen("vcgencmd measure_temp").readline().strip().replace("temp=", "")
    net = psutil.net_io_counters()
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    return {
        'memory': mem,
        'cpu': cpu,
        'temp': temp,
        'net': net,
        'hostname': hostname,
        'ip': ip_address,
        'time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

@app.route('/')
def dashboard():
    data = get_system_info()
    return render_template('dashboard.html', data=data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
@app.route('/api/data')
def api_data():
    return get_system_info()
