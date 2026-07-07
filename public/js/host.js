const socket = io();


socket.on(
"viewerCount",
(count)=>{


document.getElementById(
"viewerCount"
).innerText=count;


});