const fs = require("fs");
const path = require("path");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const app = express();

const server = http.createServer(app);

const io = new Server(server);



app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));





// ==========================
// USERS
// ==========================

const USERS = {

    admin:{
        password:"admin123",
        role:"admin"
    },


    host:{
        password:"host123",
        role:"host"
    }

};






// ==========================
// LOGIN
// ==========================

app.post("/login",(req,res)=>{


    const {
        username,
        password
    } = req.body;



    const user =
    USERS[username];



    if(!user || user.password !== password){


        return res.status(401).json({

            success:false,

            message:"Invalid login"

        });


    }



    res.json({

        success:true,

        role:user.role

    });



});









// ==========================
// LOAD DATA
// ==========================


const playersFile =
path.join(
    __dirname,
    "data/players.json"
);


const settingsFile =
path.join(
    __dirname,
    "data/settings.json"
);




// create files if missing

if(!fs.existsSync(playersFile)){

    fs.writeFileSync(
        playersFile,
        "[]"
    );

}


if(!fs.existsSync(settingsFile)){

    fs.writeFileSync(

        settingsFile,

        JSON.stringify({

            spinDuration:60,
            minSpeed:8,
            maxSpeed:25,
            bgColor:"#ffffff"

        },null,2)

    );

}





let players =
JSON.parse(
    fs.readFileSync(
        playersFile,
        "utf8"
    )
);




let settings =
JSON.parse(
    fs.readFileSync(
        settingsFile,
        "utf8"
    )
);






function savePlayers(){


    fs.writeFileSync(

        playersFile,

        JSON.stringify(
            players,
            null,
            2
        )

    );


}




function saveSettings(){


    fs.writeFileSync(

        settingsFile,

        JSON.stringify(
            settings,
            null,
            2
        )

    );


}





let viewers = 0;

// ==========================
// SOCKET CONNECTION
// ==========================

io.on("connection",(socket)=>{


    console.log(
        "Connected:",
        socket.id
    );



    viewers++;


    io.emit(
        "viewerCount",
        viewers
    );





    // Send saved data to new connection

    socket.emit(
        "updatePlayers",
        players
    );



    socket.emit(
        "updateSettings",
        settings
    );







    // ======================
    // PLAYERS UPDATE
    // ======================

    socket.on(
        "updatePlayers",
        (data)=>{


            players = data;



            savePlayers();



            console.log(
                "Players saved:",
                players
            );



            io.emit(
                "updatePlayers",
                players
            );


        }
    );









    // ======================
    // SETTINGS UPDATE
    // ======================


    socket.on(
        "updateSettings",
        (data)=>{


            settings = {

                ...settings,

                ...data

            };



            saveSettings();



            console.log(
                "Settings saved:",
                settings
            );



            io.emit(
                "updateSettings",
                settings
            );


        }
    );









    // ======================
    // START SPIN
    // ======================


    socket.on(
        "spinWheel",
        ()=>{


            console.log(
                "Spin started"
            );



            if(players.length === 0){


                console.log(
                    "No players"
                );


                return;

            }





            const winnerIndex =

            Math.floor(

                Math.random()
                *
                players.length

            );





            io.emit(
                "spinWheel",
                {


                    winnerIndex:
                    winnerIndex,



                    duration:
                    settings.spinDuration,



                    minSpeed:
                    settings.minSpeed,



                    maxSpeed:
                    settings.maxSpeed



                }
            );



        }
    );









    // ======================
    // DISCONNECT
    // ======================


    socket.on(
        "disconnect",
        ()=>{


            viewers--;


            if(viewers < 0){

                viewers = 0;

            }



            io.emit(
                "viewerCount",
                viewers
            );



            console.log(
                "Disconnected:",
                socket.id
            );


        }
    );



});









// ==========================
// START SERVER
// ==========================


const PORT =
process.env.PORT || 3000;



server.listen(
PORT,
()=>{


console.log(
"Server running on port",
PORT
);


});