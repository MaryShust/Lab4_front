function addNewPoint(id, x, y, r) {
    fetch("http://localhost:8080/0/form", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        x: x,
        y: y,
        r: r
      })
    })
    .then(response => {
      if (response.ok) {
        console.log('Запрос успешно отправлен');
      } else {
        console.log('Ошибка отправки запроса');
      }
    })
    .catch(error => {
      console.log('Ошибка отправки запроса:', error);
    });
}

export default addNewPoint