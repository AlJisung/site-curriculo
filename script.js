import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMXmD-wJ4Whsk2z-ZCAikWIkbwZniuFic",
  authDomain: "curriculo-cliente.firebaseapp.com",
  projectId: "curriculo-cliente",
  storageBucket: "curriculo-cliente.appspot.com",
  messagingSenderId: "404580295206",
  appId: "1:404580295206:web:b57292cd726a55842b7ce7",
  measurementId: "G-392WTD2ER1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const docRef = doc(db, "curriculos", "curriculos1");

export async function salvar() {
  const dados = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    historico: document.getElementById("historico").value,
    artigos: document.getElementById("artigos").value
  };
  await updateDoc(docRef, dados);
  alert("Dados salvos!");
}

document.addEventListener("DOMContentLoaded", async () => {
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    if (document.getElementById("nome").tagName === "INPUT") {
      document.getElementById("nome").value = data.nome || "";
      document.getElementById("email").value = data.email || "";
      document.getElementById("telefone").value = data.telefone || "";
      document.getElementById("historico").value = data.historico || "";
      document.getElementById("artigos").value = data.artigos || "";
      if (data.fotoURL) {
        const preview = document.getElementById("fotoPreview");
        preview.src = data.fotoURL;
        preview.style.display = "block";
      }
    } else {
      document.getElementById("nome").textContent = data.nome || "";
      document.getElementById("email").textContent = data.email || "";
      document.getElementById("telefone").textContent = data.telefone || "";
      document.getElementById("historico").textContent = data.historico || "";
      document.getElementById("artigos").textContent = data.artigos || "";
      if (data.fotoURL) {
        document.getElementById("fotoExibida").src = data.fotoURL;
      }
    }
  }
});

const uploadArea = document.getElementById("upload-area");
const fotoInput = document.getElementById("fotoInput");
const fotoPreview = document.getElementById("fotoPreview");

if (uploadArea) {
  uploadArea.addEventListener("click", () => fotoInput.click());

  fotoInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      fotoPreview.src = reader.result;
      fotoPreview.style.display = "block";
    };
    reader.readAsDataURL(file);

    const storageRef = ref(storage, "fotos/" + file.name);
    await uploadBytes(storageRef, file);
    const fotoURL = await getDownloadURL(storageRef);
    await updateDoc(docRef, { fotoURL });
  });
}