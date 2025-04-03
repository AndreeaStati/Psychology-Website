import socket
import os
import mimetypes  # Adăugăm importul pentru detectarea tipului de fișier

# Creează un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(('', 5678))  # Rulează pe portul 5678
serversocket.listen(5)  # Serverul poate accepta conexiuni

while True: 
    print('#########################################################################')
    print('Serverul asculta potentiali clienti.')

    # Așteaptă conectarea unui client
    (clientsocket, address) = serversocket.accept()
    print('S-a conectat un client.')

    # Se procesează cererea și se citește prima linie de text
    cerere = ''
    
    while True:
        data = clientsocket.recv(1024)
        if not data:
            break
        cerere += data.decode()
        if '\r\n\r\n' in cerere:  # Verificăm dacă am primit toată cererea
            break
    
    print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')

    # Extragem numele resursei cerute
    linieDeStart = cerere.split('\r\n')[0]
    prima_linie = linieDeStart.split()

    if len(prima_linie) > 1:
        resursa = prima_linie[1]  # Resursa cerută, ex: "/index.html"
    else:
        resursa = "/"


      # Obținem directorul părinte al folderului unde rulează scriptul
    director_curent = os.path.dirname(os.path.abspath(__file__))
    director_parinte = os.path.dirname(director_curent)

    # Eliminăm caracterul "/" inițial
    if resursa == "/":
        resursa = "/index.html"  # Servim index.html dacă nu se specifică nimic

    # Construim calea completă către fișier în folderul "content" din directorul părinte
    cale_fisier = os.path.join(director_parinte, "continut", resursa[1:])  # Eliminăm primul caracter "/"

    print("cale: " + cale_fisier)

    # Verificăm dacă fișierul există
    if os.path.isfile(cale_fisier):
        with open(cale_fisier, "rb") as fisier:
            continut = fisier.read()

        # Construim răspunsul HTTP corect
        
        # Determinăm tipul MIME corect pentru fișier
        tip_mime, _ = mimetypes.guess_type(cale_fisier)
        if tip_mime is None:
            tip_mime = "application/octet-stream"  # Tip generic pentru fișiere necunoscute

        # Construim răspunsul HTTP corect
        raspuns = "HTTP/1.1 200 OK\r\n"
        raspuns += f"Content-Type: {tip_mime}\r\n"
        raspuns += "Content-Length: " + str(len(continut)) + "\r\n"
        raspuns += "\r\n"
        clientsocket.send(raspuns.encode() + continut)
    else:
        # Dacă fișierul nu există, trimitem 404 Not Found
        mesaj_eroare = "<h1>404 Not Found</h1>".encode()
        raspuns = "HTTP/1.1 404 Not Found\r\n"
        raspuns += "Content-Type: text/html\r\n"
        raspuns += "Content-Length: " + str(len(mesaj_eroare)) + "\r\n"
        raspuns += "\r\n"
        clientsocket.send(raspuns.encode() + mesaj_eroare)

    # Închidem conexiunea cu clientul
    clientsocket.close()
    print('S-a terminat comunicarea cu clientul.')