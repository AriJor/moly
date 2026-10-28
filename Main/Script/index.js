const apiUrl = 'http://localhost:3000';

/*
if (localStorage.getItem("isLoggedIn") == "true") {
    window.location.href = 'index.html';
}*/

const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        try {
            const response = await fetch(`${apiUrl}/users`);
            const users = await response.json();

            const loggedInUser = users.find(user => user.username === usernameInput && user.password === passwordInput)
            if (loggedInUser) {
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
                window.location.href = 'home.html';
            } else {
                alert('Virhe');
            }

        } catch (error) {
            console.error('Virhe yhteydessä palvelimeen:', error);
            alert('Palvelimeen ei saada yhteyttä.');
        }
    });
}