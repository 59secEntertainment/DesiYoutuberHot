document.addEventListener("DOMContentLoaded", loadImages);

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
        displayImage(title, description, imageData);
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function saveImage(title, description, imageData) {
    let images = JSON.parse(localStorage.getItem("images")) || [];
    images.push({ title, description, imageData });
    localStorage.setItem("images", JSON.stringify(images));
}

function loadImages() {
    let images = JSON.parse(localStorage.getItem("images")) || [];
    images.forEach((img, index) => displayImage(img.title, img.description, img.imageData, index));
}

function displayImage(title, description, imageData) {
    const gallery = document.getElementById("gallery");

    const div = document.createElement("div");
    div.className = "image-card";
    div.innerHTML = `
        <img src="${imageData}" alt="${title}">
        <h3>${title}</h3>
    `;

    div.onclick = function() {
        // Store image data in localStorage before opening photo.html
        localStorage.setItem("selectedPhoto", JSON.stringify({ title, description, imageData }));
        window.location.href = "photo.html";
    };

    gallery.appendChild(div);
}

