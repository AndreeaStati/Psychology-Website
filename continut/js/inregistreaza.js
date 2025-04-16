function initFormInregistrare() {
    console.log("Formular incarcat!");

    // Asigură-te că formularul există înainte de a-l manipula
    const form = document.getElementById("formular");
    if (!form) {
        console.error("Formularul nu a fost găsit!");
        return; // Dacă formularul nu există, nu mai facem nimic
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const utilizator = document.getElementById("username").value;
        const parola = document.getElementById("pass").value; 
        const nume = document.getElementById("lastname").value;
        const prenume = document.getElementById("firstname").value;
        const email = document.getElementById("email").value;
        const telefon = document.getElementById("phone").value;

        const user = {
            utilizator,
            parola,
            nume,
            prenume,
            email,
            telefon
        };

        fetch("/api/utilizatori", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            if (!response.ok) throw new Error("Eroare la trimiterea formularului.");
            return response.text();
        })
        .then(data => {
            alert("Utilizator înregistrat cu succes!");
        })
        .catch(err => {
            console.error("Eroare:", err);
            alert("A apărut o problemă.");
        });
    });
}