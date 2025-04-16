/* ----------------------------------------------------------------------------- lab5 */
function actualizareSectiuni(){
    displayTimeLocation(); //  S1
    setupCanvasDrawing(); // S2
}
function displayTimeLocation() {
    let today = new Date().toLocaleDateString();
    let timeNow = new Date().toLocaleTimeString();

    let url = window.location.href;
    let browserName = navigator.appName;
    let browserVersion = navigator.appVersion;
    let userAgent = navigator.userAgent;

    let operatingSystem = "Necunoscut";
    if (userAgent.indexOf("Win") !== -1) 
        operatingSystem = "Windows";
    else if (userAgent.indexOf("Mac") !== -1) 
        operatingSystem = "MacOS";
    else if (userAgent.indexOf("Linux") !== -1) 
        operatingSystem = "Linux";
    else if (userAgent.indexOf("Android") !== -1) 
        operatingSystem = "Android";
    else if (userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1)
        operatingSystem = "iOS";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                let latitude = position.coords.latitude.toFixed(4);
                let longitude = position.coords.longitude.toFixed(4);
                updateInfo(today, timeNow, url, browserName, browserVersion, operatingSystem, latitude, longitude);
            },
            function(error) {
                updateInfo(today, timeNow, url, browserName, browserVersion, operatingSystem, "Locație indisponibilă", "Locație indisponibilă");
            }
        );
    } else {
        updateInfo(today, timeNow, url, browserName, browserVersion, operatingSystem, "Locație neacceptată", "Locație neacceptată");
    }

    setInterval(updateTime, 1000);
}

function updateInfo(date, time, url, browserName, browserVersion, os, lat, long) {
    let dateTimeEl = document.getElementById('dateTime');
    let urlEl = document.getElementById('urlAddress');
    let browserEl = document.getElementById('browserNameVersion');
    let osEl = document.getElementById('operatingSystem');

    if (dateTimeEl) {
        dateTimeEl.innerHTML = `Data curentă: ${date} <br> Timpul curent: <span id="liveTime">${time}</span>`;
    }
    if (urlEl) {
        urlEl.innerHTML = `Adresa URL: ${url}`;
    }
    if (browserEl) {
        browserEl.innerHTML = `Browser: ${browserName} <br> Versiune: ${browserVersion}`;
    }
    if (osEl) {
        osEl.innerHTML = `Sistem de operare: ${os} <br> Locație: Latitudine ${lat}, Longitudine ${long}`;
    }
}

function updateTime() {
    let timeNow = new Date().toLocaleTimeString();
    let liveTimeSpan = document.getElementById('liveTime');
    if (liveTimeSpan) {
        liveTimeSpan.innerText = timeNow;
    }
}


function setupCanvasDrawing() {
    const canvas = document.getElementById("section8aDrawCanvas");
    if (!canvas) {
        console.warn("Canvas nu exista pe aceasta pagina.");
        return;
    }
    const ctx = canvas.getContext("2d");
    const strokeColorPicker = document.getElementById("strokeColor");
    const fillColorPicker = document.getElementById("fillColor");
    
    let clickCount = 0;
    let startX, startY;

    // Eveniment pt desenarea dreptunghiului pe canvas
    canvas.addEventListener("click", function(event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        if (clickCount === 0) {
            startX = x;
            startY = y;
            clickCount = 1;
        } else {
            let endX = x;
            let endY = y;

            let width = endX - startX;
            let height = endY - startY;

            // Setam culorile si desenam
            ctx.fillStyle = fillColorPicker.value;
            ctx.strokeStyle = strokeColorPicker.value;
            ctx.lineWidth = 2;
            
            ctx.fillRect(startX, startY, width, height); // Umplere
            ctx.strokeRect(startX, startY, width, height); // Contur
            
            clickCount = 0; // Resetam pt urmatorul desen
        }
    });
}


function insertRow() {
    const table = document.getElementById("section10table");
    const position = parseInt(document.getElementById("positionInput").value);
    const color = document.getElementById("colorInput").value;

    if (isNaN(position) || position < 0 || position > table.rows.length) {
        alert("Pozitie invalida pentru inserarea randului.");
        return;
    }

    const colCount = table.rows[0].cells.length;
    const newRow = table.insertRow(position);

    for (let i = 0; i < colCount; i++) {
        const newCell = newRow.insertCell(i);
        newCell.style.backgroundColor = color;
        newCell.innerHTML = "&nbsp;";
    }
}

function insertColumn() {
    const table = document.getElementById("section10table");
    const position = parseInt(document.getElementById("positionInput").value);
    const color = document.getElementById("colorInput").value;

    if (isNaN(position) || position < 0 || position > table.rows[0].cells.length) {
        alert("Pozitie invalida pentru inserarea coloanei.");
        return;
    }

    for (let i = 0; i < table.rows.length; i++) {
        const newCell = table.rows[i].insertCell(position);
        newCell.style.backgroundColor = color;
        newCell.innerHTML = "&nbsp;";
    }
}

/* ----------------------------------------------------------------------------------------- */
function schimbaContinut(resursa, jsFisier, jsFunctie) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("mainContinut").innerHTML = this.responseText; 
            if (jsFisier) {
                let elementScript = document.createElement('script');
                elementScript.onload = function() {
                    console.log("Script incarcat cu succes");
                    if (jsFunctie) {
                        window[jsFunctie]();
                    }
                };
                elementScript.src = jsFisier;
                document.head.appendChild(elementScript);
            } else {
                if (jsFunctie){
                    window[jsFunctie]();
                }
            }           
        }
    };
    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();
}


