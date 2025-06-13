# Psychology-Website

Acest proiect reprezintă realizarea unui website cu tematica **Psihologia**, dezvoltat în cadrul disciplinei **Programare Web** de la Universitatea Tehnică „Gheorghe Asachi” din Iași, Facultatea de Automatică și Calculatoare.

## 📚 Descriere

Website-ul prezintă informații esențiale despre psihologie, subiecte de interes din acest domeniu și include funcționalități interactive pentru utilizatori. Este realizat utilizând tehnologii front-end (HTML, CSS, JavaScript), dar și elemente de backend (server web simplu), respectând cerințele fiecărui laborator.

## 🧩 Structură proiect
```plaintext
.
├── css/
│ └── stil.css
├── imagini/
│ └── logo.png
├── js/
│ ├── script.js
│ └── persoane.js
├── server_web/
│ ├── server_web.py
│ └── lanseaza_server.bat / .sh
├── resurse/
│ ├── persoane.xml
│ ├── persoane.dtd / persoane.xsd
│ └── utilizatori.json
├── continut/
│ ├── index.html
│ ├── despre.html
│ ├── invat.html
│ ├── video.html
│ ├── desen.html
│ ├── inregistreaza.html
│ ├── persoane.html
│ └── verifică.html
└── README.md
```

## 🔧 Tehnologii utilizate

- HTML5, CSS3, JavaScript
- SVG pentru desenare grafică
- XML + DTD/XSD pentru descrierea datelor
- AJAX pentru comunicare asincronă
- Python (sau Java) pentru implementarea serverului web
- Git + GitHub pentru versionare

## 🔎 Cerințe implementate

### ✅ Laboratorul 01: Sisteme de versionare. XML
- Fișier `persoane.xml` cu informații despre mai multe persoane.
- DTD sau XSD valid pentru validarea structurii.
- Adăugare în Git și validare XML.

### ✅ Laboratorul 02-03: Paginile web HTML
- Pagini: `index.html`, `despre.html`, `inregistreaza.html`, `video.html`
- Conținut adaptat temei Psihologie: informații, profil utilizator, video educaționale.
- Navigare între pagini și structură semantică HTML5.

### ✅ Laboratorul 04: Stilizare cu CSS
- Fișier `stil.css` cu layout uniform.
- Flexbox, pseudo-clase, efecte CSS3.
- Responsivitate și media queries.

### ✅ Laboratorul 05: Interacțiune JavaScript
- Pagina `invat.html` cu:
  - Afișarea informațiilor despre utilizator (browser, dată, sistem etc.)
  - Desen interactiv pe canvas
  - Modificare tabel dinamică

### ✅ Laboratorul 06: Server Web
- Server Python / Java simplu
- Servire fișiere HTML, CSS, JS, imagini
- Header-e HTTP corecte: Content-Type, Content-Length, etc.

### ✅ Laboratorul 07: AJAX și SPA
- Pagina principală `index.html` ca Single Page Application
- Conținutul paginilor este încărcat dinamic cu AJAX.
- Fișiere JSON și XML folosite pentru datele afișate.

## 🧠 Tema aleasă: Psihologia

Am ales această temă deoarece psihologia este un domeniu fascinant și esențial în înțelegerea comportamentului uman. Site-ul prezintă concepte de bază, articole video, secțiuni educative și formular de înregistrare dedicat pasionaților de acest domeniu.

## 🖥️ Cum rulezi proiectul?

1. Clonează repository-ul:
   ```bash
   git clone https://github.com/AndreeaStati/Psychology-Website.git
  ```

2. Rulează serverul:
   ```bash
  cd server_web
  python server_web.py
  ```

3. Deschide în browser:
http://localhost:5678/


