document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    // Get form values
    const name = document.getElementById("name").value;
    const rollNumber = document.getElementById("rollNumber").value;
    const password = document.getElementById("password").value;

    // Send data to backend
    try {
        const response = await fetch("http://localhost:5000/register", {  // ✅ Use correct backend API URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, rollNumber, password }),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Student registered successfully!");
            document.getElementById("registrationForm").reset(); // Clear form
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the server.");
    }
});
