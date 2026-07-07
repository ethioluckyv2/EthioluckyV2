// ETHIOLUCKY AUTH


function checkAuth(requiredRole){

    const role = localStorage.getItem("userRole");


    if(!role){

        window.location.href="/login.html";

        return false;

    }


    if(requiredRole && role !== requiredRole){

        window.location.href="/login.html";

        return false;

    }


    return true;

}




function logout(){

    console.log("Logging out...");


    localStorage.removeItem("userRole");


    window.location.href="/login.html";

}