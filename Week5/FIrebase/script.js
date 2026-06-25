import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1HvFRPr3BeGgXJuRcJRx5HO_SV6OPeUE",
  authDomain: "mobile-6e51c.firebaseapp.com",
  databaseURL: "https://mobile-6e51c-default-rtdb.firebaseio.com",
  projectId: "mobile-6e51c",
  storageBucket: "mobile-6e51c.firebasestorage.app",
  messagingSenderId: "812698940547",
  appId: "1:812698940547:web:600dc567369ec19806d7b6",
  measurementId: "G-5TKBWMF36V"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function writeUserData(userId, name, email) {
  set(ref(db, "users/" + userId), {
    name: name,
    email: email
  })
    .then(() => console.log("User added"))
    .catch(error => console.error(error));
}

window.writeUserData = writeUserData;

function readUser() {
  get(ref(db, "users"))
    .then(snapshot => {
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          console.log(childSnapshot.key, childSnapshot.val());
        });
      } else {
        console.log("No users found");
      }
    })
    .catch(error => console.error(error));
}

window.readUser = readUser;

function readUserById(userId) {
  get(ref(db, "users/" + userId))
    .then(snapshot => {
      if (snapshot.exists()) {
        const user = snapshot.val();

        document.getElementById("read-result").innerHTML =
          `Name: ${user.name}<br>Email: ${user.email}`;
      } else {
        document.getElementById("read-result").innerHTML =
          "User not found";
      }
    })
    .catch(error => console.error(error));
}

window.readUserById = readUserById;

function fetchUserForUpdate(userId) {
  get(ref(db, "users/" + userId))
    .then(snapshot => {
      if (snapshot.exists()) {
        const user = snapshot.val();

        document.getElementById("update-name").value = user.name;
        document.getElementById("update-email").value = user.email;
      }
    })
    .catch(error => console.error(error));
}

window.fetchUserForUpdate = fetchUserForUpdate;

function updateUserData(userId, updatedData) {
  update(ref(db, "users/" + userId), updatedData)
    .then(() => console.log("User updated"))
    .catch(error => console.error(error));
}

window.updateUserData = updateUserData;

function deleteUserData(userId) {
  remove(ref(db, "users/" + userId))
    .then(() => console.log("User deleted"))
    .catch(error => console.error(error));
}

window.deleteUserData = deleteUserData;