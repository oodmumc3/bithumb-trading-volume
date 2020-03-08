// const socket = require('socket.io-client')('wss://pubwss.bithumb.com/pub/ws');
//
// socket.on('connect', () => {
//     console.log('connect bitcoin!!');
//     socket.close();
// });

const WebSocket = require('ws');
const socket = new WebSocket('wss://pubwss.bithumb.com/pub/ws');
socket.onopen 	= function(e){
    console.log("onopen...");
    const requestType = '{"type":"transaction","symbols":["BTC_KRW"]}';
    socket.send(requestType);
};
socket.onmessage= function(e){ console.log("onmessage...", e.data); }

