let subscriptionsList = [];

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: "auto",

    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const res = await fetch('/subscriptions', {
          credentials: "include"
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        subscriptionsList = data;

        const events = data.map(sub => {
          const startDate = new Date(sub.subscriptiondate);

          // Get months from billing cycle like "1MONTHS"
          const monthsMatch = sub.subscriptionbillingcycle.match(/\d+/);
          const monthsToAdd = monthsMatch ? parseInt(monthsMatch[0], 10) : 0;

          // Use setMonth to add months (more accurate)
          const renewalDate = new Date(startDate);
          renewalDate.setMonth(renewalDate.getMonth() + monthsToAdd);

          // Format as YYYY-MM-DD
          const renewalDateStr = `${renewalDate.getFullYear()}-${(renewalDate.getMonth() + 1).toString().padStart(2, '0')}-${renewalDate.getDate().toString().padStart(2, '0')}`;

          return {
            title: sub.subscriptionname,
            start: renewalDateStr
          };
        });

        successCallback(events);
      } catch (err) {
        console.error("Error fetching subscriptions for calendar:", err);
        failureCallback(err);
      }
    },

    eventClick: function (info) {
      const subscriptionName = info.event.title;

      const matchedSub = subscriptionsList.find(sub => sub.subscriptionname === subscriptionName);
      if (!matchedSub) return;

      // Cost handling
      let displayAmount = matchedSub.subscriptioncost;
      let isSplit = false;
      let notes = "No notes";

      const splitDataRaw = localStorage.getItem(`split_${matchedSub.subscriptionname}`);
      if (splitDataRaw) {
        const splitData = JSON.parse(splitDataRaw);
        if (splitData.isSplit) {
          isSplit = true;
          displayAmount = splitData.costPerPerson;
          notes = splitData.notes || "Shared subscription";
        }
      }

      document.getElementById('modalTitle').textContent = subscriptionName + (isSplit ? " (split)" : "");
      document.getElementById('modalAmount').textContent = `₹${parseFloat(displayAmount).toFixed(2)}`;
      document.getElementById('modalDate').textContent = info.event.start.toDateString();
      document.getElementById('modalNotes').textContent = notes;

      // Show modal
      document.getElementById('eventModal').style.display = 'flex';
    },

    eventDidMount: function (info) {
      info.el.setAttribute('title', 'Click to view details');
    }
  });

  calendar.render();
});

function closeModal() {
  document.getElementById('eventModal').style.display = 'none';
}
