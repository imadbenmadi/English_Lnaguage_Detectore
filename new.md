Here's a complete **Node.js** project setup that uses **Express**, **Formidable**, and **Babel** for detecting English text in files uploaded from a directory (such as a React project directory). This project structure includes both the **back-end** and **front-end** components.

### Full Project Setup

#### 1. Project Directory Structure

```
/english-detector
│
├── /node_modules         # Node modules (after installation)
├── /public               # Front-end assets (HTML, CSS, JS)
│   ├── index.html        # Front-end HTML
│   ├── script.js         # Front-end JavaScript
│   └── styles.css        # CSS styles
├── /uploads              # Temporary folder to store uploaded files
├── server.js             # Express server with Formidable
├── tester.js             # Script to process uploaded JS/TS files
├── package.json          # Project dependencies and scripts
└── .gitignore            # Ignore node_modules and uploads
```

#### 2. Install Dependencies

Make sure you have **Node.js** installed. Then, run the following commands to initialize your project and install the necessary dependencies.

```bash
# Initialize the project
npm init -y

# Install required packages
npm install express formidable @babel/parser @babel/traverse
```

#### 3. `server.js` (Backend - Express with Formidable)

This file sets up your **Express** server and handles file uploads using **Formidable**.

```javascript
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
```

#### 4. `tester.js` (Backend - Babel Processing)

This script scans JavaScript or TypeScript files to extract **English text** using **Babel** and **Babel Traverse**.

```javascript
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;
const fs = require("fs");
const path = require("path");

// Get file path from command line argument
const filePath = process.argv[2];

if (!filePath) {
    console.error("No file path provided!");
    process.exit(1);
}

const code = fs.readFileSync(filePath, "utf-8");
const ast = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"], // Enable JSX parsing
});

// Traverse the AST to find string literals
babelTraverse(ast, {
    StringLiteral(path) {
        const text = path.node.value;
        // Only log English text (basic check for English characters)
        if (/^[A-Za-z0-9.,!?()":;'\-\s]+$/.test(text)) {
            console.log(`Found English text in ${filePath}: ${text}`);
        }
    },
});
```

#### 5. `public/index.html` (Frontend - HTML)

This file provides the user interface for selecting a directory of files to upload.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>English Language Detector</title>
        <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
        <div class="container">
            <h1>English Language Detector</h1>
            <form id="directoryForm">
                <input
                    type="file"
                    id="directoryInput"
                    webkitdirectory
                    directory
                    multiple
                />
                <button type="submit">Detect English Text</button>
            </form>
            <div id="result"></div>
        </div>

        <script src="/script.js"></script>
    </body>
</html>
```

#### 6. `public/script.js` (Frontend - JavaScript)

This script sends the uploaded files to the server for processing.

```javascript
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
```

#### 7. `public/styles.css` (Frontend - CSS)

Add some basic styling to make the UI look better.

```css
body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f4f4f9;
}

.container {
    text-align: center;
}

form {
    margin-bottom: 20px;
}

#directoryInput {
    margin: 10px 0;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
}

button:hover {
    background-color: #45a049;
}

#result {
    margin-top: 20px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    max-width: 80%;
    margin: 20px auto;
}
```

#### 8. `.gitignore` (Optional - Ignore Unwanted Files)

Add a `.gitignore` file to avoid committing unwanted files.

```
node_modules/
uploads/
```

---

### How to Run the Project

1. **Install dependencies**:
   If you haven't done it already, run the following command in the root of the project to install all dependencies:

    ```bash
    npm install
    ```

2. **Run the server**:
   You can start the server using the following command:

    ```bash
    node server.js
    ```

3. **Access the application**:
   Open a browser and navigate to `http://localhost:3000`. You should see the user interface where you can select a directory containing React project files (or any other JavaScript/TypeScript files). The backend will process these files and output any detected English text.

---

### Final Notes:

-   **Formidable** is used for handling the directory uploads and saving files temporarily in the `uploads/` folder.
-   The **server** processes the files using **Babel** to extract English text from JavaScript/TypeScript files.
-   The **front-end** provides a simple UI to allow users to select a folder, and it displays the result of the text analysis.

This setup should meet your needs to create a simple **English language detector** for React (or other JavaScript/TypeScript) files. Let me know if you need any more clarifications!
