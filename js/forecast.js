let CWB_API_KEY = config.Authorization_Key;
let locationName = '宜蘭縣';
let sort = 'time';
let url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${CWB_API_KEY}&locationName=${locationName}&sort=${sort}`;
const showDay = {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六'
}

function generateRowData(data) {

    let tr = document.createElement('tr');
    tr.setAttribute('class', 'content');

    for (let i = 0; i < data.length; i++) {
        let th = document.createElement('th');
        th.innerText = data[i];
        tr.appendChild(th);
    }
    return tr;
}

function showWeekForecast(locationName) {
    fetch(url)
    .then((response) => {
        return response.json();
    }).then((data) => {
        let parsedData = data['records']['locations'][0]['location'][0]['weatherElement'];
        
        let div = document.getElementsByClassName('weather-week-forecast')[0];
        div.innerHTML = '';
        div.style.visibility = "visible";
        
        let headerData = [];
        let uviData = ['紫外線'];

        let minTemp = [];
        let maxTemp = [];
        let morningData = ['白天'];
        let nightData = ['晚上']

        for (let i = 0; i < parsedData.length; i++) {
            if (parsedData[i]['elementName'] === 'UVI') {
                for (let j = 0; j < 7; j++) {

                    let date = parsedData[i]['time'][j]['startTime'].substring(5, 10).replace('-', '/');
                    let day = showDay[new Date(parsedData[i]['time'][j]['startTime']).getDay()];

                    let headerCell = { 'date': date, 'day': day };
                    headerData.push(headerCell);

                    uviData.push(parsedData[i]['time'][j]['elementValue'][1]['value']);
                }
            } else if (parsedData[i]['elementName'] === 'MinT') {
                let startIndex = 0;
                if (parsedData[i]['time'][0]['startTime'].split(' ')[1] === '18:00:00') {
                    startIndex = 1;
                }
                for (let j = startIndex; j < 14 + startIndex; j++) {
                    minTemp.push(parsedData[i]['time'][j]['elementValue'][0]['value']);
                }
            } else if (parsedData[i]['elementName'] === 'MaxT') {
                let startIndex = 0;
                if (parsedData[i]['time'][0]['startTime'].split(' ')[1] === '18:00:00') {
                    startIndex = 1;
                }
                for (let j = startIndex; j < 14 + startIndex; j++) {
                    maxTemp.push(parsedData[i]['time'][j]['elementValue'][0]['value']);
                }
            }
        }

        for (let i = 0; i < 14; i++) {
            if (i % 2 === 0) {
                //白天
                morningData.push(`${minTemp[i]}-${maxTemp[i]}°C`);
            } else {
                nightData.push(`${minTemp[i]}-${maxTemp[i]}°C`);
            }
        }

        // Add close btn
        let closeDiv = document.createElement('div');
        closeDiv.setAttribute('id', 'week-forecast-close');
        let span = document.createElement('span');
        span.innerText = 'X';

        span.addEventListener('click', function(event) {
            document.getElementsByClassName('weather-week-forecast')[0].style.visibility = "hidden";
            
        });

        closeDiv.appendChild(span);
        div.appendChild(closeDiv);

        let table = document.createElement('table');
        table.setAttribute("id", "week-forecast");

        // Add header
        let thead = document.createElement('thead');
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.innerText = locationName;
        tr.appendChild(th);
        for (let i = 0; i < headerData.length; i++) {
            let th = document.createElement('th');
            th.innerText = headerData[i]['date'];
            let p = document.createElement('p');
            p.innerText = headerData[i]['day'];
            th.appendChild(p);
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);

        // Add rows
        let morningRow = generateRowData(morningData);
        table.appendChild(morningRow);
        let nightRow = generateRowData(nightData);
        table.appendChild(nightRow);
        let uviRow = generateRowData(uviData);
        table.appendChild(uviRow)

        div.appendChild(table);
    }).catch(err => console.log(err))
}

export { showWeekForecast };

