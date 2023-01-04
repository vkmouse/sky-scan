
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
            callback(result.records.Earthquake[0].EarthquakeInfo)
        }
    }catch(err){
        console.log(err)
    }
}

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
            getEarthquake((EarthquakeInfo)=>{
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