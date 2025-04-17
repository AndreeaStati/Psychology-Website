import socket
import os
import mimetypes
import json
import threading
import gzip
import io

def handle_client(clientsocket):
    try:
        cerere = ''
        while True:
            data = clientsocket.recv(1024)
            if not data:
                break
            cerere += data.decode()
            if '\r\n\r\n' in cerere:
                break
        
        print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')

        # detectarea suportului pt gzip
        accept_encoding = ""
        for linie in cerere.split('\r\n'):
            if linie.lower().startswith("accept-encoding:"):
                accept_encoding = linie.lower()
                break
        suporta_gzip = "gzip" in accept_encoding

        linieDeStart = cerere.split('\r\n')[0]
        prima_linie = linieDeStart.split()
        
        if not prima_linie:
            print("Cerere incompleta sau goala.")
            return  
        metoda = prima_linie[0]

        # determinarea resursei
        if len(prima_linie) > 1:
            resursa = prima_linie[1]
        else:
            resursa = "/"

        if '?' in resursa:
            resursa = resursa.split('?')[0]
        
        director_curent = os.path.dirname(os.path.abspath(__file__))
        director_parinte = os.path.dirname(director_curent)

        print("Resursa cerută:", resursa)

        # GET /resurse/utilizatori.json
        if resursa == "/resurse/utilizatori.json":
            fisier_utilizatori = os.path.join(director_parinte, "continut", "resurse", "utilizatori.json")
            if os.path.isfile(fisier_utilizatori):
                with open(fisier_utilizatori, "rb") as fisier:
                    continut = fisier.read()

                #compresie gzip
                if suporta_gzip:
                    buf = io.BytesIO()
                    with gzip.GzipFile(fileobj=buf, mode='wb') as f:
                        f.write(continut)
                    continut = buf.getvalue()
                    content_encoding = "Content-Encoding: gzip\r\n"
                else:
                    content_encoding = ""

                raspuns = "HTTP/1.1 200 OK\r\n"
                raspuns += "Content-Type: application/json\r\n"
                raspuns += content_encoding
                raspuns += "Content-Length: " + str(len(continut)) + "\r\n"
                raspuns += "\r\n"
                clientsocket.send(raspuns.encode() + continut)
            else:
                mesaj_eroare = "<h1>404 Not Found</h1>".encode()
                raspuns = "HTTP/1.1 404 Not Found\r\n"
                raspuns += "Content-Type: text/html\r\n"
                raspuns += "Content-Length: " + str(len(mesaj_eroare)) + "\r\n"
                raspuns += "\r\n"
                clientsocket.send(raspuns.encode() + mesaj_eroare)
            return
        
        #POST /api/utilizatori
        if resursa == "/api/utilizatori" and metoda == "POST":
            continut_cerere = cerere.split("\r\n\r\n", 1)[1]
            try:
                utilizator = json.loads(continut_cerere)
                print("Datele utilizatorului:", utilizator)

                fisier_utilizatori = os.path.join(director_parinte, "continut", "resurse", "utilizatori.json")
                if os.path.isfile(fisier_utilizatori):
                    with open(fisier_utilizatori, "r") as fisier:
                        utilizatori_existenti = json.load(fisier)
                else:
                    utilizatori_existenti = []

                utilizatori_existenti.append(utilizator)

                with open(fisier_utilizatori, "w") as fisier:
                    json.dump(utilizatori_existenti, fisier, indent=4)

                raspuns = "HTTP/1.1 200 OK\r\n"
                raspuns += "Content-Type: application/json\r\n"
                raspuns += "Content-Length: 0\r\n"
                raspuns += "\r\n"
                clientsocket.send(raspuns.encode())

            except json.JSONDecodeError:
                mesaj_eroare = "<h1>400 Bad Request - JSON invalid</h1>".encode()
                raspuns = "HTTP/1.1 400 Bad Request\r\n"
                raspuns += "Content-Type: text/html\r\n"
                raspuns += "Content-Length: " + str(len(mesaj_eroare)) + "\r\n"
                raspuns += "\r\n"
                clientsocket.send(raspuns.encode() + mesaj_eroare)

            return

        if resursa == "/":
            resursa = "/index.html"

        # servire fisiere din continut/
        cale_fisier = os.path.join(director_parinte, "continut", resursa[1:])
        print("cale: " + cale_fisier)

        #verificam daca fisierul exista
        if os.path.isfile(cale_fisier):
            with open(cale_fisier, "rb") as fisier:
                continut = fisier.read()

            #determinam content-type
            extensie = os.path.splitext(cale_fisier)[1].lower()
            # suport pt json si xml
            if extensie == ".json":
                tip_mime = "application/json"
            elif extensie == ".xml":
                tip_mime = "application/xml"
            else:
                tip_mime, _ = mimetypes.guess_type(cale_fisier)
            if tip_mime is None:
                tip_mime = "application/octet-stream"

            if suporta_gzip:
                buf = io.BytesIO()
                with gzip.GzipFile(fileobj=buf, mode='wb') as f:
                    f.write(continut)
                continut = buf.getvalue()
                content_encoding = "Content-Encoding: gzip\r\n"
            else:
                content_encoding = ""

            #construirea raspunsului http
            raspuns = "HTTP/1.1 200 OK\r\n"
            raspuns += f"Content-Type: {tip_mime}\r\n"
            raspuns += content_encoding
            raspuns += "Content-Length: " + str(len(continut)) + "\r\n"
            raspuns += "\r\n"
            clientsocket.send(raspuns.encode() + continut)
        else:
            #in caz de fisier inexistent
            mesaj_eroare = "<h1>404 Not Found</h1>".encode()
            raspuns = "HTTP/1.1 404 Not Found\r\n"
            raspuns += "Content-Type: text/html\r\n"
            raspuns += "Content-Length: " + str(len(mesaj_eroare)) + "\r\n"
            raspuns += "\r\n"
            clientsocket.send(raspuns.encode() + mesaj_eroare)
    finally:
        clientsocket.close()
        print('S-a terminat comunicarea cu clientul.')

# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(('', 5678))
serversocket.listen(5)

while True:
    print('#########################################################################')
    print('Serverul asculta potentiali clienti.')

    (clientsocket, address) = serversocket.accept()
    print('S-a conectat un client.')

    #threading pt conexiuni multiple 
    client_thread = threading.Thread(target=handle_client, args=(clientsocket,))
    client_thread.start()
