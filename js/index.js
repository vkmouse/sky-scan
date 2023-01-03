import TaiwanMap from "./taiwan_map.js"
import { setup as setupColorizer } from "./colorizer.js"

const root = document.getElementsByClassName("root")[0]
const twMap = new TaiwanMap(root);
setupColorizer(twMap);