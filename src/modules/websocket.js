import { draw } from "./canvas.js";

let socket = null;


const openConnection = ()=>{
    socket = new WebSocket("wss:api.appgohorse.com.b/websocket");

    socket.onopen = function(e) {
        console.log("[open] Connection established");
    };
    
    socket.onmessage = draw;

    socket.onclose = function(event) {

        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log('[close] Connection died');
        }
        setTimeout(()=>{
            socket = new WebSocket("wss:api.appgohorse.com.b/websocket");
        },2000);
        
    };
  
    socket.onerror = function(error) {
        console.log(`[error]`, error);
    };
}

const sendMessage = (message) =>{
    console.log("Send message to WS")
    socket.send(message);
   
}

const closeWebsocket = () =>{
    socket.close();
}

export const WebsocketWrapper = {
    close: closeWebsocket,
    open: openConnection,
    send: sendMessage,
}
