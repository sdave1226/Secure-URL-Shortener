document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    setupEventListeners();

    const getStartedBtn = document.getElementById("get-started-btn");
    if (getStartedBtn) {
        getStartedBtn.addEventListener("click", getStarted);
    }
});

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (isLoggedIn) {
        document.getElementById("nav-auth").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
    } else {
        document.getElementById("nav-auth").classList.remove("hidden");
        if (document.getElementById("dashboard")) {
            document.getElementById("dashboard").classList.add("hidden");
        }
    }
}

// Setup event listeners for buttons
function setupEventListeners() {
    // Registration form submission
    const registerForm = document.querySelector(".register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            registerUser();
        });
    }

    // Login form submission
    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            loginUser();
        });
    }

    // Shorten URL button
    const shortenBtn = document.getElementById("shorten-btn");
    if (shortenBtn) {
        shortenBtn.addEventListener("click", shortenUrl);
    }

}

// Shorten URL
function shortenUrl() {
    const longUrl = document.getElementById("long-url").value;
    if (!longUrl.trim()) {
        alert("Please enter a valid URL");
        return;
    }

    fetch("backend/shorten.php", {
        method: "POST",
        body: JSON.stringify({ longUrl }),
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                addUrlToTable(data.longUrl, data.shortUrl, data.clicks);
                document.getElementById("long-url").value = "";
            } else {
                alert("Error: " + data.message);
            }
        });
}

// Add shortened URL to table
function addUrlToTable(longUrl, shortUrl, clicks) {
    const tbody = document.getElementById("url-list");

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><a href="${longUrl}" target="_blank">${longUrl}</a></td>
        <td><a href="#" onclick="redirectTo('${shortUrl}', '${longUrl}')">${shortUrl}</a></td>
        <td>${clicks}</td>
        <td>
            <button class="copy-btn" onclick="copyToClipboard('${shortUrl}')">📋 Copy</button>
            <button class="delete-btn" onclick="deleteUrl('${shortUrl}', this)">🗑 Delete</button>
        </td>
    `;
    tbody.appendChild(tr);
}

// Copy short URL to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Short URL copied to clipboard!");
    });
}

// Redirect user and track clicks
function redirectTo(shortUrl, longUrl) {
    fetch(`backend/track.php?shortUrl=${shortUrl}`)
        .then(() => {
            window.open(longUrl, "_blank");
        });
}

// Delete URL
function deleteUrl(shortUrl, btn) {
    fetch("backend/delete.php", {
        method: "POST",
        body: JSON.stringify({ shortUrl }),
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                btn.parentElement.parentElement.remove();
            } else {
                alert("Error: " + data.message);
            }
        });
}
