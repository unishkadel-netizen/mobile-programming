import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDPhmzoO_yqVTEIoLYRTWydu_Pf3Ojjp7I",
  authDomain: "jyotsana-fd98d.firebaseapp.com",
  databaseURL: "https://jyotsana-fd98d-default-rtdb.firebaseio.com",
  projectId: "jyotsana-fd98d",
  storageBucket: "jyotsana-fd98d.firebasestorage.app",
  messagingSenderId: "772650789732",
  appId: "1:772650789732:web:9c4ecd308925362bade871",
  measurementId: "G-JG2QM305P0",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🟢 ADD USER (DYNAMIC ID)
async function addUser() {
  try {
    const id = Date.now(); // unique ID

    await set(ref(db, "users/" + id), {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      nationality: document.getElementById("nationality").value,
      language: document.getElementById("language").value,
      subject: document.getElementById("subject").value,
    });

    document.getElementById("output").textContent =
      "User Added Successfully! ID: " + id;
  } catch (error) {
    document.getElementById("output").textContent = error.message;
  }
}

// 📥 READ SINGLE USER
async function getUser() {
  try {
    const id = document.getElementById("userId").value;

    const snapshot = await get(ref(db, "users/" + id));

    if (snapshot.exists()) {
      const user = snapshot.val();

      document.getElementById("firstName").value = user.firstName;
      document.getElementById("lastName").value = user.lastName;
      document.getElementById("email").value = user.email;
      document.getElementById("address").value = user.address;
      document.getElementById("phoneNumber").value = user.phoneNumber;
      document.getElementById("age").value = user.age;
      document.getElementById("gender").value = user.gender;
      document.getElementById("nationality").value = user.nationality;
      document.getElementById("language").value = user.language;
      document.getElementById("subject").value = user.subject;

      document.getElementById("output").textContent = "User Loaded!";
    } else {
      document.getElementById("output").textContent = "User Not Found";
    }
  } catch (error) {
    document.getElementById("output").textContent = error.message;
  }
}

// 📊 READ ALL USERS
async function readAllUsers() {
  try {
    const snapshot = await get(ref(db, "users"));

    if (!snapshot.exists()) {
      document.getElementById("output").textContent = "No Data Found";
      return;
    }

    let data = snapshot.val();
    let output = "";

    for (let id in data) {
      output += `
ID: ${id}
Name: ${data[id].firstName} ${data[id].lastName}
Email: ${data[id].email}
Phone: ${data[id].phoneNumber}
-------------------------
`;
    }

    document.getElementById("output").textContent = output;
  } catch (error) {
    document.getElementById("output").textContent = error.message;
  }
}

// ✏️ UPDATE USER
async function updateUser() {
  try {
    const id = document.getElementById("userId").value;

    await update(ref(db, "users/" + id), {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      nationality: document.getElementById("nationality").value,
      language: document.getElementById("language").value,
      subject: document.getElementById("subject").value,
    });

    document.getElementById("output").textContent = "User Updated!";
  } catch (error) {
    document.getElementById("output").textContent = error.message;
  }
}

// 🗑️ DELETE USER
async function deleteUser() {
  try {
    const id = document.getElementById("userId").value;

    await remove(ref(db, "users/" + id));

    document.getElementById("output").textContent = "User Deleted!";

    document.querySelectorAll("input").forEach((i) => (i.value = ""));
  } catch (error) {
    document.getElementById("output").textContent = error.message;
  }
}

// 🔥 IMPORTANT: make functions work in HTML buttons
window.addUser = addUser;
window.getUser = getUser;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
window.readAllUsers = readAllUsers;