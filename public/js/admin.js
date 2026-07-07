const socket = io();

let players = [];

let settings = {

    spinDuration: 60,
    minSpeed: 8,
    maxSpeed: 25,
    bgColor: "#ffffff"

};




// ==========================
// CONNECTION
// ==========================

socket.on("connect", ()=>{

    console.log(
        "Admin connected:",
        socket.id
    );

});





socket.on("disconnect", ()=>{

    console.log(
        "Admin disconnected"
    );

});





// ==========================
// RECEIVE PLAYERS
// ==========================

socket.on(
"updatePlayers",
(data)=>{


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
    document.getElementById(
        "playerName"
    ).value.trim();



    const color =
    document.getElementById(
        "playerColor"
    ).value;



    if(name === ""){


        alert(
            "Enter player name"
        );


        return;

    }





    const player = {


        id:Date.now(),


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
// DISPLAY PLAYERS
// ==========================

function renderPlayers(){


    const list =
    document.getElementById(
        "playersList"
    );



    const count =
    document.getElementById(
        "playerCount"
    );



    if(!list)
    return;



    list.innerHTML="";



    if(count){

        count.innerText =
        players.length;

    }







    players.forEach(
    (player,index)=>{


        const div =
        document.createElement(
            "div"
        );



        div.className =
        "playerItem";



        div.innerHTML = `


        <input

        value="${player.name}"

        onchange="editPlayer(${index},this.value)"

        >



        <input

        type="color"

        value="${player.color}"

        onchange="changeColor(${index},this.value)"

        >



        <button

        onclick="removePlayer(${index})">

        Delete

        </button>


        `;



        list.appendChild(div);



    });



}








// ==========================
// EDIT PLAYER
// ==========================

function editPlayer(index,value){


    players[index].name=value;



    socket.emit(
        "updatePlayers",
        players
    );


}









// ==========================
// CHANGE COLOR
// ==========================

function changeColor(index,color){


    players[index].color=color;



    socket.emit(
        "updatePlayers",
        players
    );


}









// ==========================
// REMOVE PLAYER
// ==========================

function removePlayer(index){


    players.splice(
        index,
        1
    );



    socket.emit(
        "updatePlayers",
        players
    );


}









// ==========================
// SPIN
// ==========================

function startSpin(){


    console.log(
        "Spin started"
    );


    socket.emit(
        "spinWheel"
    );


}









// ==========================
// SETTINGS
// ==========================

function saveSettings(){


    settings = {


        spinDuration:

        Number(
        document.getElementById(
            "spinDuration"
        ).value
        ),



        minSpeed:

        Number(
        document.getElementById(
            "minSpeed"
        ).value
        ),



        maxSpeed:

        Number(
        document.getElementById(
            "maxSpeed"
        ).value
        ),



        bgColor:

        document.getElementById(
            "bgColor"
        ).value


    };





    socket.emit(
        "updateSettings",
        settings
    );



    console.log(
        "Settings sent:",
        settings
    );



}








// ==========================
// VIEWERS
// ==========================

socket.on(
"viewerCount",
(count)=>{


    const viewer =
    document.getElementById(
        "viewerCount"
    );



    if(viewer){

        viewer.innerText=count;

    }



});
