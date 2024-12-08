<script>
import checkData from './main_checkData.js'
import addNewPoint from './main_addNewPoint.js'
import loadData from './main_loadData.js'
import getCountElements from './main_getCountElements.js'

export default {
  name: 'Main',
  data() {
      return {
        id: '',
        login: '',
        start: 0,
        rows: 10,
        currentPage: 1,
        totalPages: 1,
        points: [],
        isDesktop: false,
        isTablet: false,
        isMobile: false
      }
    },
    methods: {
        check() {
            const ms_delta = Date.now() - localStorage.getItem('last_auth')
            const count_m = (Date.now() - localStorage.getItem('last_auth')) / 60000
            //console.log(ms_delta)
            //console.log(count_m)
            if (count_m > 2) {
                this.$router.push({ name:'index' })
            }
        },
        logoutHandler() {
            localStorage.removeItem('id')
            localStorage.removeItem('login')
            localStorage.removeItem('last_auth')
            this.$router.push({ name:'index' })
        },
        addButtonHandler() {
              const xValue = document.querySelector('input[name="x"]:checked')?.value;
              const yValue = document.getElementById('y')?.value;
              const rValue = document.querySelector('input[name="r"]:checked')?.value;

              let result = checkData(xValue, yValue, rValue)
              //console.log(result)
              if (!result.isValid) {
                alert(result.reason);
                return;
              }
              addNewPoint(this.id, xValue, yValue, rValue)
              setTimeout(() => this.loadData(this.id, this.start), 500);
        },
        handleClickGraph(e) {
            const rValue = document.querySelector('input[name="r"]:checked')?.value;
            if (rValue) {
                const graphContainer = document.getElementById('graph-container');
                if (graphContainer) {
                    const graphWidth = graphContainer.offsetWidth + 20;
                    const graphHeight = graphContainer.offsetHeight + 70;
                    const graphLeft = graphContainer.offsetLeft;
                    const graphTop = graphContainer.offsetTop;

                    //console.log(graphWidth)
                    //console.log(graphHeight)
                    //console.log(graphLeft)
                    //console.log(graphTop)
                    //console.log(e.clientX)
                    //console.log(e.clientY)


                    const delX = 30 / 400 * graphWidth
                    const delY = 30 / 400 * graphHeight

                    const rXr = graphWidth - graphLeft - 2 * delX
                    const rYr = graphHeight - graphTop - 2 * delY

                    // console.log(e.clientX + "-"+e.clientY)
                    //const calculatedX = (e.clientX - graphLeft - graphWidth / 2) / 240 * rValue;
                    //const calculatedY = (graphHeight / 2 - (e.clientY - graphTop)) / 240 * rValue;

                    const calculatedX = (e.clientX - graphLeft - delX - rXr / 2) / (rXr / 2) * rValue;
                    const calculatedY = (rYr / 2 - (e.clientY - graphTop - delY)) / (rYr / 2) * rValue;

                    //console.log(calculatedX)
                    //console.log(calculatedY)

                    addNewPoint(this.id, calculatedX.toFixed(3), calculatedY.toFixed(3), rValue)
                    setTimeout(() => this.loadData(this.id, this.start), 500);
                }
            } else {
                alert("Невалидные данные!")
            }
        },
        loadData(id, start) {
            fetch("http://localhost:8080/0/point?id="+id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                  }
                })
                .then((response) => response.json())
                .then((data) => {
                    this.totalPages = Math.ceil(data.count / this.rows);
                    fetch("http://localhost:8080/0/form?id="+id+"&first="+start+"&rows="+this.rows, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        this.points = data;
                        document.getElementById("graph").innerHTML = "";
                        for (var obj of data) {
                          this.drawPoint(obj.x, obj.y, obj.r, obj.result);
                        }

                    })
                    .catch(error => { console.log('Ошибка отправки запроса:', error); });
                })
                .catch(error => {
                  console.log('Ошибка отправки запроса:', error);
            });
        },
        previousPage() {
            if (this.start != 0) {
                this.start = this.start - this.rows;
                this.currentPage--;
                this.loadData(this.id, this.start);
            }
        },
        nextPage() {
            //console.log(this.currentPage)
            //console.log(this.totalPages)
            if (this.currentPage != this.totalPages) {
                this.start = this.start + this.rows;
                this.currentPage = this.currentPage + 1;
                //console.log(this.start)
                //console.log(this.currentPage)
                this.loadData(this.id, this.start);
            }
        },
        drawPoint(x, y, r, result) {
              let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              circle.setAttribute("cx", x * 170 / r + 200);
              circle.setAttribute("cy", -y * 170 / r + 200);
              circle.setAttribute("r", 4);

              circle.style.stroke = "black";
              circle.style["stroke-width"] = "1px";
              circle.style.fill = result? "#0ecc14" : "#d1220f";

              document.getElementById("graph").appendChild(circle);
        },
        checkScreenSize() {
                      const screenWidth = window.innerWidth
                      if (screenWidth >= 1171) {
                        this.isDesktop = true
                        this.isTablet = false
                        this.isMobile = false
                      } else if (screenWidth >= 660 && screenWidth < 1171) {
                        this.isDesktop = false
                        this.isTablet = true
                        this.isMobile = false
                      } else {
                        this.isDesktop = false
                        this.isTablet = false
                        this.isMobile = true
                      }
        }
    },
    mounted() {
      this.check()
      this.id = localStorage.getItem('id');
      this.login = localStorage.getItem('login');
      this.loadData(this.id, this.start);
      const logoutButton = document.getElementById('logout');
      logoutButton.addEventListener('click', this.logoutHandler);
      const addButton = document.getElementById('add_btn');
      addButton.addEventListener('click', this.addButtonHandler);
      this.checkScreenSize()
      window.addEventListener('resize', this.checkScreenSize)
    }
}
</script>

