let worker;

function initCumparaturi() {
    const btn = document.getElementById("addProduct");

    if(!worker){
        worker = new Worker("js/worker.js");

        worker.onmessage = function(e) {
            const produs = e.data;
            adaugaInTabel(produs);
        };
    }

    if (btn) {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); // prevenim reload-ul
            adaugareProdus();
        });
    }
    afiseazaProduseDinLocalStorage();
}


function adaugareProdus(){
    let numeProdus = document.getElementById("productName").value;
    let cantitateProdus = document.getElementById("productAmount").value;

    const id = genereazaId();
    const produsNou = new Produs(id, numeProdus, cantitateProdus);

    const lista = JSON.parse(localStorage.getItem("listaCumparaturi")) || [];
    lista.push(produsNou);

    new Promise((resolve) => {
        setTimeout(()=> resolve(lista), 300);
    }).then((listaActualizata) => {
        localStorage.setItem("listaCumparaturi", JSON.stringify(listaActualizata));
        //alert("Produs adaugat cu succes");
        document.getElementById("formCumparaturi").reset(); 

        if(worker){
            worker.postMessage(produsNou);
        }
    })
}

class Produs{
    constructor(id, nume, cantitate){
        this.id = id;
        this.numeProdus = nume;
        this.cantitateProdus = cantitate;
    }
}

// functie pt a genera urmatorul ID
const genereazaId = () => {
    let listaJson = localStorage.getItem("listaCumparaturi");

    // Dacă localStorage e gol sau corupt, returnăm lista goală
    let lista;
    try {
        if (listaJson){
            lista = JSON.parse(listaJson);
        }
        else {
            lista = [];
        }
    } catch (e) {
        console.warn("Eroare la parsarea listei de cumpărături. Resetăm...");
        lista = [];
    }

    return lista.length + 1;
};

function adaugaInTabel(produs){
    const tableBody = document.getElementById("tableBodyCumparaturi");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${produs.id}</td>
        <td>${produs.numeProdus}</td>
        <td>${produs.cantitateProdus}</td>
    `;
    tableBody.appendChild(row);
}

function afiseazaProduseDinLocalStorage(){
    const lista = JSON.parse(localStorage.getItem("listaCumparaturi")) || [];
    lista.forEach(prod => adaugaInTabel(prod));
}