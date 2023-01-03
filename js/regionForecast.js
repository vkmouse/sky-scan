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

const frcst3HR = document.querySelector("#forecast-3hr");
const frcstWeek = document.querySelector("#forecast-week");
const frcst24HR = document.querySelector("#forecast-24hr");
const tabs = [frcst3HR, frcstWeek, frcst24HR];

class RegionForecast {
  constructor(locationName) {
    this.locationId = locationIds[locationName];
    this.regionData;
  }

  init = async () => {
    const response = await fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/${this.locationId}?Authorization=${config.API_KEY}`
    );
    const result = await response.json();
    this.regionData = result.records.locations[0].location;
    frcst3HR.classList.add("tab-seleted");
  };

  //   showData = () => {
  //     console.log(this.regionData);
  //   };

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
