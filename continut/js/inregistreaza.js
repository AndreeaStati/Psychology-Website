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

        const prenume = document.getElementById("firstname").value;
        const nume = document.getElementById("lastname").value;
        const email = document.getElementById("email").value;

        const utilizator = {
            prenume,
            nume,
            email
        };

        fetch("/api/utilizatori", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(utilizator)
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