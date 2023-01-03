/** (twMap: TaiwanMap) */
const setup = (twMap) => {
  const temperatureColorizer = new TemperatureMapColorizer(twMap)
  const temperatureElement = document.getElementById("temperature-colorizer")
  temperatureElement.addEventListener("click", temperatureColorizer.changeColor);

  const rhColorizer = new RelativeHumidityColorizer(twMap);
  const rhElement = document.getElementById("rh-colorizer")
  rhElement.addEventListener("click", rhColorizer.changeColor);
}

class TemperatureMapColorizer {

  /** (twMap: TaiwanMap) */
  constructor(twMap) {
    this.twMap = twMap
  }

  changeColor = () => {
    const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${config.API_KEY}&elementName=MinT,MaxT`
    fetch(url)
    .then(response => response.json())
    .then(body => {
      const locations = body.records.location.map(loc => {
        return {
          name: loc.locationName,
          min: loc.weatherElement[0].time[0].parameter.parameterName,
          max: loc.weatherElement[1].time[0].parameter.parameterName,
        }
      })
      const hoverColor = "#507DBC"
      for (const loc of locations) {
        const color = this.getColor((Number(loc.min) + Number(loc.max)) / 2)
        this.twMap.changeColor(loc.name, color, hoverColor)
      }
    })
  }

  getColor = (temperature) => {
    const temperatureMap = [
      "#137389", "#217D94", "#2E899C", "#3C93A7", "#4F9DB1",
      "#5CA9BD", "#68B4C4", "#77BFCD", "#87CBD8", "#95D4E3",
      "#A6E0EC", "#B4E9F7", "#0C924B", "#1C9A51", "#2FA257",
      "#41A95E", "#51B265", "#61BA6A", "#76C16F", "#85C974",
      "#96CF7E", "#A7D984", "#BBDF88", "#CCE68F", "#DBF093",
      "#F5F3C2", "#F6E78C", "#F2D675", "#F4C25F", "#EDB24C",
      "#E99E39", "#E68D29", "#DE7B04", "#EF5134", "#EF165B",
      "#AA0639", "#760306", "#9C68AA", "#854F9A", "#82249E"
    ];
    if (temperature < 0) {
      return temperatureMap[0]
    } else if (temperature >= temperatureMap.length) {
      return temperatureMap[temperatureMap.length - 1]
    } else {
      return temperatureMap[Math.ceil(temperature)]
    }
  }
}

class RelativeHumidityColorizer {

  /** (twMap: TaiwanMap) */
  constructor(twMap) {
    this.twMap = twMap
  }

  changeColor = () => {
    const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-089?Authorization=${config.API_KEY}&elementName=RH`
    fetch(url)
    .then(response => response.json())
    .then(body => {
      const locations = body.records.locations[0].location.map(loc => {
        return {
          name: loc.locationName,
          RH: loc.weatherElement.filter(m => m.elementName === "RH")[0].time[0].elementValue[0].value
        }
      })
      const hoverColor = "#507DBC"
      
      for (const loc of locations) {
        const color = this.getColor(loc.RH)
        this.twMap.changeColor(loc.name, color, hoverColor)
      }
    })
  }

  getColor = (value) => {
    const colorMap = [
      "#AE6E38", "#AE9238", "#69AE38", "#36AF94", "#38AEEA", 
      "#3886AE", "#3885AE", "#3871A6", "#384774"
    ]
    if (value < 0) {
      return colorMap[0]
    } else if (value >= 100) {
      return colorMap[colorMap.length - 1]
    } else {
      return colorMap[Math.ceil(value / 100 * (colorMap.length - 1))]
    }
  }
}

export { setup }