// ==========================
// ETHIOLUCKY CELEBRATION
// ==========================


function celebrateWinner(name){


    createConfetti();



    showWinnerPopup(name);



    playWinnerSound();


}





// ==========================
// WINNER POPUP
// ==========================

function showWinnerPopup(name){


    const popup =
    document.createElement("div");


    popup.className =
    "winnerPopup";


    popup.innerHTML = `

    🎉 CONGRATULATIONS 🎉

    <br><br>

    🏆 ${name}

    `;



    document.body.appendChild(
        popup
    );



    setTimeout(()=>{


        popup.remove();


    },5000);



}






// ==========================
// CONFETTI
// ==========================

function createConfetti(){


    for(let i=0;i<100;i++){


        const piece =
        document.createElement("div");



        piece.className =
        "confetti";



        piece.style.left =
        Math.random()*100+"vw";



        piece.style.animationDuration =
        (2+Math.random()*3)+"s";



        document.body.appendChild(
            piece
        );



        setTimeout(()=>{


            piece.remove();


        },5000);



    }


}







// ==========================
// SOUND
// ==========================

function playWinnerSound(){


    const sound =
    document.getElementById(
        "winnerSound"
    );



    if(sound){


        sound.currentTime=0;


        sound.play();


    }


}