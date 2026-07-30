document.addEventListener('DOMContentLoaded', () => {
  const viewMembersBtn = document.getElementById('viewMembersBtn');
  if (viewMembersBtn) {
    viewMembersBtn.addEventListener('click', viewMembersInNewWindow);
  }
});

// The function renderMembersList is kept in case you want to use it for inline management elsewhere.

async function renderMembersList() {
  const container = document.getElementById('admin-content-area'); // Assuming you have a container
  if (!container) {
    console.error('Admin content area not found');
    return;
  }

  try {
    const response = await fetch('/api/admin/all-members');
    if (!response.ok) {
      throw new Error('Failed to fetch member data.');
    }
    const members = await response.json();

    // Clear previous content
    container.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = 'Manage Members';

    const table = document.createElement('table');
    table.id = 'membersTable';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Account Status</th>
          <th>Actions</th>
        </tr>
      `;
    const tbody = document.createElement('tbody');
    members.forEach(member => {
      const tr = document.createElement('tr');
      tr.dataset.userId = member.id;

      const nameTd = document.createElement('td');
      nameTd.textContent = member.name;

      const emailTd = document.createElement('td');
      emailTd.textContent = member.email;

      const roleTd = document.createElement('td');
      roleTd.textContent = member.isAdmin ? 'Admin' : 'Member';

      const statusTd = document.createElement('td');
      statusTd.className = 'status-cell';
      statusTd.textContent = member.status;

      const actionTd = document.createElement('td');
      const suspendBtn = document.createElement('button');
      suspendBtn.className = 'suspend-btn action-btn';
      suspendBtn.dataset.userId = member.id;
      suspendBtn.dataset.currentStatus = member.status;
      suspendBtn.textContent = member.status === 'active' ? 'Suspend' : 'Activate';
      suspendBtn.addEventListener('click', handleSuspendClick);

      const disableBtn = document.createElement('button');
      disableBtn.className = 'disable-btn action-btn';
      disableBtn.dataset.userId = member.id;
      disableBtn.textContent = 'Disable';
      disableBtn.disabled = member.status === 'disabled';
      disableBtn.addEventListener('click', handleDisableClick);

      actionTd.append(suspendBtn, disableBtn);

      tr.append(nameTd, emailTd, roleTd, statusTd, actionTd);
      tbody.appendChild(tr);
    });

    table.append(thead, tbody);
    container.append(title, table);
  } catch (error) {
    console.error('Error rendering members list:', error);
    showToast('Error loading members.', 'error');
  }
}

async function viewMembersInNewWindow() {
  try {
    const response = await fetch('/api/admin/all-members');
    if (!response.ok) {
      throw new Error('Failed to fetch member data.');
    }
    const members = await response.json();

    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      showToast('Please allow popups for this site to view members.', 'error');
      return;
    }

    const tableRows = members.map(member => `
        <tr>
          <td>${member.name}</td>
          <td>${member.email}</td>
          <td>${member.isAdmin ? 'Admin' : 'Member'}</td>
          <td>${member.status}</td>
        </tr>
      `).join('');

    newWindow.document.write(`
        <html>
          <head>
            <title>All Members</title>
            <style>
              body { font-family: sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .actions { margin-bottom: 20px; }
              button { padding: 10px 15px; margin-right: 10px; cursor: pointer; }
              @media print {
                .actions { display: none; }
              }
            </style>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf-autotable.min.js"></script>
          </head>
          <body>
            <h2>All Members</h2>
            <div class="actions">
              <button onclick="window.print()">Print</button>
              <button id="downloadPdfBtn">Download as PDF</button>
            </div>
            <table id="membersPrintTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Account Status</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            <script>
              document.getElementById('downloadPdfBtn').addEventListener('click', () => {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                doc.autoTable({ html: '#membersPrintTable' });
                doc.save('members-list.pdf');
              });
            </script>
          </body>
        </html>
      `);
    newWindow.document.close(); // Important for some browsers
  } catch (error) {
    console.error('Error opening members window:', error);
    showToast('Error loading members for viewing.', 'error');
  }
}

function handleDisableClick(event) {
  const button = event.target;
  const userId = button.dataset.userId;

  if (!confirm('Are you sure you want to disable this user? This action is generally not reversible through the UI.')) {
    return;
  }

  updateUserStatus(userId, 'disabled', button);
}

async function updateUserStatus(userId, newStatus, buttonEl) {
  try {
    const response = await fetch(`/api/admin/users/${userId}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error('Server responded with an error.');
    }
    const data = await response.json();

    if (data.success) {
      showToast(`User has been ${newStatus}.`, 'success');
      renderMembersList(); // Re-render the list to reflect all state changes
    } else {
      throw new Error(data.message || 'Failed to update user status.');
    }
  } catch (error) {
    console.error('Error updating user status:', error);
    showToast(error.message, 'error');
  }
}

function handleSuspendClick(event) {
  const button = event.target;
  const userId = button.dataset.userId;
  const currentStatus = button.dataset.currentStatus;
  const newStatus = currentStatus === 'active' ? 'suspended' : 'active';

  if (!confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'un-suspend'} this user?`)) {
    return;
  }

  updateUserStatus(userId, newStatus, button);
}

/**
 * Displays a non-blocking notification toast.
 * @param {string} message The message to display.
 * @param {'success'|'error'} type The type of toast.
 */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Add CSS for styling and animation in your main stylesheet
  // .toast { position: fixed; bottom: 20px; right: 20px; ... }

  setTimeout(() => {
    toast.remove();
  }, 3000);
}