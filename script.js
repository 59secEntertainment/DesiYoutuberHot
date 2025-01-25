let db;

document.addEventListener("DOMContentLoaded", () => {
    let request = indexedDB.open("PhotoDB", 1);

    request.onupgradeneeded = function(event) {
        let db = event.target.result;
        db.createObjectStore("photos", { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        loadImages();
    };
});

function uploadImage() {
    const fileInput = document.getElementById("imageUpload");
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    if (!fileInput.files.length) {
        alert("Please select an image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imageData = event.target.result;
        saveImage(title, description, imageData);
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function saveImage(title, description, imageData) {
    let transaction = db.transaction(["photos"], "readwrite");
    let store = transaction.objectStore("photos");
    store.add({ title, description, imageData });

    transaction.oncomplete = function() {
        alert("Image uploaded successfully!");
        loadImages();
    };
}

function loadImages() {
    let transaction = db.transaction(["photos"], "readonly");
    let store = transaction.objectStore("photos");
    let request = store.getAll();

    request.onsuccess = function() {
        const gallery = document.getElementById("gallery");
        gallery.innerHTML = "";
        request.result.forEach(photo => displayImage(photo));
    };
}

function displayImage(photo) {
    const gallery = document.getElementById("gallery");

    const div = document.createElement("div");
    div.className = "image-card";
    div.innerHTML = `
        <img src="${photo.imageData}" alt="${photo.title}">
        <h3>${photo.title}</h3>
    `;

    div.onclick = function() {
        localStorage.setItem("selectedPhotoId", photo.id);
        window.location.href = "photo.html";
    };

    gallery.appendChild(div);
}
