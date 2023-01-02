import TaiwanMap from "./taiwan_map.js";

const root = document.getElementsByClassName("root")[0]
new TaiwanMap(root, (region) => {
  alert(region);
});