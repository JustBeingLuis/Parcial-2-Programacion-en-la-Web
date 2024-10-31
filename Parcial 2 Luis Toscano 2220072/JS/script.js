const API_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos";
const API_KEY = "DEMO_KEY";
let currentPage = 1;
let currentDate = "2015-07-02";

async function fetchPhotos(date, page = 1) {
    const response = await fetch(`${API_URL}?earth_date=${date}&page=${page}&api_key=${API_KEY}`);
    const data = await response.json();
    return data.photos;
}

function renderPhotos(photos) {
    const tableBody = document.querySelector("#photos-table tbody");
    tableBody.innerHTML = "";

    photos.forEach(photo => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${photo.id}</td>
            <td>${photo.rover.name}</td>
            <td>${photo.camera.full_name}</td>
            <td><button onclick="showDetails(${photo.id})">More</button></td>
        `;
        tableBody.appendChild(row);
    });
}

async function showDetails(photoId) {
    const photos = await fetchPhotos(currentDate, currentPage);
    const photo = photos.find(p => p.id === photoId);

    if (photo) {
        document.getElementById("photo-details").innerHTML = `
            <h2>ID: ${photo.id}</h2>
            <p>Rover: ${photo.rover.name}</p>
            <p>Martian Sol: ${photo.sol}</p>
            <p>Earth Date: ${photo.earth_date}</p>
            <img src="${photo.img_src}" alt="Mars photo">
        `;
    }
}

async function loadPhotos() {
    const photos = await fetchPhotos(currentDate, currentPage);
    renderPhotos(photos);
    showDetails(photos[0].id);
}

document.getElementById("find-button").addEventListener("click", () => {
    const dateInput = document.getElementById("earth-date");
    currentDate = dateInput.value;
    currentPage = 1;
    loadPhotos();
});

document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadPhotos();
    }
});

document.getElementById("next-page").addEventListener("click", () => {
    currentPage++;
    loadPhotos();
});

loadPhotos();
