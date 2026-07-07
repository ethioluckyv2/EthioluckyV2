const socket = io();

let players = [];

let settings = {
    spinDuration: 60,
    minSpeed: 8,
    maxSpeed: 25,
    bgColor: "#ffffff"
};


// ==========================
// CONNECT
// ==========================

socket.on("connect", ()=>{

    console.log(
        "Admin connected:",
        socket.id
    );

});




// ==========================
// RECEIVE PLAYERS
// ==========================

socket.on("updatePlayers",(data)=>{

    console.log(
        "Players received:",
        data
    );


    players = data;

    renderPlayers();

});





// ==========================
// ADD PLAYER
// ==========================

function addPlayer(){


    const name =
    document.getElementById("playerName").value;


    const color =
    document.getElementById("playerColor").value;



    if(name.trim()===""){

        alert("Enter player name");

        return;

    }



    const player = {

        id: Date.now(),

        name:name,

        color:color

    };



    players.push(player);



    socket.emit(
        "updatePlayers",
        players
    );



    document.getElementById(
        "playerName"
    ).value="";


}







// ==========================
// SHOW PLAYERS
// ==========================

function renderPlayers(){


    const list =
    document.getElementById("playersList");


    const count =
    document.getElementById("playerCount");



    list.innerHTML="";


    if(count){

        count.innerText =
        players.length;

    }




    players.forEach((player)=>{


        const div =
        document.createElement("div");


        div.className =
        "playerItem";



        div.innerHTML = `


        <input

        value="${player.name}"

        onchange="editPlayer(${player.id}, this.value)">


        <input

        type="color"

        value="${player.color}"

        onchange="changeColor(${player.id}, this.value)">



        <button onclick="removePlayer(${player.id})">

        Delete

        </button>


        `;



        list.appendChild(div);



    });


}








// ==========================
// EDIT PLAYER NAME
// ==========================

function editPlayer(id,name){


    let player =
    players.find(
        p=>p.id===id
    );


    if(player){

        player.name=name;

    }



    socket.emit(
        "updatePlayers",
        players
    );


}









// ==========================
// CHANGE COLOR
// ==========================

function changeColor(id,color){


    let player =
    players.find(
        p=>p.id===id
    );



    if(player){

        player.color=color;

    }



    socket.emit(
        "updatePlayers",
        players
    );


}








// ==========================
// REMOVE PLAYER
// ==========================

function removePlayer(id){


    players =
    players.filter(
        p=>p.id!==id
    );



    socket.emit(
        "updatePlayers",
        players
    );


}








// ==========================
// CLEAR ALL PLAYERS
// ==========================

function clearPlayers(){


    if(confirm("Remove all players?")){


        players=[];


        socket.emit(
            "updatePlayers",
            players
        );


    }


}








// ==========================
// SPIN
// ==========================

function startSpin(){


    console.log(
        "Spin clicked"
    );


    socket.emit(
        "spinWheel"
    );


}








// ==========================
// SETTINGS
// ==========================

function saveSettings(){


settings={


spinDuration:
Number(
document.getElementById("spinDuration").value
),



minSpeed:
Number(
document.getElementById("minSpeed").value
),



maxSpeed:
Number(
document.getElementById("maxSpeed").value
),



bgColor:
document.getElementById("bgColor").value



};



console.log(
"Saving settings:",
settings
);



socket.emit(
"updateSettings",
settings
);



}








// ==========================
// VIEWERS
// ==========================

socket.on("viewerCount",(count)=>{


document.getElementById(
"viewerCount"
).innerText=count;


});