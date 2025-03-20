document.getElementById('shorten-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const longUrl = document.getElementById('long-url').value;
    
    const response = await 
    // fetch('http://localhost/Backend/shorten.php', {  // Adjust URL as needed
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ url: longUrl })
    // });
    fetch("http://localhost/Backend/shorten.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: longUrl })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error:", error));    

    if (!response.ok) {
        document.getElementById('shortened-url').innerHTML = "Error: " + response.statusText;
        return;
    }

    try {
        const result = await response.json();
        if (result.short_url) {
            document.getElementById('shortened-url').innerHTML = `Shortened URL: <a href="${result.short_url}" target="_blank">${result.short_url}</a>`;
        } else {
            document.getElementById('shortened-url').innerHTML = "Error shortening URL: " + result.error;
        }
    } catch (error) {
        document.getElementById('shortened-url').innerHTML = "Error processing response.";
    }
});
