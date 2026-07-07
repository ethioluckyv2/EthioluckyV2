const fs = require("fs");
const path = require("path");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const app = express();

const server = http.createServer(app);



const io = new Server(server,{

    cors:{

        origin:"*",

        methods:[
            "GET",
            "POST"
        ]

    }

});



app.use(express.json());


app.use(
    express.static(
        path.join(__dirname,"public")
    )
);




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

app.post(
"/login",
(req,res)=>{


    const {
        username,
        password
    } = req.body;



    const user =
    USERS[username];



    if(
        !user ||
        user.password !== password
    ){


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
// DATA FILES
// ==========================

const dataFolder =
path.join(
    __dirname,
    "data"
);



if(!fs.existsSync(dataFolder)){

    fs.mkdirSync(dataFolder);

}



const playersFile =
path.join(
    dataFolder,
    "players.json"
);



const settingsFile =
path.join(
    dataFolder,
    "settings.json"
);






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






let viewers=0;










// ==========================
// SOCKET CONNECTION
// ==========================

io.on(
"connection",
(socket)=>{


    console.log(
        "Connected:",
        socket.id
    );



    viewers++;



    io.emit(
        "viewerCount",
        viewers
    );






    // send current data

    socket.emit(
        "updatePlayers",
        players
    );



    socket.emit(
        "updateSettings",
        settings
    );









    // ======================
    // PLAYERS
    // ======================


    socket.on(
    "updatePlayers",
    (data)=>{


        players=data;


        savePlayers();



        console.log(
            "Players:",
            players
        );



        io.emit(
            "updatePlayers",
            players
        );



    });









    // ======================
    // SETTINGS
    // ======================


    socket.on(
    "updateSettings",
    (data)=>{


        settings={

            ...settings,

            ...data

        };



        saveSettings();



        io.emit(
            "updateSettings",
            settings
        );



    });









    // ======================
    // SPIN
    // ======================


    socket.on(
    "spinWheel",
    ()=>{


        if(players.length===0)
        return;



        const winnerIndex =

        Math.floor(

            Math.random()
            *
            players.length

        );





        io.emit(
            "spinWheel",
            {

                winnerIndex,

                duration:
                settings.spinDuration,

                minSpeed:
                settings.minSpeed,

                maxSpeed:
                settings.maxSpeed


            }
        );



    });









    // ======================
    // DISCONNECT
    // ======================


    socket.on(
    "disconnect",
    ()=>{


        viewers--;


        if(viewers<0)
        viewers=0;



        io.emit(
            "viewerCount",
            viewers
        );



        console.log(
            "Disconnected:",
            socket.id
        );


    });



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