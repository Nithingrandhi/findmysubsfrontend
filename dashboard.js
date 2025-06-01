    document.getElementById("dashboard").addEventListener("submit", async function(e){

        e.preventDefault();

        const subscriptionname=document.getElementById("nameofsubscription").value;
        const subscriptiondate=document.getElementById("dateofsubscription").value;
        const subscriptionbillingcycle=document.getElementById("billingcycle").value;
        const subscriptioncost=document.getElementById("cost").value;

        if(!subscriptionname || !subscriptiondate || !subscriptionbillingcycle || !subscriptioncost){

            alert("Enter all details to add subscription");
            return;
        }

        try{
            const res= await fetch('https://findmysubsbackend.onrender.com/subscriptions',{

                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({subscriptionname, subscriptiondate,  subscriptionbillingcycle ,subscriptioncost })
            });
            const data=await res.json();
            if(res.ok){
                alert("subscription added successfully");
                document.getElementById("dashboard").reset();
            }
            else{
                alert("subscription not added");
            }
        }
        catch(err){
            alert("something went wrong");
        }
    });