<template>
<div>
    <header class="header">
        <div class="header-container">
            <div>Логин: {{ login }}</div>
            <div></div>
            <div><button id='logout' type="submit">Выйти</button></div>
        </div>
    </header>

    <main class="main">
        <div class="main__left-column">
            <div class="main__block" id="graph-container" @click="handleClickGraph" style="position: relative;">
              <img id="image" src="./graph.svg" alt="Граф">
              <svg id="graph" viewBox="0 0 400 400" style="position: absolute; top: 0; left: 0; z-index: 1;"/>
            </div>
            <div class="main__block">
                <div class="row">Параметры</div>
                <div class="row" style="display:flex">
                    <div style="padding-top:3px">Выберете X:</div>
                    <div>
                        <input type="radio" id="x-4" name="x" value="-4" />
                        <label for="x-4">-4</label>
                        <input type="radio" id="x-3" name="x" value="-3" />
                        <label for="x-3">-3</label>
                        <input type="radio" id="x-2" name="x" value="-2" />
                        <label for="x-2">-2</label>
                        <input type="radio" id="x-1" name="x" value="-1" />
                        <label for="x-1">-1</label>
                        <input type="radio" id="x0" name="x" value="0" />
                        <label for="x0">0</label>
                        <input type="radio" id="x1" name="x" value="1" />
                        <label for="x1">1</label>
                        <input type="radio" id="x2" name="x" value="2" />
                        <label for="x2">2</label>
                        <input type="radio" id="x3" name="x" value="3" />
                        <label for="x3">3</label>
                        <input type="radio" id="x4" name="x" value="4" />
                        <label for="x4">4</label>
                    </div>
                </div>
                <div class="row">
                    <div>Введите Y:</div>
                    <input type="number" id="y" value="" required placeholder="от -3 до 3" />
                </div>
                <div class="row" style="display:flex">
                    <div style="padding-top:3px">Выберете R:</div>
                    <div>
                        <input type="radio" id="r1" name="r" value="1" />
                        <label for="r1">1</label>
                        <input type="radio" id="r2" name="r" value="2" />
                        <label for="r2">2</label>
                        <input type="radio" id="r3" name="r" value="3" />
                        <label for="r3">3</label>
                        <input type="radio" id="r4" name="r" value="4" />
                        <label for="r4">4</label>
                    </div>
                </div>
            </div>
            <button type="button" id="add_btn" class="main__block submit_button">Проверить</button>
        </div>
        <div>
            <div class="result-title">Результат</div>
            <div class="result-container">
              <div class="result" id="result">
            <table id="table">
                <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Попал?</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                    <tr v-for="point in points" :key="point.id">
                              <td>{{ point.x.toFixed(3) }}</td>
                              <td>{{ point.y.toFixed(3) }}</td>
                              <td>{{ point.r }}</td>
                              <td>{{ point.result? 'Да' : 'Нет' }}</td>
                            </tr>
                    <!-- данные таблицы будут добавлены здесь -->
                </tbody>
            </table>
            </div></div>
            <div class="button-container">
                <button id="prevBtn" @click="previousPage">Предыдущая страница</button>
                <p>Страница: {{ currentPage }} из {{ totalPages }}</p>
                <button id="nextBtn" @click="nextPage">Следующая страница</button>
            </div>
        </div>
    </main>
