/* Check if the user has logged in before */
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("index.html");
}

