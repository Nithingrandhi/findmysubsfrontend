document.getElementById("dashboard").addEventListener("submit", async function(e){
    e.preventDefault();

    const subscriptionname = document.getElementById("nameofsubscription").value;
    const subscriptiondate = document.getElementById("dateofsubscription").value;
    const subscriptionbillingcycle = document.getElementById("billingcycle").value;
    const subscriptioncost = parseFloat(document.getElementById("cost").value);
    
    const numpeople = parseInt(document.getElementById("quantity").value); // frontend only
    const notes = document.getElementById("notes").value; // frontend only

    if (!subscriptionname || !subscriptiondate || !subscriptionbillingcycle || isNaN(subscriptioncost)) {
        alert("Enter all details to add subscription");
        return;
    }

    // Calculate split amount (only if numpeople provided)
    let costPerPerson = null;
    if (!isNaN(numpeople) && numpeople > 1) {
        costPerPerson = (subscriptioncost / numpeople).toFixed(2);
    }

    // Send only the required fields to the backend
    try {
        const res = await fetch('https://findmysubsbackend.onrender.com/subscriptions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                subscriptionname,
                subscriptiondate,
                subscriptionbillingcycle,
                subscriptioncost
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert(`Subscription added successfully.\n${costPerPerson ? `Split: ${costPerPerson}/person` : ''}`);
            if (costPerPerson) {
    // Store split info in localStorage (keyed by subscription name)
    localStorage.setItem(`split_${subscriptionname}`, JSON.stringify({
        isSplit: true,
        costPerPerson,
        numpeople,
        notes
    }));
}

            document.getElementById("dashboard").reset();
        } else {
            alert("Subscription not added");
        }
    } catch (err) {
        alert("Something went wrong");
    }
});
