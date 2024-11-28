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