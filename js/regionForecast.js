const locationIds = {
  宜蘭縣: "F-D0047-001",
  桃園市: "F-D0047-005",
  新竹縣: "F-D0047-009",
  苗栗縣: "F-D0047-013",
  彰化縣: "F-D0047-017",
  南投縣: "F-D0047-021",
  雲林縣: "F-D0047-025",
  嘉義縣: "F-D0047-029",
  屏東縣: "F-D0047-033",
  臺東縣: "F-D0047-037",
  花蓮縣: "F-D0047-041",
  澎湖縣: "F-D0047-045",
  基隆市: "F-D0047-049",
  新竹市: "F-D0047-053",
  嘉義市: "F-D0047-057",
  臺北市: "F-D0047-061",
  高雄市: "F-D0047-065",
  新北市: "F-D0047-069",
  臺中市: "F-D0047-073",
  臺南市: "F-D0047-077",
  連江縣: "F-D0047-081",
  金門縣: "F-D0047-085",
};

const weatherImgSrc = {
  陰: "./images/overcast.svg",
  短暫雨: "./images/rainy.png",
  晴: "./images/sunny.png",
  多雲: "./images/cloudy.png",
};

const weekDay = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

const colspan2Time = ["00:00", "06:00", "12:00", "18:00"];

const frcst3HR = document.querySelector("#forecast-3hr");
const frcstWeek = document.querySelector("#forecast-week");
const frcst24HR = document.querySelector("#forecast-24hr");
const tabs = [frcst3HR, frcstWeek, frcst24HR];

class RegionForecast {
  constructor(locationName) {
    const date = new Date();
    this.today = date.toLocaleDateString();
    this.nextDate = this.addDate(this.today, 1);
    this.next2Date = this.addDate(this.today, 2);
    this.day = new Date(this.today).getDay();
    this.nextDay = new Date(this.nextDate).getDay();
    this.next2Day = new Date(this.next2Date).getDay();
    this.locationName = locationName;
    this.locationId = locationIds[locationName];
    this.regionData;
    this.dist = 0;
  }

  addDate = (today, days) => {
    const todayDate = new Date(today);
    todayDate.setDate(todayDate.getDate() + days);
    return `${todayDate.getFullYear()}/${
      todayDate.getMonth() + 1
    }/${todayDate.getDate()}`;
  };

