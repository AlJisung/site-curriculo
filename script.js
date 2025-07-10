const firebaseConfig = {
  apiKey: "AIzaSyAMXmD-wJ4Whsk2z-ZCAikWIkbwZniuFic",
  authDomain: "curriculo-cliente.firebaseapp.com",
  projectId: "curriculo-cliente",
  storageBucket: "curriculo-cliente.appspot.com",
  messagingSenderId: "404580295206",
  appId: "1:404580295206:web:b57292cd726a55842b7ce7",
  measurementId: "G-392WTD2ER1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const docRef = db.collection("curriculos").doc("curriculos1");

const indexFoto = document.getElementById("foto");
const campos = ["nome", "email", "telefone", "historico", "artigos"];

if (document.getElementById("curriculoForm")) {
  const form = document.getElementById("curriculoForm");
  const uploadArea = document.getElementById("upload-area");
  const fotoInput = document.getElementById("fotoInput");
  const fotoPreview = document.getElementById("fotoPreview");
  let fotoURL = "";

  uploadArea.addEventListener("click", () => fotoInput.click());
  uploadArea.addEventListener("dragover", e => {
    e.preventDefault();
    uploadArea.style.borderColor = "#fff";
  });
  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "#FFC107";
  });
  uploadArea.addEventListener("drop", e => {
    e.preventDefault();
    fotoInput.files = e.dataTransfer.files;
    uploadFile(fotoInput.files[0]);
  });
  fotoInput.addEventListener("change", () => {
    if (fotoInput.files.length > 0) {
      uploadFile(fotoInput.files[0]);
    }
  });

  function uploadFile(file) {
    const ref = storage.ref("fotos/" + Date.now() + "_" + file.name);
    ref.put(file).then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        fotoURL = url;
        if (fotoPreview) {
          fotoPreview.src = fotoURL;
          fotoPreview.style.display = "block";
        }
        alert("Foto enviada com sucesso!");
      }).catch(err => {
        alert("Erro ao obter URL da foto: " + err.message);
      });
    }).catch(err => {
      alert("Erro ao enviar a foto: " + err.message);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {};
    campos.forEach(campo => {
      data[campo] = document.getElementById(campo).value;
    });
    if (fotoURL) data.fotoURL = fotoURL;
    docRef.set(data).then(() => alert("Currículo salvo com sucesso!"));
  });

  docRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      campos.forEach(campo => {
        if (data[campo]) document.getElementById(campo).value = data[campo];
      });
      if (data.fotoURL && fotoPreview) {
        fotoPreview.src = data.fotoURL;
        fotoPreview.style.display = "block";
      }
    }
  });
} else {
  docRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      campos.forEach(campo => {
        if (data[campo]) document.getElementById(campo).textContent = data[campo];
      });
      if (data.fotoURL && indexFoto) indexFoto.src = data.fotoURL;
    }
  });
}
