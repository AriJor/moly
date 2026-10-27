// Api linkki
const apiUrl = 'http://localhost:3000';

if (localStorage.getItem("isLoggedIn") == "true") {
    window.location.href = 'home.html';
}

// kirjautumislomake yhdistettyyn html-tiedostoon
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    /* Login */
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Etsi "loginForm" elementti, jonka id on nämä
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        try {
            // Odota palvelimelta käyttäjätiedot
            const response = await fetch(`${apiUrl}/users`);
            const users = await response.json();

            // Tarkista onko oikein & olemassa tiedostosta "data.json"
            const matchedUser = users.find(
                user => user.username === usernameInput && user.password === passwordInput
            );

            // Kun kirjautuu sisään, mene "home.html", muuten anna virhe teksti
            if (matchedUser) {
                localStorage.setItem("isLoggedIn", true)
                window.location.href = 'home.html';
            } else {
                alert('Virhe');
            }

        // Jos jokin toinen virhe tapahtuu, anna virhe teksti
        } catch (error) {
            console.error('Virhe yhteydessä palvelimeen:', error);
            alert('Palvelimeen ei saada yhteyttä.');
        }
    });
}