const apiUrl = 'http://localhost:3000';

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("index.html");
}

const button = document.getElementById('home-page-button');
const homePage = document.getElementById('home-page');
const chatterbox = document.getElementById('chatterbox');

if (button) {
    button.addEventListener('click', () => {
        if (homePage) homePage.style.display = 'flex';
        if (chatterbox) chatterbox.style.display = 'none';
    });
}

const sendFriendRequest = document.getElementById('send-friend-request');
const addAFriend = document.getElementById('add-a-friend');

if (sendFriendRequest && addAFriend) {
    sendFriendRequest.addEventListener('click', () => {
        addAFriend.style.display = 'flex';

        const friendAFriendForm = document.getElementById('input-friend-name-form');
        
        if (friendAFriendForm) {
            friendAFriendForm.onsubmit = async (e) => {
                e.preventDefault();

                const usernameInput = document.getElementById('input-friend-name').value;
                
                let currentUsername = '';
                try {
                    const currentUserObj = JSON.parse(localStorage.getItem("currentUser"));
                    currentUsername = currentUserObj ? currentUserObj.username : '';
                } catch (err) {
                    currentUsername = localStorage.getItem("currentUser");
                }

                try {
                    const response = await fetch(`${apiUrl}/users`);
                    const users = await response.json();

                    const foundUser = users.find(user => user.username === usernameInput);
                    
                    if (foundUser) {
                        if (!foundUser.username === currentUsername) {
                            alert('Et voi lähettää kaveripyyntöä itsellesi.');
                            return;
                        }

                        // Ensure structure exists
                        if (!foundUser.friends) foundUser.friends = { pending: {}, accepted: {} };
                        if (!foundUser.friends.pending) foundUser.friends.pending = {};

                        foundUser.friends.pending[currentUsername] = true;

                        const updateResponse = await fetch(`${apiUrl}/users/${foundUser.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                friends: foundUser.friends
                            })
                        });

                        if (updateResponse.ok) {
                            alert('Kaveripyyntö lähetetty!');
                            addAFriend.style.display = 'none';
                        } else {
                            alert('Virhe pyynnön lähetyksessä.');
                        }
                    } else {
                        alert('Virhe: Käyttäjää ei löytynyt');
                    }

                } catch (error) {
                    console.error('Virhe yhteydessä palvelimeen:', error);
                    alert('Palvelimeen ei saada yhteyttä.');
                }
            };
        }    
    });

    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
            addAFriend.style.display = 'none';
        }
    });
}