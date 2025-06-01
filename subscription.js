window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('https://findmysubsbackend.onrender.com/subscriptions', {
            method: "GET",
            credentials: "include"
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Server error response:", errorText);
            alert("Failed to fetch subscriptions");
            return;
        }

        const data = await res.json();
        const tbody = document.getElementById("subscriptionstablebody");
        const noMsg = document.getElementById("noSubscriptionsMsg");

        if (data.length === 0) {
            noMsg.style.display = "block";
            return;
        } else {
            noMsg.style.display = "none";
        }

        const formatDate = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        data.forEach(sub => {
            const startDate = new Date(sub.subscriptiondate);

            const monthsMatch = sub.subscriptionbillingcycle.match(/\d+/);
            const monthsToAdd = monthsMatch ? parseInt(monthsMatch[0], 10) : 0;

            const renewalDate = new Date(startDate);
            renewalDate.setMonth(renewalDate.getMonth() + monthsToAdd);

            const subscriptionDateStr = formatDate(startDate);
            const renewalDateStr = formatDate(renewalDate);

            const splitDataRaw = localStorage.getItem(`split_${sub.subscriptionname}`);
            let displayName = sub.subscriptionname;
            let splitCostDisplay = "";

            if (splitDataRaw) {
                const splitData = JSON.parse(splitDataRaw);
                if (splitData.isSplit) {
                    displayName += " (split)";
                    splitCostDisplay = `<br><small>Per person: ₹${splitData.costPerPerson}</small>`;
                    if (splitData.notes) {
                        splitCostDisplay += `<br><small>Notes: ${splitData.notes}</small>`;
                    }
                }
            }

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${displayName}</td>
                <td>${subscriptionDateStr}</td>
                <td>${sub.subscriptionbillingcycle}</td>
                <td>₹${sub.subscriptioncost}${splitCostDisplay}</td>
                <td>${renewalDateStr}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (err) {
        alert("Something went wrong while loading subscriptions");
        console.error(err);
    }
});
