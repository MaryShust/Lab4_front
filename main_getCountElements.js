function getCountElements(id) {
    fetch("http://localhost:8080/0/point?id="+id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.count);

        return data.count
    })
    .catch(error => {
      console.log('Ошибка отправки запроса:', error);
    });
}

export default getCountElements