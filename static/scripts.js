window.onload = function () {
  fetch('/api/data')
    .then(response => response.json())
    .then(updateCharts);

  setInterval(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(updateCharts);
  }, 5000);
}

let cpuChart, memChart;

function updateCharts(data) {
  const ctx1 = document.getElementById('cpuChart').getContext('2d');
  const ctx2 = document.getElementById('memChart').getContext('2d');

  const cpuData = data.cpu;
  const usedMem = data.memory.used / (1024 ** 2);
  const totalMem = data.memory.total / (1024 ** 2);
  const memPercent = (usedMem / totalMem) * 100;

  if (!cpuChart) {
    cpuChart = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: cpuData.map((_, i) => `Core ${i + 1}`),
        datasets: [{
          label: 'CPU %',
          data: cpuData,
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          borderColor: 'green',
          borderWidth: 1
        }]
      },
      options: { scales: { y: { beginAtZero: true, max: 100 } } }
    });
  } else {
    cpuChart.data.datasets[0].data = cpuData;
    cpuChart.update();
  }

  if (!memChart) {
    memChart = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Used', 'Free'],
        datasets: [{
          data: [memPercent, 100 - memPercent],
          backgroundColor: ['lime', 'gray']
        }]
      },
      options: { cutout: '70%' }
    });
  } else {
    memChart.data.datasets[0].data = [memPercent, 100 - memPercent];
    memChart.update();
  }
}
