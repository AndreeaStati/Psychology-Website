import socket
import os
import mimetypes 
import gzip
import io
import threading
import json
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

        linieDeStart = cerere.split('\r\n')[0]
        prima_linie = linieDeStart.split()

        if len(prima_linie) > 1:
            resursa = prima_linie[1] 
        else:
            resursa = "/"

        if '?' in resursa:
            resursa = resursa.split('?')[0]  # Elimină parametrii GET
        print('************'+'nou  '+linieDeStart)
        

        director_curent = os.path.dirname(os.path.abspath(__file__))
        director_parinte = os.path.dirname(director_curent)

        print("Resursa cerută:", resursa)
        cale_fisier=''
        if resursa == "/":
             resursa = "/index.html"  # Servim index.html dacă nu se specifică nimic

       
        print("Resursa cerută:", resursa)
        cale_fisier = os.path.join(director_parinte, "continut", resursa[1:])
        print("director parinte: " + director_parinte)
        print("resursa: " + resursa)
        print("cale: " + cale_fisier)

        if os.path.isfile(cale_fisier):
            with open(cale_fisier, "rb") as fisier:
                continut = fisier.read()

                # Construim răspunsul HTTP corect
                
                # Determinăm tipul MIME corect pentru fișier
        #      tip_mime, _ = mimetypes.guess_type(cale_fisier)
        #       if tip_mime is None:
        #            tip_mime = "application/octet-stream"  # Tip generic pentru fișiere necunoscute
            
            extensie = os.path.splitext(cale_fisier)[1].lower()

                # Tratăm manual JSON și XML
            if extensie == ".json":
                    tip_mime = "application/json"
            elif extensie == ".xml":
                    tip_mime = "application/xml"
                    #cale_fisier = "C:\Users\Andreea\Desktop\Anul 3\sem 2\PW\proiect-1-AndreeaStati\continut\resurse\persoane.xml"
                    
            else:
                    tip_mime, _ = mimetypes.guess_type(cale_fisier)
            if tip_mime is None:
                    tip_mime = "application/octet-stream"

            if "gzip" in cerere.lower():
                        # Comprimăm răspunsul cu gzip
                    buf = io.BytesIO()
                    with gzip.GzipFile(fileobj=buf, mode="wb") as f:
                        f.write(continut)
                    continut_comprimat = buf.getvalue()
            print("cale: " + cale_fisier)

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
    finally:
        # Închidem conexiunea cu clientul
        clientsocket.close()
        print('S-a terminat comunicarea cu clientul.')

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

    # Creează un nou fir de execuție pentru a prelucra cererea clientului
    client_thread = threading.Thread(target=handle_client, args=(clientsocket,))
    client_thread.start()