  init = async () => {
    const response = await fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/${this.locationId}?Authorization=${config.Authorization_Key}`
    );
    const result = await response.json();
    this.regionData = result.records.locations[0].location;
    frcst3HR.classList.add("tab-seleted");
    this.showInitData();
    this.getWeatherElement();
  };

  showInitData = () => {
    console.log(this.regionData);
    document.querySelector("#city-title").textContent = this.locationName;
    document.querySelector("#dist-title").textContent =
      this.regionData[this.dist].locationName;
    const distSelect = document.querySelector("select");
    // 逐三小時
    const firstDate = document.querySelector("#first-date");
    const secondDate = document.querySelector("#second-date");
    const thirdDate = document.querySelector("#third-date");
    const firstWeekday = document.querySelector("#first-weekday");
    const secondWeekday = document.querySelector("#second-weekday");
    const thirdWeekday = document.querySelector("#third-weekday");
    firstDate.textContent = this.today.substring(5);
    secondDate.textContent = this.nextDate.substring(5);
    thirdDate.textContent = this.next2Date.substring(5);
    firstWeekday.textContent = weekDay[this.day];
    secondWeekday.textContent = weekDay[this.nextDay];
    thirdWeekday.textContent = weekDay[this.next2Day];

    // 一週

    // 過去24小時

    let cnt = 0;
    for (const data of this.regionData) {
      const distOption = document.createElement("option");
      distOption.textContent = data.locationName;
      distOption.value = `${cnt}`;
      distSelect.appendChild(distOption);
      cnt++;
    }
  };

  // =============================================================================

  getWeatherElement = () => {
    let dateTimeCnt = 0;
    console.log(this.regionData[this.dist].weatherElement);
    const firstDateContainer = document.querySelector("#first-date-container");

    // Wx(天氣現象)
    for (const element of this.regionData[this.dist].weatherElement[1].time) {
      if (
        new Date(element.startTime.split(" ")[0])
          .toLocaleDateString()
          .split("T")[0] >
        new Date(this.next2Date).toLocaleDateString().split("T")[0]
      ) {
        break;
      }
      if (
        new Date(this.today).toLocaleDateString().split("T")[0] ==
        new Date(element.startTime.split(" ")[0])
          .toLocaleDateString()
          .split("T")[0]
      ) {
        dateTimeCnt++;
      }
      const HR3_time = document.querySelector(".HR3_time");
      const HR3_time_td = document.createElement("td");
      HR3_time_td.textContent = element.startTime.split(" ")[1].substring(0, 5);
      HR3_time.appendChild(HR3_time_td);

      const HR3_weatherStatus = document.querySelector(".HR3_weather-status");
      const HR3_weatherStatus_td = document.createElement("td");
      const HR3_weatherStatus_img = document.createElement("img");
      HR3_weatherStatus_img.src = weatherImgSrc[element.elementValue[0].value];
      HR3_weatherStatus_td.appendChild(HR3_weatherStatus_img);
      HR3_weatherStatus.appendChild(HR3_weatherStatus_td);
    }
    firstDateContainer.setAttribute("colspan", `${dateTimeCnt}`);

    // T(溫度)
    for (const element of this.regionData[this.dist].weatherElement[3].time) {
      if (
        new Date(element.dataTime.split(" ")[0])
          .toLocaleDateString()
          .split("T")[0] >
        new Date(this.next2Date).toLocaleDateString().split("T")[0]
      ) {
        break;
      }
      const HR3_temperature = document.querySelector(".HR3_temperature");
      const HR3_temperature_td = document.createElement("td");
      HR3_temperature_td.textContent = `${element.elementValue[0].value}°C`;
      HR3_temperature.appendChild(HR3_temperature_td);
    }

    // AT(體感溫度)
    for (const element of this.regionData[this.dist].weatherElement[2].time) {
      if (
        new Date(element.dataTime.split(" ")[0])
          .toLocaleDateString()
          .split("T")[0] >
        new Date(this.next2Date).toLocaleDateString().split("T")[0]
      ) {
        break;
      }
      const HR3_apparentTemperature = document.querySelector(
        ".HR3_apparent-temperature"
      );
      const HR3_apparentTemperature_td = document.createElement("td");
      HR3_apparentTemperature_td.textContent = `${element.elementValue[0].value}°C`;
      HR3_apparentTemperature.appendChild(HR3_apparentTemperature_td);
    }

    // PoP6h(6小時降雨機率)
    for (const element of this.regionData[this.dist].weatherElement[7].time) {
      if (
        new Date(element.startTime.split(" ")[0])
          .toLocaleDateString()
          .split("T")[0] >
        new Date(this.next2Date).toLocaleDateString().split("T")[0]
      ) {
        break;
      }

      const R3_rainProbabitlity = document.querySelector(
        ".HR3_rain-probabitlity"
      );
      const R3_rainProbabitlity_td = document.createElement("td");
      R3_rainProbabitlity_td.textContent = `${element.elementValue[0].value} %`;

      if (colspan2Time.includes(element.startTime.split(" ")[1].substring(3))) {
        R3_rainProbabitlity_td.setAttribute("colspan", "2");
      }

      R3_rainProbabitlity.appendChild(R3_rainProbabitlity_td);
    }

    // RH(相對濕度)
    for (const element of this.regionData[this.dist].weatherElement[4].time) {
      if (
        new Date(element.dataTime.split(" ")[0])
          .toLocaleDateString()
          .split("T")[0] >
        new Date(this.next2Date).toLocaleDateString().split("T")[0]
      ) {
        break;
      }

      const HR3_relativeHumidity = document.querySelector(
        ".HR3_relative-humidity"
      );
      const HR3_relativeHumidity_td = document.createElement("td");
      HR3_relativeHumidity_td.textContent = `${element.elementValue[0].value} %`;
      HR3_relativeHumidity.appendChild(HR3_relativeHumidity_td);
    }

    // WS(風速)
    for (const element of this.regionData[this.dist].weatherElement[8].time) {
      if (
        new Date(element.dataTime.split(" ")[0])
          .toLocaleDateString()
          .split("T")[0] >
        new Date(this.next2Date).toLocaleDateString().split("T")[0]
      ) {
        break;
      }

      const HR3_BFWind = document.querySelector(".HR3_BF-wind");
      const HR3_BFWind_td = document.createElement("td");
      HR3_BFWind_td.textContent = `${element.elementValue[1].value}`;
      HR3_BFWind.appendChild(HR3_BFWind_td);
    }

    // WD(風向)
    for (const element of this.regionData[this.dist].weatherElement[9].time) {
      if (
        new Date(element.dataTime.split(" ")[0])
          .toLocaleDateString()
          .split("T")[0] >
        new Date(this.next2Date).toLocaleDateString().split("T")[0]
      ) {
        break;
      }

      const HR3_windDirection = document.querySelector(".HR3_wind-direction");
      const HR3_windDirection_td = document.createElement("td");
      HR3_windDirection_td.textContent = `${element.elementValue[0].value}`;
      HR3_windDirection.appendChild(HR3_windDirection_td);
    }

    // CI(舒適度)
    for (const element of this.regionData[this.dist].weatherElement[5].time) {
      if (
        new Date(element.dataTime.split(" ")[0])
          .toLocaleDateString()
          .split("T")[0] >
        new Date(this.next2Date).toLocaleDateString().split("T")[0]
      ) {
        break;
      }

      const HR3_comfort = document.querySelector(".HR3_comfort");
      const HR3_comfort_td = document.createElement("td");
      HR3_comfort_td.textContent = `${element.elementValue[1].value}`;
      HR3_comfort.appendChild(HR3_comfort_td);
    }
  };

  // =============================================================================

  changeTabColor = (e) => {
    for (const tab of tabs) {
      if (!tab.classList.contains("tab-seleted")) {
        continue;
      }
      tab.classList.remove("tab-seleted");
      break;
    }
    e.target.classList.add("tab-seleted");
  };
}

const locationQueryStr = window.location.href.split("?")[1];
const locationName = locationQueryStr.split("=")[1];
const regionForecast = new RegionForecast("臺北市");

window.onload = () => {
  regionForecast.init();
};

tabs.forEach((tab) => {
  tab.addEventListener("click", regionForecast.changeTabColor);
});
