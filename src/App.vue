<template>
  <div id="app">
    <header id="header">
    <!--   <span id="clock">{{ clock }}</span>
      <span id="date"> {{ dayName }} {{ currentDate }} </span> -->
      <span id="title"> רדיו רקע - אמהרית</span>
    </header>

    <div>
      <iframe
        src="https://kanapi.akamaized.net/Players/ByPlayer/V1/ipbc/kan-reka/hls-live"
        width="100%"
        frameborder="0"
        height=""
        scrolling="no"
        allow="accelerometer; autoplay; "
        allowfullscreen
        title="רדיו רקע"
      ></iframe>
    </div>
    <div id="hisbrod">
      <header>
        <span
          style="
            font-size: xx-large;
            background-color: black;
            color: white;
            display: flex;
            justify-content: center;
          "
          >שידורים שהיו</span
        >
      </header>
      <!-- <div> <span> {{dayName}} : {{currentDate}}</span></div> -->
      <div id="days">
        <button v-on:click="daysClick(1)" v-bind:class="{ active: (selectedDayNumber == 1) }"><span>א</span></button>
        <button v-on:click="daysClick(2)" v-bind:class="{ active: (selectedDayNumber == 2) }"><span>ב</span></button>
        <button v-on:click="daysClick(3)" v-bind:class="{ active: (selectedDayNumber == 3) }" ><span>ג</span></button>
        <button v-on:click="daysClick(4)" v-bind:class="{ active: (selectedDayNumber == 4) }"><span>ד</span></button>
        <button v-on:click="daysClick(5)" v-bind:class="{ active: (selectedDayNumber == 5) }" ><span>ה</span></button>
        <button v-on:click="daysClick(6)" v-bind:class="{ active: (selectedDayNumber == 6) }" ><span>ו</span></button>
        <button v-on:click="daysClick(7)" v-bind:class="{ active: (selectedDayNumber == 7) }" ><span>ז</span></button>
      </div>
      <div id="times">
        <button v-on:click="timesClick(1)"  v-bind:class="{ active: (timeName === 'amharit') }"><span>בוקר</span></button>
        <button v-on:click="timesClick(2)"  v-bind:class="{ active: (timeName === 'kan-amhari-noon')  }"><span>צהריים</span></button>
        <button v-on:click="timesClick(3)"  v-bind:class="{ active: (timeName === 'evenign-news-amharit')  }" ><span>ערב</span></button>
      </div>
      <iframe
        id="morning"
        width="100%"
        frameborder="0"
        height=""
        scrolling="no"
        v-bind:src="src"
      >
      </iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function () {
    return {
      day: new Date(),
      timeName: "amharit",
      dayNumber:1,
      selectedDay: new Date()
    };
  },
  methods: {
    daysClick: function (day) {
      let curentDay = new Date().getDay() + 1;
      let difDay = curentDay - day;
      if (difDay === 0) this.selectedDay = new Date();
      if (difDay > 0)
        this.selectedDay = new Date(new Date().getTime() - 86400000 * difDay);
      if (difDay < 0)
        this.selectedDay = new Date(
          new Date().getTime() - 86400000 * (7 + difDay)
        );
    },
    timesClick: function (time) {
      if (time === 1) this.timeName = "amharit";
      if (time === 2) this.timeName = "kan-amhari-noon";
      if (time === 3) this.timeName = "evenign-news-amharit";
    },
  },
  mounted() {
    setInterval(() => {
      this.day = new Date();
    }, 1000);
  },
  computed: {
    src: function () {
      return `https://omny.fm/shows/${this.timeName}/${this.selectedDate}/embed`;
    },
    selectedDayNumber:function(){
      return  this.selectedDay.getDay()+1;
    },
    currentDate: function () {
      let currentDate = new Date();
      return `${currentDate.getDate()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getFullYear()}`;
    },
     selectedDate: function () {
      let currentDate = this.selectedDay;
      return `${currentDate.getDate()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getFullYear()}`;
    },
    timeNameHeb: function () {
      if (this.time == "amharit") return "בוקר";
      if (this.time == "kan-amhari-noon") return "צהריים";
      if (this.time == "evenign-news-amharit") return "ערב";
    },
    dayName: function () {
      this.dayNumber = this.day.getDay();
      if (this.dayNumber == 0) return "ראשון";
      if (this.dayNumber == 1) return "שני";
      if (this.dayNumber == 2) return "שלישי";
      if (this.dayNumber == 3) return "רביעי";
      if (this.dayNumber == 4) return "חמישי";
      if (this.dayNumber == 5) return "שישי";
      if (this.dayNumber == 6) return "שבת";
    },
    clock: function () {
      function f(val) {
        if (val < 10) return "0" + val;
        else return val;
      }

      let sec = this.day.getSeconds();
      let min = this.day.getMinutes();
      let h = this.day.getHours();

      return f(h) + ":" + f(min) + ":" + f(sec);
    },
  },
};
</script>

<style>
#hisbrod {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 20px;
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
#hisbrod iframe {
  width: 100%;
}

#header {
  background-color: darkgrey;
  text-align: center;
  display: flex;
  justify-content: space-around;
  padding: 8px;
    background-image: linear-gradient(to right,white,blue,white,green, yellow,red,white,blue,white);
}

#date {
  font-size: xx-large;
  color: yellow;
}

#title {
  font-size: xx-large;
  color: white;
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
  color:white;
  font-weight: bold;
}


</style>
