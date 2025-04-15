/* -------------------------------- lab 7 utilizator (tema 3)*/
function verificaUtilizator(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("pass").value;

    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "resurse/utilizatori" + ".json", true);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let utilizatori = JSON.parse(xhttp.responseText);
            let gasit = false;

            for (let i=0; i<utilizatori.length; i++){
                if (utilizatori[i].utilizator === username && utilizatori[i].parola === password){
                    gasit = true;
                    break;
                }
            }

            const paragraf = document.getElementById("rezultat");
            if(gasit){
                paragraf.innerHTML = "Utilizatorul și parola sunt corecte!";
                paragraf.style.color = "green";            
            }
            else {
                paragraf.innerHTML = "Utilizator sau parolă incorecte!";
                paragraf.style.color = "red";           
            }
        }
    };
    xhttp.send();
}
