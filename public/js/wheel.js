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
// CONNECTION
// ==========================

socket.on("connect",()=>{


    console.log(
        "Wheel connected:",
        socket.id
    );


});






// ==========================
// SETTINGS UPDATE
// ==========================

socket.on(
"updateSettings",
(data)=>{


    settings=data;


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

        ctx.fillStyle="#000";


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


        const start =
        index*slice;


        const end =
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







        // TEXT


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
// SPIN FUNCTION
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






    const segment =
    360 / players.length;





    const winnerAngle =
    winnerIndex * segment
    +
    segment/2;






    const rotations =
    Math.max(
        8,
        maxSpeed
    );






    const finalRotation =

    rotation

    +

    rotations*360

    +

    (270-winnerAngle);







    rotation =
    finalRotation;







    const time =

    duration ||
    settings.spinDuration;







    canvas.style.transition =

    `transform ${time}s cubic-bezier(.12,.85,.18,1)`;






    canvas.style.transform =

    `rotate(${finalRotation}deg)`;








    setTimeout(()=>{


        spinning=false;


        showWinner(
            players[winnerIndex]
        );


    },time*1000);



}









// ==========================
// WINNER DISPLAY
// ==========================

function showWinner(player){


    if(!player)
    return;




    const box =
    document.getElementById(
        "winner"
    );



    if(box){


        box.innerHTML =

        "🎉 Winner: "

        +

        "<b>"

        +

        player.name

        +

        "</b>";



        if(typeof celebrateWinner==="function"){

            celebrateWinner(
                player.name
            );

        }



    }



}