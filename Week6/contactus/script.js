import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "mobile-6e51.firebaseapp.com",
    databaseURL: "https://mobile-6e51c-default-rtdb.firebaseio.com/",
    projectId: "mobile-6e51",
    storageBucket: "mobile-6e51.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


// CREATE USER
document.getElementById("contactForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const userNumber = document.getElementById("userNumber").value;

    const userData = {
        fullname: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        country: document.getElementById("country").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    };

    set(ref(database, "users/" + userNumber), userData)
        .then(() => {
            alert("User data saved successfully!");
            document.getElementById("contactForm").reset();
        })
        .catch((error) => {
            alert(error);
        });

});


// READ USER
document.getElementById("searchBtn").addEventListener("click", () => {

    const number = document.getElementById("searchNumber").value;

    get(ref(database, "users/" + number))
        .then((snapshot) => {

            if (snapshot.exists()) {

                const user = snapshot.val();

                document.getElementById("result").innerHTML = `
<div class="user-card">
    <h3>User ${number}</h3>

    <p><b>Full Name:</b> ${user.fullname}</p>
    <p><b>Email:</b> ${user.email}</p>
    <p><b>Phone:</b> ${user.phone}</p>
    <p><b>Address:</b> ${user.address}</p>
    <p><b>City:</b> ${user.city}</p>
    <p><b>Country:</b> ${user.country}</p>
    <p><b>Subject:</b> ${user.subject}</p>
    <p><b>Message:</b> ${user.message}</p>
</div>
`;

            } else {

                document.getElementById("result").innerHTML =
                    "<h3>No user found!</h3>";

            }

        })
        .catch((error) => {
            alert(error);
        });

});