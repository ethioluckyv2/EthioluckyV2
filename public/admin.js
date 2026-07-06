async function login(){

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    console.log("Login attempt:", username);


    const response = await fetch("/login", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            username,
            password
        })

    });


    const data = await response.json();


    console.log(data);


    if(data.success){

        alert("Welcome " + data.role);


        if(data.role === "admin"){
            window.location.href="/admin.html";
        }

        if(data.role === "host"){
            window.location.href="/";
        }

    }else{

        alert("Wrong username or password");

    }

}