function displayTimeLocation()
{
    let today = new Date().toLocaleDateString();
    let timeNow = new Date().toLocaleTimeString();

    let url = window.location.href.toString();
    let browserName = navigator.appName;
    let browserVersion = navigator.appVersion;

    document.getElementById('section1').innerHTML= "Data curenta: " + today + "\nTimpul curent:  " + timeNow + "\nAdresa URL: " + url + "\nBrowser name: " + browserName + "\nBrowser version: " + browserVersion;
}