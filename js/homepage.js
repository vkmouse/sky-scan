import TaiwanMap from "./taiwan_map.js";
import { setup as setupColorizer } from "./colorizer.js";


const root = document.getElementsByClassName("root")[0];
const twMap = new TaiwanMap(root);
const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${config.Authorization_Key}&locationName=`
const locationName = document.querySelector(".location");
const precipitation = document.querySelectorAll(".weather-status");
const precipitationFont = document.querySelectorAll(".probability-of-precipitation-font");
const weatherImage = document.querySelectorAll(".weather-status-image");
const temperature = document.querySelectorAll(".temperature");
const regionForecast = document.querySelector("#regionForecast");

let locationArr = null;
let prevClickedLocation;

setupColorizer(twMap);


fetch(url)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        locationArr = data.records.location;
        console.log(locationArr);
        initWeatherStatus();
        prevClickedLocation = "台北市";
        twMap.changeColor(prevClickedLocation, "#197ac9");

    })



twMap.onclick = (twMap, location) => {
    locationName.innerHTML = location;
    twMap.resetColor(location)
    twMap.changeColor(location, "#197ac9",);
    prevClickedLocation = location;
    locationArr.forEach(element => {

        if (element.locationName === location) {
            console.log(element.locationName)
            console.log(location)
            console.log("here")
            precipitation[0].innerHTML = element.weatherElement[0].time[0].parameter.parameterName;
            precipitation[1].innerHTML = element.weatherElement[0].time[1].parameter.parameterName;
            precipitation[2].innerHTML = element.weatherElement[0].time[2].parameter.parameterName;
            determineWeatherImage(precipitation[0], weatherImage[0]);
            determineWeatherImage(precipitation[1], weatherImage[1]);
            determineWeatherImage(precipitation[2], weatherImage[2]);
            precipitationFont[0].innerHTML = `${element.weatherElement[1].time[0].parameter.parameterName}%`;
            precipitationFont[1].innerHTML = `${element.weatherElement[1].time[1].parameter.parameterName}%`;
            precipitationFont[2].innerHTML = `${element.weatherElement[1].time[2].parameter.parameterName}%`;
            temperature[0].innerHTML = `${element.weatherElement[2].time[0].parameter.parameterName}° ~ \
                ${element.weatherElement[4].time[0].parameter.parameterName}°`;
            temperature[1].innerHTML = `${element.weatherElement[2].time[1].parameter.parameterName}° ~ \
                ${element.weatherElement[4].time[1].parameter.parameterName}°`;
            temperature[2].innerHTML = `${element.weatherElement[2].time[2].parameter.parameterName}° ~ \
                ${element.weatherElement[4].time[2].parameter.parameterName}°`;



        }
    });
}

regionForecast.onclick = () => {
  const location = document.querySelector(".location").textContent;
  window.location =
    window.location.href + `regionForecast.html?locationName=${location}`;
};

function determineWeatherImage(object, image) {
    if (object.innerHTML === "晴天") {
        image.src = "images/sunny.png";
    } else if (object.innerHTML.includes("多雲")) {
        image.src = "images/cloudy.png";
    } else if (object.innerHTML.includes("雨")) {
        image.src = "images/rainy.png";
    } else if (object.innerHTML.includes("雷")) {
        image.src = "images/thunderstorm.png";
    } else {
        image.src = "images/cloudy.png";
    }
}

//初始值是台北市的資料
function initWeatherStatus() {
    precipitation[0].innerHTML = locationArr[5].weatherElement[0].time[0].parameter.parameterName;
    precipitation[1].innerHTML = locationArr[5].weatherElement[0].time[1].parameter.parameterName;
    precipitation[2].innerHTML = locationArr[5].weatherElement[0].time[2].parameter.parameterName;
    determineWeatherImage(precipitation[0], weatherImage[0]);
    determineWeatherImage(precipitation[1], weatherImage[1]);
    determineWeatherImage(precipitation[2], weatherImage[2]);
    precipitationFont[0].innerHTML = `${locationArr[5].weatherElement[1].time[0].parameter.parameterName}%`;
    precipitationFont[1].innerHTML = `${locationArr[5].weatherElement[1].time[1].parameter.parameterName}%`;
    precipitationFont[2].innerHTML = `${locationArr[5].weatherElement[1].time[2].parameter.parameterName}%`;
    temperature[0].innerHTML = `${locationArr[5].weatherElement[2].time[0].parameter.parameterName}° ~ \
            ${locationArr[5].weatherElement[4].time[0].parameter.parameterName}°`;
    temperature[1].innerHTML = `${locationArr[5].weatherElement[2].time[1].parameter.parameterName}° ~ \
            ${locationArr[5].weatherElement[4].time[1].parameter.parameterName}°`;
    temperature[2].innerHTML = `${locationArr[5].weatherElement[2].time[2].parameter.parameterName}° ~ \
            ${locationArr[5].weatherElement[4].time[2].parameter.parameterName}°`;
}