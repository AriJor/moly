const apiUrl = 'http://localhost:3000';

// Startup
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("index.html");
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("currentUser"));
    } catch (err) {
        return null;
    }
}

async function loadPendingFriendRequests() {
    const currentUserObj = getCurrentUser();
    if (!currentUserObj) return;

    try {
        const response = await fetch(`${apiUrl}/users/${currentUserObj.id}`);
        const freshUser = await response.json();

        localStorage.setItem("currentUser", JSON.stringify(freshUser));

        const container = document.querySelector('.user-friend-message-container');
        const sendFriendRequestLi = document.getElementById('send-friend-request').closest('li');

        if (freshUser.friends && freshUser.friends.pending) {
            Object.keys(freshUser.friends.pending).forEach(senderName => {
                if (container.querySelector(`[data-sender="${senderName}"]`)) return;

                const template = document.querySelector('.friend-request-user-profile-template');
                if (template) {
                    const clone = template.cloneNode(true);
                    clone.style.display = 'flex';
                    clone.setAttribute('data-sender', senderName);
                    
                    const nameSpan = clone.querySelector('.user-name');
                    if (nameSpan) nameSpan.textContent = senderName;

                    container.insertBefore(clone, sendFriendRequestLi);
                }
            });
        }
    } catch (error) {
        console.error('Virhe ladattaessa kaveripyyntöjä:', error);
    }
}

// Run on page load
loadPendingFriendRequests();

// Home page button
const button = document.getElementById('home-page-button');
const homePage = document.getElementById('home-page');
const chatterbox = document.getElementById('chatterbox');
if (button) {
    button.addEventListener('click', () => {
        if (homePage) homePage.style.display = 'flex';
        if (chatterbox) chatterbox.style.display = 'none';
    });
}

// Send a friend request
const sendFriendRequest = document.getElementById('send-friend-request');
const addAFriend = document.getElementById('add-a-friend');
if (sendFriendRequest && addAFriend) {
    sendFriendRequest.addEventListener('click', () => {
        addAFriend.style.display = 'flex';

        const friendAFriendForm = document.getElementById('input-friend-name-form');
        if (friendAFriendForm) {
            friendAFriendForm.onsubmit = async (e) => {
                e.preventDefault();

                const usernameInput = document.getElementById('input-friend-name').value.trim();
                const currentUserObj = getCurrentUser();
                const currentUsername = currentUserObj ? currentUserObj.username : '';

                try {
                    const response = await fetch(`${apiUrl}/users`);
                    const users = await response.json();

                    const foundUser = users.find(user => user.username === usernameInput);
                    if (foundUser) {
                        if (!foundUser.username === currentUsername) {
                            alert("Et voi lähettää kaveripyyntöä itsellesi.");
                            return;
                        }

                        if (!foundUser.friends) foundUser.friends = { pending: {}, accepted: {} };
                        if (!foundUser.friends.pending) foundUser.friends.pending = {};

                        foundUser.friends.pending[currentUsername] = true;

                        const updateResponse = await fetch(`${apiUrl}/users/${foundUser.id}`, {
                            method: "PATCH",
                            headers: {
                                'Content-Type': "application/json",
                            },
                            body: JSON.stringify({
                                friends: foundUser.friends
                            })
                        });

                        if (updateResponse.ok) {
                            alert('Kaveripyyntö lähetetty!');
                            addAFriend.style.display = 'none';
                            document.getElementById('input-friend-name').value = '';
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
    });
        if (event.key === 'Escape' || event.key === 'Esc') {
            addAFriend.style.display = 'none';
        }
}