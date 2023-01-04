/** (twMap: TaiwanMap) */
const setup = (twMap) => {
  const defaultColorizer = new DefaultColorizer(twMap)
  const defaultElement = document.getElementById("default-colorizer")
  defaultElement.addEventListener("click", () => {
    defaultColorizer.changeColor()
    defaultColorizer.setTooltip()
  });

  const temperatureColorizer = new TemperatureMapColorizer(twMap)
  const temperatureElement = document.getElementById("temperature-colorizer")
  temperatureElement.addEventListener("click", () => {
    temperatureColorizer.changeColor()
    temperatureColorizer.setTooltip()
  });

  const rhColorizer = new RelativeHumidityColorizer(twMap);
  const rhElement = document.getElementById("rh-colorizer")
  rhElement.addEventListener("click", () => {
    rhColorizer.changeColor()
    rhColorizer.setTooltip()
  });
}


class DefaultColorizer {
  locations = [
    { name: "基隆市" },
    { name: "新北市" },
    { name: "臺北市" },
    { name: "桃園市" },
    { name: "新竹縣" },
    { name: "新竹市" },
    { name: "苗栗縣" },
    { name: "臺中市" },
    { name: "南投縣" },
    { name: "彰化縣" },
    { name: "雲林縣" },
    { name: "嘉義縣" },
    { name: "嘉義市" },
    { name: "臺南市" },
    { name: "高雄市" },
    { name: "屏東縣" },
    { name: "臺東縣" },
    { name: "花蓮縣" },
    { name: "宜蘭縣" },
    { name: "澎湖縣" },
    { name: "金門縣" },
    { name: "連江縣" },
  ]
  color = "#BBD1EA"
  hoverColor = "#507DBC"
  selectedColor = "#197AC9"

  /** (twMap: TaiwanMap) */
  constructor(twMap) {
    this.twMap = twMap
  }

  changeColor = () => {
    for (const loc of this.locations) {
      this.twMap.changeColor(loc.name, this.color, this.hoverColor)
      this.twMap.setPalette(loc.name, this.color, this.hoverColor, this.selectedColor)
    }
  }

  setTooltip = () => {
    this.twMap.onmouseenter = (_, location) => {
      const loc = this.locations.filter(m => m.name === location)[0]
      if (loc) {
        this.twMap.setTooltip(`${loc.name}`);
      }
    }
    this.twMap.onmouseleave = () => {
      this.twMap.resetTooltip();
    }
  }
}


class TemperatureMapColorizer {
  locations = []
  hoverColor = "#D8FFDB"
  selectedColor = "#E5F9E6"

  /** (twMap: TaiwanMap) */
  constructor(twMap) {
    this.twMap = twMap
  }

  changeColor = async () => {
    await this.fetchData()
    for (const loc of this.locations) {
      const avg = (Number(loc.min) + Number(loc.max)) / 2
      const color = this.getColor(avg)
      this.twMap.changeColor(loc.name, color, this.hoverColor)
      this.twMap.setPalette(loc.name, color, this.hoverColor, this.selectedColor)
    }
  }

  setTooltip = () => {
    this.twMap.onmouseenter = (_, location) => {
      const loc = this.locations.filter(m => m.name === location)[0]
      if (loc) {
        const avg = (Number(loc.min) + Number(loc.max)) / 2
        this.twMap.setTooltip(`${loc.name} 溫度 ${avg} 度`);
      }
    }
    this.twMap.onmouseleave = () => {
      this.twMap.resetTooltip();
    }
  }

  fetchData = async () => {
    const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${config.Authorization_Key}&elementName=MinT,MaxT`
    const response = await fetch(url)
    const body = await response.json()
    this.locations = body.records.location.map(loc => {
      return {
        name: loc.locationName,
        min: loc.weatherElement[0].time[0].parameter.parameterName,
        max: loc.weatherElement[1].time[0].parameter.parameterName,
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
  locations = []
  hoverColor = "#91BBF2"
  selectedColor = "#B2D3FF"

  /** (twMap: TaiwanMap) */
  constructor(twMap) {
    this.twMap = twMap
  }

  changeColor = async () => {
    await this.fetchData();
    for (const loc of this.locations) {
      const color = this.getColor(loc.RH)
      this.twMap.changeColor(loc.name, color, this.hoverColor)
      this.twMap.setPalette(loc.name, color, this.hoverColor, this.selectedColor)
    }
  }

  setTooltip = () => {
    this.twMap.onmouseenter = (_, location) => {
      const loc = this.locations.filter(m => m.name === location)[0]
      if (loc) {
        this.twMap.setTooltip(`${loc.name} 相對溼度 ${loc.RH}%`);
      }
    }
    this.twMap.onmouseleave = () => {
      this.twMap.resetTooltip();
    }
  }

  fetchData = async () => {
    const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-089?Authorization=${config.Authorization_Key}&elementName=RH`
    const response = await fetch(url)
    const body = await response.json()
    this.locations = body.records.locations[0].location.map(loc => {
      return {
        name: loc.locationName,
        RH: loc.weatherElement.filter(m => m.elementName === "RH")[0].time[0].elementValue[0].value
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