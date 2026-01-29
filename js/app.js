function checkOrder() {
  fetch('/order/actuator/health')
    .then(res => res.json())
    .then(data => {
      document.getElementById('out').innerText =
        JSON.stringify(data, null, 2);
    })
    .catch(err => {
      document.getElementById('out').innerText = err;
    });
}

