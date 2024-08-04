
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { collection,
  addDoc,
 getDocs,
 doc,
 updateDoc,
 deleteDoc,
 getDoc
      } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBlqEQs5FrbbzKqvSK25LRhuDpZCaYI214",
    authDomain: "my-first-project-bbc9d.firebaseapp.com",
    projectId: "my-first-project-bbc9d",
    storageBucket: "my-first-project-bbc9d.appspot.com",
    messagingSenderId: "720733190128",
    appId: "1:720733190128:web:24a21f5ec7f313361d4f35",
    measurementId: "G-PF89PLLPET"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };




// Add User
const addUserForm = document.getElementById('add-user-form');
if (addUserForm) {
  addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    try {
      await addDoc(collection(db, 'users'), { name, email });
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  });
}

// List Users
const usersDiv = document.getElementById('users');
if (usersDiv) {
  const usersCollection = collection(db, 'users');
  getDocs(usersCollection).then((snapshot) => {
    snapshot.forEach((doc) => {
      const user = doc.data();
      const userDiv = document.createElement('div');
      userDiv.classList.add('user');
      userDiv.innerHTML = `
        <p>${user.name} - ${user.email}</p>
        <a href="edit-user.html?id=${doc.id}">Edit</a>
        <a href="#" data-id="${doc.id}" class="delete">Delete</a>
      `;
      usersDiv.appendChild(userDiv);
    });

    // Delete User
    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = button.getAttribute('data-id');
        try {
          await deleteDoc(doc(db, 'users', id));
          window.location.reload();
        } catch (error) {
          console.error('Error deleting document: ', error);
        }
      });
    });
  });
}

// Edit User
const editUserForm = document.getElementById('edit-user-form');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
if (editUserForm && id) {
  const userDoc = doc(db, 'users', id);
  getDoc(userDoc).then((doc) => {
    const user = doc.data();
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-email').value = user.email;
  });

  editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    try {
      await updateDoc(userDoc, { name, email });
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  });
}
