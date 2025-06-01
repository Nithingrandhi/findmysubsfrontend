document.getElementById("signup").addEventListener("submit", async function(e){

    e.preventDefault();

    const username=document.getElementById("signup-username").value; 
    const email=document.getElementById("signup-email").value;
    const password=document.getElementById("signup-password").value;
    const confirmpassword=document.getElementById("signup-confirmpassword").value;

    if(!username || !email || !password || !confirmpassword){

        alert("all fields are required");
    }
    else if(password !== confirmpassword){

        alert("passwords didnot matched");
    }
    try{

        res=await fetch("https://findmysubsbackend.onrender.com/signup", {
         
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({username,email,password})
        });
        const data=await res.json();
        if(res.ok){
            alert("signup successful");
            window.location.href="login.html";
        }
        else{
            alert("signup failed");
        }
    }
        catch(err){
            console.error("Error:", err);
            alert("something went wrong");
        }
});
    