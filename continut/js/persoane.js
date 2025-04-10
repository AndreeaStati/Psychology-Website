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
  let table = "<tr><th>Nume</th><th>Prenume</th></tr>"; // Titlurile pentru tabel

  let persoane = xmlDoc.getElementsByTagName("persoana");

  for (i = 0; i < persoane.length; i++) {
    // Adăugăm un rând pentru fiecare persoană
    table +=
      "<tr><td>" +
      persoane[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue +
      "</td><td>" +
      persoane[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue +
      "</td></tr>";
  }

  console.log(persoane); // Verifică ce date sunt preluate
  document.getElementById("paragraf").innerHTML = "";
  document.getElementById("tabelPersoane").innerHTML = table;
}
