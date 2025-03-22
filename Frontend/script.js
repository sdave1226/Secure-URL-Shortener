document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();

    document.getElementById("shorten-btn").addEventListener("click", function () {
        const longUrl = document.getElementById("long-url").value;

        if (!longUrl) {
            alert("Please enter a valid URL");
            return;
        }

        const shortUrl = "short.link/" + Math.random().toString(36).substring(7);
        const urlList = document.getElementById("url-list");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><a href="${longUrl}" target="_blank">${longUrl}</a></td>
            <td><a href="${shortUrl}" target="_blank">${shortUrl}</a></td>
            <td>0</td>
            <td><button class="delete-btn">Delete</button></td>
        `;
        urlList.appendChild(row);
        document.getElementById("long-url").value = '';

        row.querySelector(".delete-btn").addEventListener("click", function () {
            row.remove();
        });
    });
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (isLoggedIn) {
        document.getElementById("landing-page").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
        document.getElementById("nav-auth").classList.add("hidden");
        document.getElementById("nav-dashboard").classList.remove("hidden");
    } else {
        document.getElementById("landing-page").classList.remove("hidden");
        document.getElementById("dashboard").classList.add("hidden");
        document.getElementById("nav-auth").classList.remove("hidden");
        document.getElementById("nav-dashboard").classList.add("hidden");
    }
}

function login() {
    localStorage.setItem("loggedIn", "true");
    checkLoginStatus();
}

function logout() {
    localStorage.removeItem("loggedIn");
    checkLoginStatus();
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const urlInput = document.getElementById("url");
    const shortenButton = document.getElementById("shorten");
    const urlList = document.getElementById("url-list");
    const message = document.getElementById("message");
    const userEmail = document.getElementById("user-email");
    const logoutButton = document.getElementById("logout");
    const yearSpan = document.getElementById("year");
    yearSpan.textContent = new Date().getFullYear();

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
        window.location.href = "/login";
    } else {
        userEmail.textContent = JSON.parse(storedUser).email;
    }

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    });

    shortenButton.addEventListener("click", () => {
        const url = urlInput.value.trim();
        if (!url) {
            message.textContent = "Please enter a URL.";
            return;
        }

        const shortId = Math.random().toString(36).substring(2, 8);
        const newUrl = {
            id: shortId,
            originalUrl: url,
            shortUrl: `short.link/${shortId}`,
            clicks: 0,
        };

        let urls = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
        urls.unshift(newUrl);
        localStorage.setItem("shortenedUrls", JSON.stringify(urls));
        renderUrls();
        urlInput.value = "";
        message.textContent = "URL shortened successfully!";
    });

    function renderUrls() {
        urlList.innerHTML = "";
        const urls = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
        urls.forEach((url) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><a href="${url.originalUrl}" target="_blank">${url.originalUrl}</a></td>
                <td>${url.shortUrl}</td>
                <td>${url.clicks}</td>
                <td><button onclick="copyToClipboard('${url.shortUrl}')">Copy</button></td>
            `;
            urlList.appendChild(row);
        });
    }

    window.copyToClipboard = function (text) {
        navigator.clipboard.writeText(text);
        message.textContent = "Copied to clipboard!";
        setTimeout(() => (message.textContent = ""), 2000);
    };

    renderUrls();
});