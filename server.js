const express = require("express");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, "/public")));

// POST route to handle file uploads (directory selection)
app.post("/detect", (req, res) => {
    // Use Formidable to parse incoming form data
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "uploads"); // Temp directory for uploaded files
    form.keepExtensions = true; // Retain file extensions
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({ message: "Error parsing form data" });
        }

        // Get the uploaded files (from the 'files' field)
        const uploadedFiles = files.files; // This is an array of file objects
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        let detectedText = "";

        // Process each uploaded file (simulate directory scan)
        let promises = uploadedFiles.map((file) => {
            return new Promise((resolve, reject) => {
                exec(
                    `node tester.js ${file.filepath}`,
                    (err, stdout, stderr) => {
                        if (err) {
                            reject(`Error processing file: ${file.filepath}`);
                        } else {
                            detectedText += stdout + "\n"; // Append the result
                            resolve();
                        }
                    }
                );
            });
        });

        // Once all files are processed, send back the result
        Promise.all(promises)
            .then(() => {
                // Send the result back to the front-end
                res.json({
                    message: detectedText || "No English text detected.",
                });

                // Optional: Clean up uploaded files after processing
                uploadedFiles.forEach((file) => fs.unlinkSync(file.filepath));
            })
            .catch((error) => {
                res.status(500).json({ message: "Error processing files." });
            });
    });
});

// Root route to serve the index page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
