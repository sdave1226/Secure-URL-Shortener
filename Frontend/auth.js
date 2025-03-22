// document.addEventListener("DOMContentLoaded", () => {
//     const loginForm = document.getElementById("login-form");
//     const registerForm = document.getElementById("register-form");

//     if (loginForm) {
//         loginForm.addEventListener("submit", async function (event) {
//             event.preventDefault();

//             const username = document.getElementById("username").value;
//             const password = document.getElementById("password").value;

//             try {
//                 const response = await fetch("http://localhost/shortener/backend/login.php", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ username, password }),
//                     credentials: "include"
//                 });

//                 const result = await response.json();
//                 if (result.success) {
//                     alert("Login successful!");
//                     window.location.href = "index.html"; // Redirect to main page
//                 } else {
//                     alert(result.error || "Invalid credentials");
//                 }
//             } catch (error) {
//                 console.error("Login error:", error);
//             }
//         });
//     }

//     if (registerForm) {
//         registerForm.addEventListener("submit", async function (event) {
//             event.preventDefault();

//             const username = document.getElementById("new-username").value;
//             const password = document.getElementById("new-password").value;

//             try {
//                 const response = await fetch("http://localhost/shortener/backend/register.php", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ username, password })
//                 });

//                 const result = await response.json();
//                 if (result.success) {
//                     alert("Registration successful! Please log in.");
//                     window.location.href = "login.html"; // Redirect to login page
//                 } else {
//                     alert(result.error || "Registration failed");
//                 }
//             } catch (error) {
//                 console.error("Registration error:", error);
//             }
//         });
//     }
// });

document.addEventListener("DOMContentLoaded", async () => {
    const shortenForm = document.getElementById("shorten-form");
    const logoutBtn = document.getElementById("logout-btn");

    try {
        const response = await fetch("http://localhost/shortener/backend/check_session.php", {
            credentials: "include"
        });
        const result = await response.json();

        if (result.logged_in) {
            document.querySelector(".auth-buttons").style.display = "none"; // Hide login/register
            shortenForm.style.display = "block"; // Show URL shortener
            logoutBtn.style.display = "inline-block"; // Show logout button
        } else {
            shortenForm.style.display = "none"; // Hide form if not logged in
        }
    } catch (error) {
        console.error("Session check error:", error);
    }

    logoutBtn.addEventListener("click", async () => {
        await fetch("http://localhost/shortener/backend/logout.php", {
            credentials: "include"
        });
        window.location.reload(); // Refresh page after logout
    });
});
