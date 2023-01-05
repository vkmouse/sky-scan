const locationIds_3hr = {
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

const locationIds_week = {
  宜蘭縣: "F-D0047-003",
  桃園市: "F-D0047-007",
  新竹縣: "F-D0047-011",
  苗栗縣: "F-D0047-015",
  彰化縣: "F-D0047-019",
  南投縣: "F-D0047-023",
  雲林縣: "F-D0047-027",
  嘉義縣: "F-D0047-031",
  屏東縣: "F-D0047-035",
  臺東縣: "F-D0047-039",
  花蓮縣: "F-D0047-043",
  澎湖縣: "F-D0047-047",
  基隆市: "F-D0047-051",
  新竹市: "F-D0047-055",
  嘉義市: "F-D0047-059",
  臺北市: "F-D0047-063",
  高雄市: "F-D0047-067",
  新北市: "F-D0047-071",
  臺中市: "F-D0047-075",
  臺南市: "F-D0047-079",
  連江縣: "F-D0047-083",
  金門縣: "F-D0047-087",
};

const tabTable = {
  "forecast-3hr": "HR3_table",
  "forecast-week": "week_table",
  "forecast-24hr": "HR24_table",
};

const weatherImgSrc = {
  陰: "./images/overcast.svg",
  陰天: "./images/overcast.svg",
  陰時多雲: "./images/overcast-cloudy.svg",
  多雲時陰: "./images/overcast-cloudy.svg",
  短暫雨: "./images/overcast-rainy.svg",
  陰短暫雨: "./images/overcast-rainy.svg",
  多雲短暫雨: "./images/cloudy-rainy.svg",
  多雲時陰短暫雨: "./images/cloudy-overcast-rainy.svg",
  晴: "./images/sunny.png",
  多雲: "./images/cloudy.png",
  晴時多雲: "./images/sunny-cloudy.svg",
  "晴時多雲(晚)": "./images/sunny-cloudy-night.svg",
  多雲時晴: "./images/cloudy-sunny.svg",
  "多雲時晴(晚)": "./images/cloudy-sunny-night.svg",
};

const imgNight = ["晴時多雲", "多雲時晴"];

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
    this.locationIds_3hr = locationIds_3hr[locationName];
    this.locationIds_week = locationIds_week[locationName];
    this.regionData_3hr;
    this.regionData_week;
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
    const response_3hr = await fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/${this.locationIds_3hr}?Authorization=${config.Authorization_Key}`
    );
    const result_3hr = await response_3hr.json();
    this.regionData_3hr = result_3hr.records.locations[0].location;

    const response_week = await fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/${this.locationIds_week}?Authorization=${config.Authorization_Key}`
    );
    const result_week = await response_week.json();
    this.regionData_week = result_week.records.locations[0].location;

    frcst3HR.classList.add("tab-seleted");
    document.querySelector("#HR3_table").classList.remove("none");

    // 鄉鎮列表
    let cnt = 0;
    const distSelect = document.querySelector("select");
    for (const data of this.regionData_3hr) {
      const distOption = document.createElement("option");
      distOption.textContent = data.locationName;
      distOption.value = `${cnt}`;
      distSelect.appendChild(distOption);
      cnt++;
    }
    this.getInitData();
  };

  getInitData = () => {
    document.querySelector("#city-title").textContent = this.locationName;
    document.querySelector("#dist-title").textContent =
      this.regionData_3hr[this.dist].locationName;

    // 逐三小時
    this.getWeatherElement_3hr();

    // 一週
    this.getWeatherElement_week();

    // 過去24小時
  };

  // ================================ 逐三小時預報 =============================================

  getWeatherElement_3hr = () => {
    let dateTimeCnt = 0;
    let colspanCnt = 0;
    // 日期
    const firstDate = document.querySelector("#first-date");
    const secondDate = document.querySelector("#second-date");
    const thirdDate = document.querySelector("#third-date");
    const firstWeekday = document.querySelector("#first-weekday");
    const secondWeekday = document.querySelector("#second-weekday");
    const thirdWeekday = document.querySelector("#third-weekday");
    const firstDateContainer = document.querySelector("#first-date-container");

    // Wx(天氣現象)
    for (const element of this.regionData_3hr[this.dist].weatherElement[1]
      .time) {
      if (dateTimeCnt === 3) {
        break;
      }

      if (dateTimeCnt === 0) {
        colspanCnt++;
      }

      if (element.startTime.split(" ")[1].substring(0, 5) == "21:00") {
        if (dateTimeCnt === 0) {
          firstDate.textContent = element.startTime
            .split(" ")[0]
            .substring(5)
            .replace("-", "/");
          firstWeekday.textContent =
            weekDay[new Date(element.startTime.split(" ")[0]).getDay()];
        } else if (dateTimeCnt === 1) {
          secondDate.textContent = element.startTime
            .split(" ")[0]
            .substring(5)
            .replace("-", "/");
          secondWeekday.textContent =
            weekDay[new Date(element.startTime.split(" ")[0]).getDay()];
        } else if (dateTimeCnt === 2) {
          thirdDate.textContent = element.startTime
            .split(" ")[0]
            .substring(5)
            .replace("-", "/");
          thirdWeekday.textContent =
            weekDay[new Date(element.startTime.split(" ")[0]).getDay()];
        }
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
    firstDateContainer.setAttribute("colspan", `${colspanCnt}`);
    dateTimeCnt = 0;

    // T(溫度)
    for (const element of this.regionData_3hr[this.dist].weatherElement[3]
      .time) {
      if (dateTimeCnt === 3) {
        dateTimeCnt = 0;
        break;
      }

      if (element.dataTime.split(" ")[1].substring(0, 5) == "21:00") {
        dateTimeCnt++;
      }

      const HR3_temperature = document.querySelector(".HR3_temperature");
      const HR3_temperature_td = document.createElement("td");
      HR3_temperature_td.textContent = `${element.elementValue[0].value}°C`;
      HR3_temperature.appendChild(HR3_temperature_td);
    }
    dateTimeCnt = 0;

    // AT(體感溫度)
    for (const element of this.regionData_3hr[this.dist].weatherElement[2]
      .time) {
      if (dateTimeCnt === 3) {
        dateTimeCnt = 0;
        break;
      }

      if (element.dataTime.split(" ")[1].substring(0, 5) == "21:00") {
        dateTimeCnt++;
      }

      const HR3_apparentTemperature = document.querySelector(
        ".HR3_apparent-temperature"
      );
      const HR3_apparentTemperature_td = document.createElement("td");
      HR3_apparentTemperature_td.textContent = `${element.elementValue[0].value}°C`;
      HR3_apparentTemperature.appendChild(HR3_apparentTemperature_td);
    }
    dateTimeCnt = 0;

    // PoP6h(6小時降雨機率)
    for (const element of this.regionData_3hr[this.dist].weatherElement[7]
      .time) {
      if (dateTimeCnt === 3) {
        dateTimeCnt = 0;
        break;
      }

      if (element.startTime.split(" ")[1].substring(0, 5) == "18:00") {
        dateTimeCnt++;
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
    dateTimeCnt = 0;

    // RH(相對濕度)
    for (const element of this.regionData_3hr[this.dist].weatherElement[4]
      .time) {
      if (dateTimeCnt === 3) {
        dateTimeCnt = 0;
        break;
      }

      if (element.dataTime.split(" ")[1].substring(0, 5) == "21:00") {
        dateTimeCnt++;
      }

      const HR3_relativeHumidity = document.querySelector(
        ".HR3_relative-humidity"
      );
      const HR3_relativeHumidity_td = document.createElement("td");
      HR3_relativeHumidity_td.textContent = `${element.elementValue[0].value} %`;
      HR3_relativeHumidity.appendChild(HR3_relativeHumidity_td);
    }
    dateTimeCnt = 0;

    // WS(風速)
    for (const element of this.regionData_3hr[this.dist].weatherElement[8]
      .time) {
      if (dateTimeCnt === 3) {
        dateTimeCnt = 0;
        break;
      }

      if (element.dataTime.split(" ")[1].substring(0, 5) == "21:00") {
        dateTimeCnt++;
      }

      const HR3_BFWind = document.querySelector(".HR3_BF-wind");
      const HR3_BFWind_td = document.createElement("td");
      HR3_BFWind_td.textContent = `${element.elementValue[1].value}`;
      HR3_BFWind.appendChild(HR3_BFWind_td);
    }
    dateTimeCnt = 0;

    // WD(風向)
    for (const element of this.regionData_3hr[this.dist].weatherElement[9]
      .time) {
      if (dateTimeCnt === 3) {
        dateTimeCnt = 0;
        break;
      }

      if (element.dataTime.split(" ")[1].substring(0, 5) == "21:00") {
        dateTimeCnt++;
      }

      const HR3_windDirection = document.querySelector(".HR3_wind-direction");
      const HR3_windDirection_td = document.createElement("td");
      HR3_windDirection_td.textContent = `${element.elementValue[0].value}`;
      HR3_windDirection.appendChild(HR3_windDirection_td);
    }
    dateTimeCnt = 0;

    // CI(舒適度)
    for (const element of this.regionData_3hr[this.dist].weatherElement[5]
      .time) {
      if (dateTimeCnt === 3) {
        dateTimeCnt = 0;
        break;
      }

      if (element.dataTime.split(" ")[1].substring(0, 5) == "21:00") {
        dateTimeCnt++;
      }

      const HR3_comfort = document.querySelector(".HR3_comfort");
      const HR3_comfort_td = document.createElement("td");
      HR3_comfort_td.textContent = `${element.elementValue[1].value}`;
      HR3_comfort.appendChild(HR3_comfort_td);
    }
  };

  // ================================ 一週預報 =============================================

  getWeatherElement_week = () => {
    let dateTimeCnt = 0;
    const WEEK_date = document.querySelector(".WEEK_date");
    const WEEK_time = document.querySelector(".WEEK_time");

    // Wx(天氣現象)
    for (const element of this.regionData_week[this.dist].weatherElement[6]
      .time) {
      console.log(element);
      if (
        element.startTime.split(" ")[1].substring(0, 5) !== "06:00" &&
        dateTimeCnt === 0
      ) {
        continue;
      }

      dateTimeCnt++;

      // date
      if (element.startTime.split(" ")[1].substring(0, 5) === "18:00") {
        const WEEK_date_th = document.createElement("td");
        const date = document.createElement("span");
        date.textContent = element.startTime
          .split(" ")[0]
          .substring(5)
          .replace("-", "/");
        const br = document.createElement("br");
        const day = document.createElement("span");
        day.textContent =
          weekDay[new Date(element.startTime.split(" ")[0]).getDay()];
        WEEK_date_th.appendChild(date);
        WEEK_date_th.appendChild(br);
        WEEK_date_th.appendChild(day);
        WEEK_date_th.setAttribute("colspan", "2");
        if (dateTimeCnt === 0) {
          WEEK_date_th.setAttribute("colspan", "1");
        }
        WEEK_date.appendChild(WEEK_date_th);
      }

      // time
      const WEEK_time_td = document.createElement("td");
      if (element.startTime.split(" ")[1].substring(0, 5) >= "18:00") {
        WEEK_time_td.textContent = "晚上";
      } else {
        WEEK_time_td.textContent = "白天";
      }
      WEEK_time.appendChild(WEEK_time_td);

      const WEEK_weatherStatus = document.querySelector(".WEEK_weather-status");
      const WEEK_weatherStatus_td = document.createElement("td");
      const WEEK_weatherStatus_img = document.createElement("img");
      if (
        imgNight.includes(element.elementValue[0].value) &&
        element.startTime.split(" ")[1].substring(0, 5) >= "18:00"
      ) {
        WEEK_weatherStatus_img.src =
          weatherImgSrc[`${element.elementValue[0].value}(晚)`];
      } else {
        WEEK_weatherStatus_img.src =
          weatherImgSrc[element.elementValue[0].value];
      }
      WEEK_weatherStatus_img.alt = element.elementValue[0].value;
      WEEK_weatherStatus_td.appendChild(WEEK_weatherStatus_img);
      WEEK_weatherStatus.appendChild(WEEK_weatherStatus_td);
    }
    dateTimeCnt = 0;

    // MaxT(最高溫)
    for (const element of this.regionData_week[this.dist].weatherElement[12]
      .time) {
      if (
        element.startTime.split(" ")[1].substring(0, 5) !== "06:00" &&
        dateTimeCnt === 0
      ) {
        continue;
      }

      dateTimeCnt++;

      const WEEK_maxTemperature = document.querySelector(
        ".WEEK_max-temperature"
      );
      const WEEK_maxTemperature_td = document.createElement("td");
      WEEK_maxTemperature_td.textContent = `${element.elementValue[0].value}°C`;
      WEEK_maxTemperature.appendChild(WEEK_maxTemperature_td);
    }
    dateTimeCnt = 0;

    // MinT(最低溫)
    for (const element of this.regionData_week[this.dist].weatherElement[8]
      .time) {
      if (
        element.startTime.split(" ")[1].substring(0, 5) !== "06:00" &&
        dateTimeCnt === 0
      ) {
        continue;
      }

      dateTimeCnt++;

      const WEEK_minTemperature = document.querySelector(
        ".WEEK_min-temperature"
      );
      const WEEK_minTemperature_td = document.createElement("td");
      WEEK_minTemperature_td.textContent = `${element.elementValue[0].value}°C`;
      WEEK_minTemperature.appendChild(WEEK_minTemperature_td);
    }
    dateTimeCnt = 0;

    // PoP12(降雨機率)
    for (const element of this.regionData_week[this.dist].weatherElement[0]
      .time) {
      if (
        element.startTime.split(" ")[1].substring(0, 5) !== "06:00" &&
        dateTimeCnt === 0
      ) {
        continue;
      }

      dateTimeCnt++;

      const WEEK_rainProbabitlity = document.querySelector(
        ".WEEK_rain-probabitlity"
      );
      const WEEK_rainProbabitlity_td = document.createElement("td");
      if (element.elementValue[0].value !== " ") {
        WEEK_rainProbabitlity_td.textContent = `${element.elementValue[0].value} %`;
      } else {
        WEEK_rainProbabitlity_td.textContent = `-`;
      }
      WEEK_rainProbabitlity.appendChild(WEEK_rainProbabitlity_td);
    }
    dateTimeCnt = 0;

    // MaxAT(體感最高溫)
    for (const element of this.regionData_week[this.dist].weatherElement[5]
      .time) {
      if (
        element.startTime.split(" ")[1].substring(0, 5) !== "06:00" &&
        dateTimeCnt === 0
      ) {
        continue;
      }

      dateTimeCnt++;

      const WEEK_maxApparentTemperature = document.querySelector(
        ".WEEK_max-apparent-temperature"
      );
      const WEEK_maxApparentTemperature_td = document.createElement("td");
      WEEK_maxApparentTemperature_td.textContent = `${element.elementValue[0].value}°C`;
      WEEK_maxApparentTemperature.appendChild(WEEK_maxApparentTemperature_td);
    }
    dateTimeCnt = 0;

    // MinAT(體感最低溫)
    for (const element of this.regionData_week[this.dist].weatherElement[11]
      .time) {
      if (
        element.startTime.split(" ")[1].substring(0, 5) !== "06:00" &&
        dateTimeCnt === 0
      ) {
        continue;
      }

      dateTimeCnt++;

      const WEEK_minApparentTemperature = document.querySelector(
        ".WEEK_min-apparent-temperature"
      );
      const WEEK_minApparentTemperature_td = document.createElement("td");
      WEEK_minApparentTemperature_td.textContent = `${element.elementValue[0].value}°C`;
      WEEK_minApparentTemperature.appendChild(WEEK_minApparentTemperature_td);
    }
    dateTimeCnt = 0;

    // WS(蒲福風級)
    for (const element of this.regionData_week[this.dist].weatherElement[4]
      .time) {
      if (
        element.startTime.split(" ")[1].substring(0, 5) !== "06:00" &&
        dateTimeCnt === 0
      ) {
        continue;
      }

      dateTimeCnt++;

      const WEEK_BFWind = document.querySelector(".WEEK_BF-wind");
      const WEEK_BFWind_td = document.createElement("td");
      WEEK_BFWind_td.textContent = `${element.elementValue[1].value}`;
      WEEK_BFWind.appendChild(WEEK_BFWind_td);
    }
    dateTimeCnt = 0;

    // RH(相對濕度)
    for (const element of this.regionData_week[this.dist].weatherElement[2]
      .time) {
      if (
        element.startTime.split(" ")[1].substring(0, 5) !== "06:00" &&
        dateTimeCnt === 0
      ) {
        continue;
      }

      dateTimeCnt++;

      const WEEK_relativeHumidity = document.querySelector(
        ".WEEK_relative-humidity"
      );
      const WEEK_relativeHumidity_td = document.createElement("td");
      WEEK_relativeHumidity_td.textContent = `${element.elementValue[0].value} %`;
      WEEK_relativeHumidity.appendChild(WEEK_relativeHumidity_td);
    }
    dateTimeCnt = 0;

    // WD(風向)
    for (const element of this.regionData_week[this.dist].weatherElement[13]
      .time) {
      if (
        element.startTime.split(" ")[1].substring(0, 5) !== "06:00" &&
        dateTimeCnt === 0
      ) {
        continue;
      }

      dateTimeCnt++;

      const WEEK_windDirection = document.querySelector(".WEEK_wind-direction");
      const WEEK_windDirection_td = document.createElement("td");
      WEEK_windDirection_td.textContent = `${element.elementValue[0].value}`;
      WEEK_windDirection.appendChild(WEEK_windDirection_td);
    }
    dateTimeCnt = 0;

    // UVI(紫外線)
    for (const element of this.regionData_week[this.dist].weatherElement[9]
      .time) {
      if (
        element.startTime.split(" ")[1].substring(0, 5) !== "06:00" &&
        dateTimeCnt === 0
      ) {
        continue;
      }

      dateTimeCnt++;

      const WEEK_UVI = document.querySelector(".WEEK_UVI");
      const WEEK_UVI_td = document.createElement("td");
      WEEK_UVI_td.setAttribute("colspan", "2");
      WEEK_UVI_td.textContent = `${element.elementValue[0].value}`;
      WEEK_UVI.appendChild(WEEK_UVI_td);
    }
  };

  // =============================================================================

  getWeatherElement_24hr = () => {};

  // =============================================================================

  changeTabColor = (e) => {
    for (const tab of tabs) {
      if (!tab.classList.contains("tab-seleted")) {
        continue;
      }
      tab.classList.remove("tab-seleted");
      const tabId = tab.id;
      document.querySelector(`#${tabTable[tabId]}`).classList.add("none");
      break;
    }
    e.target.classList.add("tab-seleted");

    switch (e.target.textContent) {
      case "逐3小時預報":
        document.querySelector("#HR3_table").classList.remove("none");
        break;
      case "一週預報":
        document.querySelector("#week_table").classList.remove("none");
        break;
      case "過去24小時預報":
        document.querySelector("#HR24_table").classList.remove("none");
        break;
    }
  };

  changeSelect = (e) => {
    const tds = document.querySelectorAll("td");
    for (const td of tds) {
      td.remove();
    }
    this.dist = e.target.selectedIndex;
    this.getInitData();
  };
}

const locationQueryStr = window.location.href.split("?")[1];
const locationName = locationQueryStr.split("=")[1];
const regionForecast = new RegionForecast("臺北市");
const select = document.querySelector("select");

window.onload = () => {
  regionForecast.init();
};

tabs.forEach((tab) => {
  tab.addEventListener("click", regionForecast.changeTabColor);
});

select.addEventListener("change", regionForecast.changeSelect);
