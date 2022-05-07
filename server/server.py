import json
import socket
import threading
import time

HEADER = 64;
HOST: int
PORT: int
ADDR: object
GREET: str
END: str
FORMAT = 'utf-8'

connected_list = [];

server: socket

def loadConfig():
    with open('../server.json', encoding=FORMAT) as f:
        # print(f.readlines());
        jsn = json.load(f);
        global HOST, PORT, ADDR, GREET, END
        HOST= jsn['host']
        PORT = jsn['port']
        ADDR = (HOST, PORT)
        GREET = jsn['greet']
        END = jsn['close']


def serverSetup():
    global server
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(ADDR)


def handle_client(conn, addr):
    print(f'[NEW CONNECTIONS {addr} connected')
    conn.send(GREET.encode(FORMAT));
    connected_list.append((conn, addr))

    print(connected_list)

    connected = True
    time.sleep(0.01)
    #  loop that will run while it's connected
    while connected:
        # first, try to recieve a message containing the length
        try:
            msg_length = conn.recv(HEADER).decode(FORMAT)
            print("Length:  " + msg_length)
        except:
            # if this fails, close the connection
            conn.close()
            connected = False
            break

        #  if there was a message with a length
        # there should always be a new message in the buffer
        # with the length that we previously recieved
        # if this fails, the protocol was incorrect
        if msg_length:
            try:
                msg_length = int(msg_length)
                msg = conn.recv(msg_length).decode(FORMAT)
                print("MSG: " + msg)
                jsonMsg = json.loads(msg)
                print(jsonMsg)
            except:
                pass

            # always send a message back to the client at the end of the data-transferm
            # this way the client knows the connection will end
            conn.send(END.encode(FORMAT));
            connected = False
            break

    # if the loop ends, this means the connection whas somehow ended
    # thus I have to remove the connection from the connected_list
    # and formally close the connection
    print(f'[DISCONNECTION] {addr} disconnected')
    del connected_list[connected_list.index((conn, addr))]
    conn.close()


def start():
    # let the server listen on the binded host and port
    server.listen();
    print(f'[LISTENING] server is listening on {HOST}:{PORT}')
    # search for clients that want to connect
    while True:
        conn, addr = server.accept()
        thread = threading.Thread(target=handle_client, args=(conn, addr))
        thread.start()
        print(f'[ACTIVE CONNECTIONS] {threading.active_count() - 1}')


if __name__ == '__main__':
    # load in the config file
    loadConfig()
    #  setup for the server (binding)
    serverSetup()
    #  start the server so it can listen to new connections
    start()
