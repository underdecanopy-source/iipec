document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('active-users-count')) {
    fetchActiveUsers();
  }
});

/**
 * Fetches and displays the Monthly Active Users count.
 */
async function fetchActiveUsers() {
  const activeUsersElement = document.getElementById('active-users-count');
  if (!activeUsersElement) {
    console.warn('Element with ID "active-users-count" not found on this page.');
    return;
  }

  try {
    const response = await fetch('/api/admin/stats/active-users');
    if (!response.ok) {
      throw new Error('Failed to fetch active user data.');
    }
    const data = await response.json();
    activeUsersElement.textContent = data.monthlyActiveUsers;
  } catch (error) {
    console.error('Error fetching active users:', error);
    activeUsersElement.textContent = 'N/A'; // Display N/A on error
  }
}