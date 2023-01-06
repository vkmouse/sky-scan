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
const airStatusImage = document.querySelector(".face-status");
const placeholderImage = document.querySelector(".placeholder-image");
const weekWeather = document.querySelector('.week-weather-btn');

let locationArr = null;
let prevClickedLocation, newOption, aqiRecords, aqiNumber, initLocation, index;
let aqiObject = {};
setupColorizer(twMap);
let isloading = false;
let locationLoading = false;

fetch(url)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        locationArr = data.records.location;
        initWeatherStatus();
        prevClickedLocation = "臺北市";
        twMap.changeColor(prevClickedLocation, "#197ac9");

    })


//空氣品質檢測api//
fetch(`https://data.epa.gov.tw/api/v2/aqx_p_432?api_key=${config.Aqi_Api_Key}&limit=1000&sort=ImportDate%20desc&format=JSON`)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        aqiRecords = data.records;
        console.log(aqiRecords)
        //初始值為臺北市
        aqiRecords.forEach(element => {
            if ("臺北市" === element.county) {
                newOption = document.createElement("option");
                newOption.value = element.sitename;
                newOption.innerHTML = element.sitename;
                newOption.className = "location-option";
                locationSelection.appendChild(newOption);
                aqiObject[element.sitename] = element.aqi;
            }
        })
        index = locationSelection.selectedIndex;
        aqiNumber = Number(aqiObject[locationSelection.options[index].value]);
        airQualityMonitoring(aqiNumber);



    })



//座標位置
const placeholderImgPosition = {
    "基隆市": ["435px", "55px"],
    "臺北市": ["405px", "60px"],
    "新北市": ["405px", "110px"],
    "桃園市": ["330px", "80px"],
    "新竹縣": ["340px", "150px"],
    "新竹市": ["300px", "120px"],
    "苗栗縣": ["280px", "180px"],
    "臺中市": ["250px", "230px"],
    "彰化縣": ["220px", "290px"],
    "南投縣": ["300px", "300px"],
    "雲林縣": ["190px", "340px"],
    "嘉義縣": ["170px", "390px"],
    "嘉義市": ["210px", "380px"],
    "臺南市": ["190px", "440px"],
    "高雄市": ["190px", "530px"],
    "屏東縣": ["250px", "590px"],
    "臺東縣": ["320px", "500px"],
    "花蓮縣": ["380px", "300px"],
    "宜蘭縣": ["430px", "170px"],
    "澎湖縣": ["30px", "350px"],
    "金門縣": ["30px", "220px"],
    "連江縣": ["50px", "80px"]
}

twMap.onclick = (twMap, location) => {
    locationName.innerHTML = location;
    twMap.resetColor(location)
    twMap.selectLocation(location)
    prevClickedLocation = location;
    placeholderImage.style.left = placeholderImgPosition[location][0];
    placeholderImage.style.top = placeholderImgPosition[location][1];


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

    if (locationLoading === false) {
        locationLoading = true;
        aqiRecords.forEach(element => {
            if (location === element.county) {
                newOption = document.createElement("option");
                newOption.value = element.sitename;
                newOption.innerHTML = element.sitename;
                newOption.className = "location-option";
                locationSelection.appendChild(newOption);
                aqiObject[element.sitename] = element.aqi;
            }
        })
        locationLoading = false;
    }

    index = locationSelection.selectedIndex;
    if (isloading === false) {

        aqiNumber = Number(aqiObject[locationSelection.options[index].value]);
        airQualityMonitoring(aqiNumber);
    }

}

regionForecast.onclick = () => {
    const location = document.querySelector(".location").textContent;
    window.location = `${window.location.href}/regionForecast.html?locationName=${location}`;
};

locationSelection.addEventListener("change", (e) => {
    if (isloading === false) {
        aqiNumber = Number(aqiObject[e.target.value]);
        airQualityMonitoring(aqiNumber);
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



//空氣檢測進度條
function airQualityMonitoring(aqiNumber) {
    isloading = true;
    progressBar.style.backgroundColor = "rgb(60, 255, 1)";
    let width = 0;
    let timer = setInterval(() => {
        if (width >= aqiNumber + 1) {
            clearInterval(timer);
            isloading = false;
            return;
        }
        airStatusImage.src = "images/laughing.png";
        if (width > 50) {
            progressBar.style.backgroundColor = "yellow";
            airStatusImage.src = "images/happy.png";
        }
        if (width > 100) {
            progressBar.style.backgroundColor = "orange";
            airStatusImage.src = "images/soso.png";
        }
        if (width > 150) {
            progressBar.style.backgroundColor = "red";
            airStatusImage.src = "images/notGood.png";
        }
        progressBar.style.width = `${width}px`;
        progressBarNum.innerHTML = width;
        width++;
    }, 10)
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
    placeholderImage.style.left = placeholderImgPosition["臺北市"][0];
    placeholderImage.style.top = placeholderImgPosition["臺北市"][1];


}