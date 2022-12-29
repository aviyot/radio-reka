<template>
  <div id="app">
    <header id="header">
      <span id="date"> {{ currentDate }}</span>
      <span id="day"> {{ dayName }} </span>
      <span id="title"> רדיו רקע אמהרית</span>
    </header>
    <div style="display: grid; grid-template-rows: 70% 30%;">
      <div class="online_prod" style="text-align: center;">
        <!-- not work -->
        <!-- <iframe src="https://www.dailymotion.com/embed/video/x7yx60p?autoplay=1" allow="encrypted-media"></iframe>
 -->
        <iframe
          width="100%"
          height="100%"
          src="https://www.kan.org.il/radio/player.aspx?stationId=10&video_id=1_8gp8l2wf"
        ></iframe>
      </div>
      <div style="display: grid;">
        <iframe id="morning" scrolling="no" v-bind:src="src" width="100%">
        </iframe>
        <div id="select-prod-control" v-if="pastProdControlHide">
          <div class="select-date">
            <input v-model="selectedPordDate" type="date" />
            <span>
              <label>בחר תאריך</label>
            </span>
          </div>
          <div id="days">
            <button
              v-for="day in 7"
              :key="day"
              v-on:click="daysClick(day)"
              v-bind:class="{ active: selectedDayNumber == day }"
            >
              <span>{{ day | formatDayName }}</span>
            </button>
          </div>
          <div id="times">
            <button
              v-for="time in prodTimes"
              :key="time"
              v-on:click="timesClick(time)"
              v-bind:class="{ active: timeName === time }"
            >
              <span>{{ time | formatName }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function() {
    return {
      day: new Date(),
      timeName: "amharit",
      dayNumber: 1,
      selectedDay: new Date(),
      selectedPordDate: new Date().toISOString().slice(0, 10),
      d: 8,
      liveProd: true,
      pastProd: true,
      pastProdControlHide: true,
      prodTimes: ["amharit", "kan-amhari-noon", "evenign-news-amharit"],
    };
  },
  methods: {
    daysClick: function(day) {
      this.d = day;
      let curentDay = new Date().getDay() + 1;
      let difDay = curentDay - day;
      if (difDay === 0) {
        this.selectedDay = new Date();
        this.selectedPordDate = this.selectedDay.toISOString().slice(0, 10);
      }
      if (difDay > 0) {
        this.selectedDay = new Date(new Date().getTime() - 86400000 * difDay);
        this.selectedPordDate = this.selectedDay.toISOString().slice(0, 10);
      }
      if (difDay < 0) {
        this.selectedDay = new Date(
          new Date().getTime() - 86400000 * (7 + difDay)
        );
        this.selectedPordDate = this.selectedDay.toISOString().slice(0, 10);
      }
    },
    timesClick: function(time) {
      this.timeName = time;
    },
    prodLive: function() {
      this.liveProd = true;
      this.pastProd = false;
    },
    prodPast: function() {
      this.liveProd = false;
      this.pastProd = true;
      this.pastProdControlHide = true;
    },
    onPlayPastProd: function() {
      console.log(this.pastProdControlHide);
      this.pastProdControlHide = false;
    },
    selectProdTime: function() {
      let currentTime = new Date().getTime();
      //"amharit","kan-amhari-noon","evenign-news-amharit";
      //6:15 - 14:00

      let morningRangeStart = new Date().setHours(6, 15);
      let morningRangeEnd = new Date().setHours(14);

      let noonRangeStart = new Date().setHours(14);
      let noonRangeEnd = new Date().setHours(20);

      let eveningRangeStart = new Date().setHours(20);
      let eveningRangeEnd = new Date().setHours(30, 15);

      if (currentTime >= morningRangeStart && currentTime <= morningRangeEnd)
        this.timeName = this.prodTimes[0];
      if (currentTime >= noonRangeStart && currentTime <= noonRangeEnd)
        this.timeName = this.prodTimes[1];

      if (currentTime >= eveningRangeStart && currentTime <= eveningRangeEnd)
        this.timeName = this.prodTimes[2];
    },
  },
  filters: {
    formatName: function(value) {
      if (value == "amharit") return "בוקר";
      if (value == "kan-amhari-noon") return "צהריים";
      if (value == "evenign-news-amharit") return "ערב";
    },
    formatDayName: function(value) {
      if (value == 1) return "א";
      if (value == 2) return "ב";
      if (value == 3) return "ג";
      if (value == 4) return "ד";
      if (value == 5) return "ה";
      if (value == 6) return "ו";
      if (value == 7) return "ז";
    },
  },
  mounted() {
    setInterval(() => {
      this.day = new Date();
    }, 60000);
    this.selectProdTime();
  },
  computed: {
    src: function() {
      return `https://omny.fm/shows/${this.timeName}/${this.dateFormat}/embed`;
    },
    selectedDayNumber: function() {
      return new Date(this.selectedPordDate).getDay() + 1;
    },
    currentDate: function() {
      let currentDate = new Date();
      return `${currentDate.getDate()}-${currentDate.getMonth() +
        1}-${currentDate.getFullYear()}`;
    },
    selectedDate: function() {
      let currentDate = this.selectedDay;
      return `${currentDate.getDate()}-${currentDate.getMonth() +
        1}-${currentDate.getFullYear()}`;
    },
    dayName: function() {
      this.dayNumber = this.day.getDay();
      if (this.dayNumber == 0) return "ראשון";
      if (this.dayNumber == 1) return "שני";
      if (this.dayNumber == 2) return "שלישי";
      if (this.dayNumber == 3) return "רביעי";
      if (this.dayNumber == 4) return "חמישי";
      if (this.dayNumber == 5) return "שישי";
      if (this.dayNumber == 6) return "שבת";
    },
    clock: function() {
      function f(val) {
        if (val < 10) return "0" + val;
        else return val;
      }

      let sec = this.day.getSeconds();
      let min = this.day.getMinutes();
      let h = this.day.getHours();

      return f(h) + ":" + f(min) + ":" + f(sec);
    },

    dateFormat: function() {
      this.d = 8;
      let date = new Date(this.selectedPordDate);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

body,
html {
  margin: 0px;
  height: 100%;
}

#days {
  display: flex;
  flex-wrap: nowrap;
  background-color: aliceblue;
  flex-direction: row-reverse;
}

#days button {
  /*   width: calc(100% / 7);
  text-align: center; */
  flex-grow: 1;
}

#times {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row-reverse;
  background-color: beige;
}

#times button {
  /*   width: calc(100% / 3);
  text-align: center; */
  flex-grow: 1;
}

#header {
  text-align: center;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background-color: lightgray;
  margin-bottom: 10px;
  font-size: x-large;
  background-image: linear-gradient(to right, white, blue, white);
}

button {
  padding: 4px;
  font-size: large;
}

#clock {
  font-size: xx-large;
  color: red;
}

.active {
  background-color: blue;
  color: white;
  font-weight: bold;
}

.prod-type {
  display: flex;
  color: white;
  justify-content: space-around;
}

.prod-type button {
  flex-grow: 1;
  font-size: x-large;
  padding: 5px;
}

.select-date {
  font-size: x-large;
  display: flex;
  justify-content: space-between;
}

.select-date input {
  text-align: left;
  font-size: x-large;
}

.select-date label {
  text-align: left;
}

#live-prod-btn {
  color: whitesmoke;
}

#past-prod-btn {
  color: whitesmoke;
}

#iframe-div {
  position: relative;
}

#date {
  color: red;
}

#title {
  color: green;
}

#day {
  color: yellow;
}
</style>
