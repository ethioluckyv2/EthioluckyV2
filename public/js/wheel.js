const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const socket = io({
    transports:["websocket"]
});


let players = [];

let rotation = 0;

let spinning = false;


let settings = {

    spinDuration:60,

    minSpeed:8,

    maxSpeed:25,

    bgColor:"#ffffff"

};




// ==========================
// SETTINGS UPDATE
// ==========================

socket.on(
"updateSettings",
(data)=>{


    settings = data;


    document.body.style.backgroundColor =
    settings.bgColor;


});






// ==========================
// PLAYERS UPDATE
// ==========================

socket.on(
"updatePlayers",
(data)=>{


    players = data;


    drawWheel();


});







// ==========================
// DRAW WHEEL
// ==========================

function drawWheel(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    if(players.length===0){


        ctx.font="30px Arial";

        ctx.fillStyle="black";


        ctx.fillText(
            "Waiting for players...",
            80,
            350
        );


        return;

    }




    const center =
    canvas.width / 2;


    const radius =
    canvas.width / 2 - 15;



    const slice =
    (Math.PI * 2) / players.length;





    players.forEach(
    (player,index)=>{


        const start =
        index * slice;


        const end =
        start + slice;



        ctx.beginPath();


        ctx.moveTo(
            center,
            center
        );



        ctx.arc(
            center,
            center,
            radius,
            start,
            end
        );



        ctx.closePath();



        ctx.fillStyle =
        player.color || "#ddd";


        ctx.fill();



        ctx.strokeStyle="#ffffff";

        ctx.lineWidth=3;

        ctx.stroke();





        // PLAYER TEXT

        ctx.save();



        ctx.translate(
            center,
            center
        );



        ctx.rotate(
            start + slice/2
        );



        ctx.textAlign="right";


        ctx.fillStyle="#000";


        ctx.font=
        "bold 24px Arial";



        ctx.fillText(
            player.name,
            radius-35,
            8
        );



        ctx.restore();



    });



}









// ==========================
// RECEIVE SPIN
// ==========================

socket.on(
"spinWheel",
(data)=>{


    spinWheel(

        data.winnerIndex,

        data.duration,

        data.minSpeed,

        data.maxSpeed

    );


});









// ==========================
// REALISTIC SPIN
// ==========================

function spinWheel(
winnerIndex,
duration,
minSpeed,
maxSpeed
){



    if(spinning)
    return;



    if(players.length===0)
    return;



    spinning=true;





    const slice =
    360 / players.length;




    // CENTER OF WINNING SEGMENT

    const winnerAngle =
    winnerIndex * slice + slice/2;





    // Make many rotations

    const extraRotations =
    Math.max(
        8,
        maxSpeed
    );






    /*
       Pointer is at the top.
       270 degrees = top position.
    */


    const finalRotation =

    rotation

    +

    (extraRotations * 360)

    +

    (270 - winnerAngle);






    rotation =
    finalRotation;





    // Use full duration

    const spinTime =
    duration || settings.spinDuration;






    canvas.style.transition =

    `transform ${spinTime}s cubic-bezier(.12,.85,.18,1)`;





    canvas.style.transform =

    `rotate(${finalRotation}deg)`;









    setTimeout(()=>{


        spinning=false;



        showWinner(
            players[winnerIndex]
        );



    },spinTime*1000);



}









// ==========================
// WINNER
// ==========================

function showWinner(player){


    if(!player)
    return;



    const box =
    document.getElementById("winner");



    if(box){


        box.innerHTML =

        "🎉 Winner: "

        +

        "<b>"

        +

        player.name

        +

        "</b>";



        celebrateWinner(
            player.name
        );


    }


}