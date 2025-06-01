    document.getElementById("login").addEventListener("submit", async function(e){

            e.preventDefault();

            const email=document.getElementById("login-email").value;
            const password=document.getElementById("login-password").value;

                if(!email || !password){
                    alert("Please fill all details");
                }   

                try{
                    const res= await fetch('https://findmysubsbackend.onrender.com/login',{

                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body:JSON.stringify({email,password}),
                        credentials: "include"
                    });
                    const data=await res.json();
                    if(res.ok){
                        alert("Login Successful");
                        window.location.href="dashboard.html";
                    }else{
                        alert(data.message || "login failed");
                    }
                }
                catch(error){
                    alert("something went wrong");
                }
                    
    });
    