const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const socket = io();


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


    players=data;


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
    canvas.width/2;


    const radius =
    canvas.width/2-15;



    const slice =
    (Math.PI*2)/players.length;





    players.forEach(
    (player,index)=>{


        let start =
        index*slice;


        let end =
        start+slice;



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



        ctx.strokeStyle="#fff";

        ctx.lineWidth=3;

        ctx.stroke();





        // Text

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


        ctx.font =
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
// SPIN RECEIVE
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



    if(spinning) return;


    if(players.length===0)
    return;



    spinning=true;





    const slice =
    360 / players.length;



    const winnerPosition =

    winnerIndex * slice
    +
    slice/2;






    // Extra rotations

    const fastSpins =

    Math.max(
        8,
        maxSpeed
    );







    const finalRotation =

    rotation

    +

    (fastSpins*360)

    +

    (270-winnerPosition);







    let time =

    Math.min(

        Math.max(
            duration,
            5
        ),

        20

    );






    canvas.style.transition =

    `transform ${time}s cubic-bezier(.12,.85,.18,1)`;





    rotation =
    finalRotation;





    canvas.style.transform =

    `rotate(${rotation}deg)`;







    setTimeout(()=>{


        spinning=false;


        showWinner(
            players[winnerIndex]
        );


    },time*1000);



}








// ==========================
// WINNER
// ==========================

function showWinner(player){



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

        celebrateWinner(player.name);



    }


}