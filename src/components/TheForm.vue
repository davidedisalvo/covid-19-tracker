<template>
  <div class="form mt-5 mb-5">
    <b-container>
      <h2>Choose a nation from the form</h2>
      <b-row>
        <b-col lg="12" class="d-flex mb-2">
          <b-form-select v-model="selected" class="mr-2">
            <b-form-select-option
              :value="[item.code, item.name]"
              v-for="(item, index) in selectedNations"
              :key="index"
            >{{item.name}}</b-form-select-option>
          </b-form-select>
          <b-button @click.prevent="lookInSelected" variant="outline-dark">Submit</b-button>
        </b-col>
      </b-row>
    </b-container>

    <b-container>
      <transition name="fade" mode="out-in">
        <b-row>
          <b-col lg="12">
            <b-card v-if="dataInSelected" tag="article" class="mb-5">
              <b-card-text>
                <h2>{{name}}</h2>
                <h3>Confirmed:</h3>
                <p>{{dataInSelected.data.latest.confirmed}}</p>
                <h3>Deaths:</h3>
                <p>{{dataInSelected.data.latest.deaths}}</p>
                <h3>Recovered:</h3>
                <p>{{dataInSelected.data.latest.recovered}}</p>
              </b-card-text>
              <h2
                class="mb-5 mt-5"
                style="color: white; z-index: 2; position: relative"
              >Timeline of confirmed and deaths cases in {{name}}</h2>
              <div class="legenda" style="z-index: 2; position: absolute; left: 20%;">
                <h4>Legend:</h4>
                <p style="color: blue; position: relative">Confirmed</p>
                <p style="color: red; position: relative">Deaths</p>
              </div>
              <chart :options="dateCollection"></chart>
            </b-card>
          </b-col>
        </b-row>
      </transition>

      <div></div>
    </b-container>
  </div>
</template>

<script>
import nations from "../assets/nations.json";
import axios from "axios";

export default {
  data() {
    return {
      selectedNations: nations,
      selected: [],
      dataInSelected: "",
      name: "",
      timeline: undefined,
      timelineDeath: undefined,
      date: [],
      value: [],
      valueDeath: []
    };
  },

  computed: {
    dateCollection() {
      if (this.value && this.date) {
        return {
          xAxis: {
            data: this.date,
            textStyle: { color: "red" },
            axisLine: { lineStyle: { color: "#8392A5" } }
          },
          yAxis: {
            type: "value",
            textStyle: { color: "red" },
            axisLine: { lineStyle: { color: "#8392A5" } },
            splitLine: { show: false }
          },
          grid: { bottom: 80 },

          series: [
            {
              type: "line",
              data: this.value,
              color: ["blue"]
            },
            {
              type: "line",
              data: this.valueDeath,
              color: ["red"]
            }
          ],

          tooltip: {
            trigger: "axis",
            axisPointer: {
              animation: false,
              type: "cross",
              lineStyle: { color: "#376df4", width: "50px", opacity: 1 }
            }
          }
        };
      }
    }
  },

  methods: {
    lookInSelected() {
      const self = this;
      this.$store.commit("minimized", true);
      const par = this.selected[0].toUpperCase();
      axios
        .get(
          "https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=" +
            par
        )
        .then(function(response) {
          console.log(response);
          self.name = self.selected[1];
          self.dataInSelected = response;
        });
      axios
        .get(
          "https://coronavirus-tracker-api.herokuapp.com/v2/locations?timelines=1"
        )
        .then(function(response) {
          response.data.locations.forEach(function(el) {
            if (el.country === self.selected[1]) {
              self.timeline = el.timelines.confirmed.timeline;
              self.timelineDeath = el.timelines.deaths.timeline;
            }
          });

          Object.keys(self.timeline).forEach(function(key) {
            var d = new Date(key);
            var day = d.getDate();
            var month = d.getMonth();
            console.log("month", month);
            var months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ];
            var date = day + " " + months[month];
            self.date.push(date);
          });

          Object.values(self.timeline).forEach(function(key) {
            self.value.push(key);
          });
          Object.values(self.timelineDeath).forEach(function(key) {
            self.valueDeath.push(key);
          });
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.card {
  background: url("../assets/covid-black.jpg");
  background-size: contain;
  background-position: right;
  background-position-y: -10px;
  background-repeat: no-repeat;
  background-color: black;
  color: white;
  text-align: left;

  h2 {
    text-align: center;
  }
}

.custom-select {
  border: 2px solid black;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.card-body {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: rgba(0, 0, 0, 0.73);
  }

  .card-text {
    position: relative;
    z-index: 2;
  }
}
.legenda {
  background: white;
  padding: 10px 20px;
  border-radius: 4px;
  width: 200px;
  @media (max-width: 600px) {
    position: relative;
  }
  h4 {
    color: black;
  }
  p {
    margin: 0;
    padding: 0;
  }
}
</style>
