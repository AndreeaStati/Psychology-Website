import socket
import os

# Creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(('', 5678))
serversocket.listen(5)

while True:
    print('Serverul ascultă potențialii clienți')
    clientsocket, address = serversocket.accept()
    print('S-a conectat un client.')

    cerere = ''
    linieDeStart = ''
    
    while True:
        data = clientsocket.recv(1024)
        cerere += data.decode()
        print ('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')

        if (pozitie > -1):
            linieDeStart = cerere[0:pozitie]
            print ('S-a citit linia de start din cerere: ##### ' + linieDeStart + '#####')
            break

    print ('S-a terminat cititrea.')
    
    primaLinie = linieDeStart.split()
    if len(primaLinie) > 1:
        resursa = primaLinie[1]
    else:
        resursa = "/"

    if resursa == "/":
        resursa = "/index.html"

    nume_fisier = os.path.join("continut", resursa[1:])

    # Verificam daca fisierul exista
    if os.path.exists(nume_fisier):
        with open(nume_fisier, 'rb') as f:
            continut = f.read()
        status_line = "HTTP/1.1 200 OK\r\n"
        content_type = "Content-Type: text/html\r\n"
    else:
        continut = b"<h1>404 Not Found</h1>"
        status_line = "HTTP/1.1 404 Not Found\r\n"
        content_type = "Content-Type: text/html\r\n"

    headers = (
        status_line +
        content_type +
        f"Content-Length: {len(continut)}\r\n" +
        "Server: SimplePythonServer\r\n" +
        "\r\n"
    )

    clientsocket.sendall(headers.encode() + continut)
    clientsocket.close()
