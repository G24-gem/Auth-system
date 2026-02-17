// Dashboard functionality
document.addEventListener('DOMContentLoaded', async () => {
    const usernameDisplay = document.getElementById('username');
    const logoutBtn = document.getElementById('logout-btn');

    // Check authentication status and get user info
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();

        if (data.authenticated && data.user) {
            usernameDisplay.textContent = data.user.username;
        } else {
            // Not authenticated, redirect to login
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error fetching auth status:', error);
        window.location.href = '/';
    }

    // Handle logout
    logoutBtn?.addEventListener('click', async () => {
        logoutBtn.disabled = true;
        logoutBtn.textContent = 'Logging out...';

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Redirect to login page
                window.location.href = '/';
            } else {
                alert('Error logging out. Please try again.');
                logoutBtn.disabled = false;
                logoutBtn.textContent = 'Logout';
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Network error. Please try again.');
            logoutBtn.disabled = false;
            logoutBtn.textContent = 'Logout';
        }
    });
});
