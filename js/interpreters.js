"use strict";

const container = document.querySelector("#interpreter-grid");

function displayInterpreters() {

    siteData.interpreters.forEach(function(interpreter) {

        const card = document.createElement("div");

        card.classList.add("profile-card");

        card.dataset.city = interpreter.city;
        card.dataset.mode = interpreter.mode;
        card.dataset.gender = interpreter.gender;
        card.dataset.date = interpreter.date;

        card.innerHTML = `
            <div class="card-head">
                <div class="avatar">
                    ${interpreter.initials}
                </div>

                <div>
                    <h3>${interpreter.name}</h3>
                    <span>Professional interpreter</span>
                </div>
            </div>

            <div class="card-info">
                <p><strong>Languages:</strong> ${interpreter.languages.join(", ")}</p>
                <p><strong>Speciality:</strong> ${interpreter.speciality}</p>
                <p><strong>Location:</strong> ${interpreter.city}</p>
                <p class="available">${interpreter.availability}</p>
            </div>

            <div class="card-buttons">
                <button class="outline-btn">View profile</button>
                <button class="main-btn">Send request</button>
            </div>
        `;

        container.appendChild(card);

    });

}

displayInterpreters();