</div>
</template>


<style scoped>
.header {
    font-size: 16px;
    text-align: center;
    font-family: sans-serif;
    color: rgb(255, 255, 255);
    background-color: black;
}

.header-container {
    display: grid;
    grid-template-columns: minmax(max-content, 2fr) 6fr minmax(max-content, 1fr);
    line-height: 55px;
    height: 55px;
    width: calc(100% - 40px);
    margin: auto;
}

#logout {
  background-color: transparent;
  border: none;
  color: red;
  font-size: 20px;
}

.header-container div:first-child {
  justify-self: start;
}



* {
    font-family: sans-serif;
}

html, body {
    padding: 0;
    margin: 0;
}

a {
    text-decoration: none;
}

.header {
    font-size: 16px;
    text-align: center;
    font-family: sans-serif;
    color: rgb(255, 255, 255);
    background-color: black;
}

.header-container {
    display: grid;
    grid-template-columns: minmax(max-content, 2fr) 5fr minmax(max-content, 1fr) minmax(max-content, 1fr);
    line-height: 55px;
    height: 55px;
    width: calc(100% - 40px);
    margin: auto;
}

.button-container {
    display: flex;
    justify-content: space-between;
}

input[type="radio"] {
    cursor: pointer;
}

input[type="text"]:focus {
    outline: none
}

.my-slider {
    border: none;
    box-shadow: none;
}

.my-slider-handle {
    border: none;
    box-shadow: none;
    width: 10px;
    height: 10px;
    background-color: #666;
    border-radius: 50%;
}

@media (min-width: 1171px) {
  .main {
      display: grid;
      grid-template-columns: 2fr 3fr;
      height: calc(100vh - 55px);
      width: 100vw;
  }
}


.main > div {
    border: 1px solid rgb(0, 0, 0);
}

.main__left-column {
    display: grid;
    grid-template-rows: max-content max-content auto;
}

.main__block {
    margin: 15px 15px 0 15px;
    border: 1px solid rgb(0, 0, 0);
}

.main__block .row {
    margin: 13px auto;
    width: fit-content;
}

.main__block .row > * {
    display: inline-block;
}

.image {
    height: 600px;
    width: 600px;
}

.graph  {
    display: block;
    height: 600px;
    width: 600px;
    border: 1px solid black;
    margin: 20px auto;
}

.input {
    height: 23px;
    margin-left: 5px;
}

.slider{
    margin-left: 5px;
}

.submit_button {
    background-color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 15px;
}

.submit_button:hover {
    background-color: #f6f6f6;
}

.submit_button:active {
    background-color: #e6e3e3;
}

.result-title {
    margin: 10px auto;
    text-align: center;
}

.result-container {
    display: grid;
    text-align: center;
    grid-template-columns: 1fr;
}

#table {
    width: 100%;
    border-collapse: collapse;
}

#table th, #table td {
    border: 1px solid #000;
}

</style>

