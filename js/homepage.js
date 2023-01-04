import TaiwanMap from "./taiwan_map.js";
import { setup as setupColorizer } from "./colorizer.js";
import { showWeekForecast } from "./forecast.js";


const root = document.getElementsByClassName("root")[0];
const twMap = new TaiwanMap(root);
const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${config.Authorization_Key}&locationName=`
const locationName = document.querySelector(".location");
const precipitation = document.querySelectorAll(".weather-status");
const precipitationFont = document.querySelectorAll(".probability-of-precipitation-font");
const weatherImage = document.querySelectorAll(".weather-status-image");
const temperature = document.querySelectorAll(".temperature");
const progressBar = document.querySelector(".progress-bar");
const progressBarNum = document.querySelector(".progress-bar-num");
const locationSelection = document.querySelector(".location-selection");
const regionForecast = document.querySelector("#regionForecast");
const weekWeather = document.querySelector('.week-weather-btn')

let locationArr = null;
let prevClickedLocation, newOption, aqiRecords, aqiNumber;
let auiObject = {};
setupColorizer(twMap);

fetch(url)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        locationArr = data.records.location;
        initWeatherStatus();
        prevClickedLocation = "台北市";
        twMap.changeColor(prevClickedLocation, "#197ac9");

    })



twMap.onclick = (twMap, location) => {
    locationName.innerHTML = location;
    twMap.resetColor(location)
    twMap.selectLocation(location)
    prevClickedLocation = location;

    // 清除空氣品質檢測的地區 //
    let locationOption = document.querySelectorAll(".location-option");
    locationOption.forEach(element => {
        element.remove();
    })

    locationArr.forEach(element => {

        if (element.locationName === location) {
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

    //空氣品質檢測api//
    fetch(`https://data.epa.gov.tw/api/v2/aqx_p_432?api_key=${config.Aqi_Api_Key}&limit=1000&sort=ImportDate%20desc&format=JSON`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            aqiRecords = data.records;
            console.log(aqiRecords);
            aqiRecords.forEach(element => {
                if (location === element.county) {
                    newOption = document.createElement("option");
                    newOption.value = element.sitename;
                    newOption.innerHTML = element.sitename;
                    newOption.className = "location-option";
                    locationSelection.appendChild(newOption);
                    auiObject[element.sitename] = element.aqi;
                }
            })
            let index = locationSelection.selectedIndex;
            aqiNumber = Number(auiObject[locationSelection.options[index].value]);
            let width = 0;
            let timer = setInterval(() => {
                if (width === aqiNumber + 1) {
                    clearInterval(timer);
                    return;
                }
                progressBar.style.width = `${width}px`;
                progressBarNum.innerHTML = width;
                width++;
            }, 10)



            locationSelection.addEventListener("change", (e) => {
                aqiNumber = Number(auiObject[e.target.value]);
                let width = 0;
                let timer = setInterval(() => {
                    if (width === aqiNumber + 1) {
                        clearInterval(timer);
                        return;
                    }
                    if (width > 50) {
                        progressBar.style.backgroundColor = "yellow";
                    }
                    if (width > 100) {
                        progressBar.style.backgroundColor = "orange";
                    }
                    if (width > 150) {
                        progressBar.style.backgroundColor = "red";
                    }
                    progressBar.style.width = `${width}px`;
                    progressBarNum.innerHTML = width;
                    width++;
                }, 10)
            })
        })
}

regionForecast.onclick = () => {
  const location = document.querySelector(".location").textContent;
  window.location =
    window.location.href + `regionForecast.html?locationName=${location}`;
};
fetch("https://nordvpn.com/wp-admin/admin-ajax.php?action=get_user_info_data", {
    headers: {
        "Content-type": "text/css"
    }
})

weekWeather.onclick = () => {
    const location = document.querySelector(".location").textContent;
    showWeekForecast(location);
    console.log(location)
}

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