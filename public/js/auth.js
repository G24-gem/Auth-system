// Authentication handlers
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginFormContainer = document.getElementById('login-form');
    const signupFormContainer = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');

    // Toggle between login and signup forms
    showSignupBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.classList.add('hidden');
        signupFormContainer.classList.remove('hidden');
        clearErrors();
    });

    showLoginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        signupFormContainer.classList.add('hidden');
        loginFormContainer.classList.remove('hidden');
        clearErrors();
    });

    // Handle login form submission
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = loginForm.querySelector('.btn-primary');
        const errorDiv = document.getElementById('login-error');
        
        // Get form data
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Basic validation
        if (!email || !password) {
            showError(errorDiv, 'Please fill in all fields');
            return;
        }

        // Set loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        clearErrors();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Success - redirect to dashboard
                window.location.href = '/dashboard';
            } else {
                // Show error message
                showError(errorDiv, data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            showError(errorDiv, 'Network error. Please check your connection and try again.');
            console.error('Login error:', error);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Handle signup form submission
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = signupForm.querySelector('.btn-primary');
        const errorDiv = document.getElementById('signup-error');
        
        // Get form data
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            showError(errorDiv, 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            showError(errorDiv, 'Passwords do not match');
            return;
        }

        if (password.length < 8) {
            showError(errorDiv, 'Password must be at least 8 characters long');
            return;
        }

        // Password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(password)) {
            showError(errorDiv, 'Password must contain uppercase, lowercase, number, and special character');
            return;
        }

        // Set loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        clearErrors();

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Success - redirect to dashboard
                window.location.href = '/dashboard';
            } else {
                // Show error message(s)
                if (data.errors && Array.isArray(data.errors)) {
                    showError(errorDiv, data.errors.join('. '));
                } else {
                    showError(errorDiv, data.message || 'Signup failed. Please try again.');
                }
            }
        } catch (error) {
            showError(errorDiv, 'Network error. Please check your connection and try again.');
            console.error('Signup error:', error);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Utility functions
    function showError(errorDiv, message) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }
    }

    function clearErrors() {
        const errorDivs = document.querySelectorAll('.error-message');
        errorDivs.forEach(div => {
            div.textContent = '';
            div.classList.remove('show');
        });
    }

    // Real-time password validation feedback
    const signupPassword = document.getElementById('signup-password');
    signupPassword?.addEventListener('input', (e) => {
        const password = e.target.value;
        const hint = signupPassword.nextElementSibling;
        
        if (password.length === 0) {
            hint.style.color = 'var(--text-secondary)';
            return;
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[@$!%*?&]/.test(password);
        const hasMinLength = password.length >= 8;

        const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecial && hasMinLength;
        
        hint.style.color = isValid ? 'var(--success)' : 'var(--error)';
    });

    // Confirm password matching feedback
    const confirmPassword = document.getElementById('signup-confirm-password');
    confirmPassword?.addEventListener('input', (e) => {
        const password = signupPassword.value;
        const confirm = e.target.value;
        
        if (confirm.length === 0) {
            e.target.style.borderColor = '#e0e0e0';
            return;
        }

        if (password === confirm) {
            e.target.style.borderColor = 'var(--success)';
        } else {
            e.target.style.borderColor = 'var(--error)';
        }
    });
});
