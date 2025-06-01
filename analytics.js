window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/subscriptions', { credentials: 'include' });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Server error response:", errorText);
            alert("Failed to fetch subscriptions");
            return;
        }

        const data = await res.json();

        if (!data.length) {
            document.getElementById("totalSpending").textContent = `₹0.00`;
            document.getElementById("averageMonthly").textContent = `₹0.00`;
            document.getElementById("highestSpending").textContent = `N/A`;
            return;
        }

        let totalSpending = 0;
        let highestSubscription = null;
        let highestCost = 0;

        const labels = [];
        const costs = [];

        data.forEach(sub => {
            let cost = parseFloat(sub.subscriptioncost);
            const splitDataRaw = localStorage.getItem(`split_${sub.subscriptionname}`);
            let displayName = sub.subscriptionname;

            if (splitDataRaw) {
                const splitData = JSON.parse(splitDataRaw);
                if (splitData.isSplit && splitData.costPerPerson) {
                    cost = parseFloat(splitData.costPerPerson);
                    displayName += " (split)";
                }
            }

            totalSpending += cost;

            if (cost > highestCost) {
                highestCost = cost;
                highestSubscription = displayName;
            }

            labels.push(displayName);
            costs.push(cost);
        });

        const averageMonthlySpending = totalSpending / data.length;

        document.getElementById("totalSpending").textContent = `₹${totalSpending.toFixed(2)}`;
        document.getElementById("averageMonthly").textContent = `₹${averageMonthlySpending.toFixed(2)}`;
        document.getElementById("highestSpending").textContent =
            `${highestSubscription} (₹${highestCost.toFixed(2)})`;

        // Pie Chart
        const ctx = document.getElementById('spendingPieChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Spending Breakdown',
                    data: costs,
                    backgroundColor: generateColorPalette(labels.length),
                    borderWidth: 1,
                    borderColor: '#00000022'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: context => `${context.label}: ₹${context.parsed.toFixed(2)}`
                        }
                    }
                }
            }
        });

    } catch (err) {
        alert("Something went wrong while loading analytics data");
        console.error(err);
    }
});

// Generates dynamic colors if more than fixed list
function generateColorPalette(count) {
    const baseColors = [
        '#f87171', '#60a5fa', '#34d399',
        '#fbbf24', '#a78bfa', '#fb7185', '#38bdf8', '#4ade80'
    ];
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(baseColors[i] || getRandomColor());
    }
    return colors;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
