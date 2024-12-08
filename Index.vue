<script>
export default {
  data() {
    return {
      login: "",
      password: "",
      authResult: "",
      isDesktop: false,
      isTablet: false,
      isMobile: false,
      intervalId: null
    };
  },
  methods: {
    check() {
        const ms_delta = Date.now() - localStorage.getItem('last_auth')
        const count_m = (Date.now() - localStorage.getItem('last_auth')) / 60000
        //console.log(ms_delta)
        //console.log(count_m)
        if (count_m < 2) {
            this.$router.push({ name:'main' })
        }
    },
    checkAuth() {
      fetch("http://localhost:8080/0/auth", {
        method: "POST",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login: this.login, password: this.password }),
      })
       .then((response) => response.json())
       .then((data) => {
            localStorage.setItem('last_auth', Date.now())
            localStorage.setItem('id', data.id)
            localStorage.setItem('login', data.login)
            this.$router.push({ name:'main' })
       })
       .catch((error) => {
            console.log("FAIL")
            this.authResult = "Авторизация неуспешна"
            setTimeout(() => {
                this.authResult = "";
            }, 1000);
       });
    },
    updateClock() {
      const now = new Date()
      this.hours = now.getHours()
      this.minutes = now.getMinutes()
      this.seconds = now.getSeconds()

      const canvas = document.getElementById('canvas')
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, 200, 200)

          // Рисуем циферблат
          ctx.beginPath()
          ctx.arc(100, 100, 90, 0, 2 * Math.PI)
          ctx.stroke()

          // Рисуем цифры на циферблате
          for (let i = 1; i <= 12; i++) {
            const angle = i * Math.PI / 6
            const x = 100 + Math.sin(angle) * 80
            const y = 100 - Math.cos(angle) * 80
            ctx.font = '16px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline ='middle'
            ctx.fillStyle = 'black'
            ctx.fillText(i, x, y)
          }

          // Рисуем часы
          ctx.beginPath()
          ctx.moveTo(100, 100)
          ctx.lineTo(100 + Math.sin(this.hours * Math.PI / 6 + this.minutes * Math.PI / 360) * 50, 100 - Math.cos(this.hours * Math.PI / 6 + this.minutes * Math.PI / 360) * 50)
          ctx.stroke()

          // Рисуем минуты
          ctx.beginPath()
          ctx.moveTo(100, 100)
          ctx.lineTo(100 + Math.sin(this.minutes * Math.PI / 30) * 80, 100 - Math.cos(this.minutes * Math.PI / 30) * 80)
          ctx.stroke()

          // Рисуем секунды
          ctx.beginPath()
          ctx.moveTo(100, 100)
          ctx.lineTo(100 + Math.sin(this.seconds * Math.PI / 30) * 90, 100 - Math.cos(this.seconds * Math.PI / 30) * 90)
          ctx.stroke()
        }
      }
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
    this.updateClock()
    this.intervalId = setInterval(() => {
        this.updateClock()
    }, 1000)
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  }
};
</script>

<template>
<div>
    <header class="header">
        <div class="header-container">
            <div v-if="isDesktop">Шуст Марья Владимировна Р3211</div>
            <div v-if="isTablet">Шуст Марья Владимировна Р3211</div>
            <div v-if="isMobile">Шуст М. В. Р3211</div>
            <div></div>
            <div>Вариант 21050</div>
        </div>
    </header>
    <div class="container">
        <form class="form" @submit.prevent="checkAuth">
            <label for="login">Логин:</label>
            <input type="text" id="login" v-model="login" />
            <br />
            <label for="password">Пароль:</label>
            <input type="password" id="password" v-model="password" />
            <br />
            <button :disabled="!login ||!password" :class="{ 'active': login && password }" type="submit">Войти</button>
        </form>
        <p v-if="authResult">{{ authResult }}</p>
    </div>

    <canvas id="canvas" width="200" height="200" style="position: absolute;  left: 50%; transform: translate(-50%, -50%);"></canvas>

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

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
 }

button {
  background-color: #ccc;
  color: #666;
  cursor: pointer;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 24px;
}

button.active {
  background-color: #008000;
  color: #fff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form input[type="text"],.form input[type="password"] {
    font-size: 18px; /* увеличить шрифт */
    padding: 10px; /* добавить отступы */
    border: 1px solid #ccc; /* добавить границу */
    border-radius: 5px; /* добавить закругленные углы */
    margin-bottom: 10px;
  }
</style>
