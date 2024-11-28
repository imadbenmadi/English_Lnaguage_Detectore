const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default; // Import traverse separately
const fs = require("fs");
const path = require("path");

// Directory to scan (ensure this path is correct)
const reactProjectDir = path.join(
    "C:",
    "Users",
    "imadb",
    "OneDrive",
    "Bureau",
    "Scs_Siha",
    "siha-twasol-front"
);

// Check if the directory exists
if (fs.existsSync(reactProjectDir)) {
    console.log("Directory exists:", reactProjectDir);
    scanDirectory(reactProjectDir);
} else {
    console.error("Directory not found:", reactProjectDir);
}

// Recursively traverse the React project directory
function scanDirectory(dir) {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);

        // Skip node_modules directory
        if (file === "node_modules") {
            return;
        }

        if (fs.lstatSync(filePath).isDirectory()) {
            scanDirectory(filePath); // Recurse into subdirectories
        } else if (
            filePath.endsWith(".js") ||
            filePath.endsWith(".jsx") ||
            filePath.endsWith(".ts") ||
            filePath.endsWith(".tsx")
        ) {
            extractTextFromFile(filePath);
        }
    });
}

// Extract text from a JavaScript or JSX file
function extractTextFromFile(filePath) {
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
            if (/^[A-Za-z0-9.,!?()":;\'\-\s]+$/.test(text)) {
                console.log(`Found English text in ${filePath}: ${text}`);
            }
        },
    });
}
