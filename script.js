//<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  console.log(database);
//</script>
