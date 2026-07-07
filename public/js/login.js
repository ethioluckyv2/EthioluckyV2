async function login(){


    const username =
    document.getElementById("username").value;


    const password =
    document.getElementById("password").value;


    console.log(
        "Trying login:",
        username,
        password
    );


    const response = await fetch("/login",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username:username,

            password:password

        })

    });



    const data = await response.json();



    console.log(data);



    if(data.success){


        localStorage.setItem(
            "userRole",
            data.role
        );



        if(data.role === "admin"){

            window.location.href="/admin.html";

        }



        if(data.role === "host"){

            window.location.href="/host.html";

        }


    }

    else{


        document.getElementById("message").innerHTML =
        "Wrong username or password";


    }



}