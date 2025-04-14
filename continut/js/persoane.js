console.log("persoane.js a fost încărcat");

function incarcaPersoane() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myFunction(this);
    }
  };
  xhttp.open("GET", "resurse/persoane.xml", true);
  xhttp.send();
}

function myFunction(xml) {
  let i;
  let xmlDoc = xml.responseXML;
  let table = "<tr><th>Nume</th><th>Prenume</th><th>Vârstă</th><th>Adresă</th><th>Studii</th><th>Telefon</th></tr>";

  let persoane = xmlDoc.getElementsByTagName("persoana");

  for (i = 0; i < persoane.length; i++) {
    let nume = persoane[i].getElementsByTagName("nume")[0].textContent;
    let prenume = persoane[i].getElementsByTagName("prenume")[0].textContent;
    let varsta = persoane[i].getElementsByTagName("varsta")[0].textContent;
    let telefon = persoane[i].getElementsByTagName("telefon")[0].textContent;

    // Elemente adresă
    let adresa = persoane[i].getElementsByTagName("adresa")[0];
    let strada = adresa.getElementsByTagName("strada")[0].textContent;
    let numar = adresa.getElementsByTagName("numar")[0].textContent;
    let localitate = adresa.getElementsByTagName("localitate")[0].textContent;
    let judet = adresa.getElementsByTagName("judet")[0].textContent;
    let tara = adresa.getElementsByTagName("tara")[0].textContent;

    let adresaCompleta = `${strada} ${numar}, ${localitate}, ${judet}, ${tara}`;

    // Elemente studii
    let studii = persoane[i].getElementsByTagName("studii")[0];
    let universitate = studii.getElementsByTagName("universitate")[0].textContent;
    let facultate = studii.getElementsByTagName("facultate")[0].textContent;
    let oras = studii.getElementsByTagName("oras")[0].textContent;
    let studiiComplete = `${universitate}, ${facultate}, ${oras}`;

    table += `<tr><td>${nume}</td><td>${prenume}</td><td>${varsta}</td><td>${adresaCompleta}</td><td>${studiiComplete}</td><td>${telefon}</td></tr>`;
  
  }

  console.log(persoane); // Verifică ce date sunt preluate
  document.getElementById("section9aParagraf").innerHTML = "";
  document.getElementById("section9bTabelPersoane").innerHTML = table;
}
