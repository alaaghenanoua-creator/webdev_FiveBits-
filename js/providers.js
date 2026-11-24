"use strict";

const container = document.querySelector("#provider-grid");
const count = document.querySelector("#provider-count")
function displayProviders() {

    siteData.providers.forEach(function(provider) {

        const card = document.createElement("div");

        card.classList.add("profile-card");
        card.classList.add("provider-card")

        card.dataset.city = provider.city;
        card.dataset.category = provider.category;
        card.dataset.mode = provider.mode;

        card.innerHTML = `
            <div class="card-head">
                <div class="avatar">
                    ${provider.initials}
                </div>

                <div>
                    <h3>${provider.name}</h3>
                    <span>Professional provider</span>
                </div>
            </div>

            <div class="card-info">
                <p><strong>Category:</strong> ${provider.category}</p>
                <p><strong>Services:</strong> ${provider.services.join(", ")}</p>
                <p><strong>Location:</strong> ${provider.city}</p>
                <p class="available">${provider.availability}</p>
            </div>

            <div class="card-buttons">
                <button class="outline-btn">View profile</button>
                <button class="main-btn">Send request</button>
            </div>
        `;

        container.appendChild(card);

    });

}

displayProviders();