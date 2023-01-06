
function addGoogleMapScript(apiKey){
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&v=weekly`;
    script.async = true;
    document.body.appendChild(script);
}
addGoogleMapScript("")

async function getEarthquake(callback){
    try{
        const response = await fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=${config.Authorization_Key}`);
        const result = await response.json();
        if(result.error){
            console.log(result)
            return
        }
        if(result.success){
            console.log(result.records.Earthquake[0])
            callback(result.records.Earthquake[0])
        }
    }catch(err){
        console.log(err)
    }
}
getEarthquake((data)=>{
    const dataList = data.Intensity.ShakingArea
    const cardList = document.querySelector(".cardList")
    const ReportContent = document.querySelector(".ReportContent")
    ReportContent.innerHTML = `
        <h1><span class='badge bg-danger'>各縣市速報</span></h1>
            <div class="alert alert-danger" role="alert" style="width: auto;">
            ${data.ReportContent}
              </div>
    `
    let firstChild = ""
    dataList.forEach((val) => {
        firstChild +=`
            <div class="row">
                <div class="card" style="width: 100%;margin:0px;">
                    <div class="card-body">
                        <h5 class="card-title">${val.AreaDesc}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${val.AreaIntensity}</h6>
                        <h4 class="card-subtitle mb-2 text-muted">${val.CountyName}</h6>
                        
                    </div>
                </div>
            </div>
        `
    });
    cardList.innerHTML = firstChild;
    
})

let map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 23.52, lng: 121.18 },
        zoom: 8,
    });
    infoWindow = new google.maps.InfoWindow();
    infoWindowEpicenter = new google.maps.InfoWindow();
    const locationButton = document.createElement("button");

    locationButton.textContent = "獲取震央位置";
    locationButton.classList.add("custom-map-control-button");
    locationButton.style.width = "200px"
    locationButton.style.height = "auto"
    locationButton.style.fontSize = "20px"

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("你的位置");
            infoWindow.open(map);
            getEarthquake((data)=>{
                var EarthquakeInfo = data.EarthquakeInfo
                const pos = {
                    lat: EarthquakeInfo.Epicenter.EpicenterLatitude,
                    lng: EarthquakeInfo.Epicenter.EpicenterLongitude,
                };
        
                infoWindowEpicenter.setPosition(pos);
                infoWindowEpicenter.setContent(EarthquakeInfo.Epicenter.Location);
                infoWindowEpicenter.open(map);
            })
            },
            () => {
            handleLocationError(true, infoWindow, map.getCenter());
            }
        );

        

        
        } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

window.initMap = initMap;