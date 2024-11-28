document
    .getElementById("directoryForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData();
        const files = document.getElementById("directoryInput").files;

        // Append each file in the selected directory to FormData
        for (let file of files) {
            formData.append("files", file);
        }

        fetch("/detect", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("result").innerHTML = data.message;
            })
            .catch((error) => console.error("Error:", error));
    });