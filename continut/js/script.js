function calledOnLoad() {
    displayTimeLocation();
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
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                updateInfo(today, timeNow, url, browserName, browserVersion, operatingSystem, latitude.toFixed(4), longitude.toFixed(4));
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
    let section1 = document.getElementById('browserInfo');
    let infoParagraph = document.getElementById('info');
    if (!infoParagraph) {
        infoParagraph = document.createElement('p');
        infoParagraph.id = 'info';
        section1.appendChild(infoParagraph);
    }

    infoParagraph.innerHTML = `<br>Data curentă: ${date}<br>
                               Timpul curent: <span id="liveTime">${time}</span><br>
                               Adresa URL: ${url}<br>
                               Numele Browser-ului: ${browserName}<br>
                               Versiunea Browser-ului: ${browserVersion}<br>
                               Sistem de operare: ${os}<br>
                               Locație: Latitudine ${lat}, Longitudine ${long}`;
}

function updateTime() {
    let timeNow = new Date().toLocaleTimeString();
    let liveTimeSpan = document.getElementById('liveTime');
    if (liveTimeSpan) {
        liveTimeSpan.innerText = timeNow;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    displayTimeLocation(); //  S1
    setupCanvasDrawing(); //  S2
});

function setupCanvasDrawing() {
    const canvas = document.getElementById("section8aDrawCanvas");
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

function schimbaContinut(resursa, jsFisier, jsFunctie) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("mainContinut").innerHTML = this.responseText; 
            if (jsFisier) {
                let elementScript = document.createElement('script');
                elementScript.onload = function() {
                    console.log("hello");
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

