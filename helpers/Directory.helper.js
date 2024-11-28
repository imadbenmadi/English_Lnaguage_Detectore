const fs = require("fs");
const path = require("path");

const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const initializeDirectories = () => {
    const directories = [
        // "public/Courses_Pictures",
        // "public/Courses_Videos",
        // "public/Payment",
        // "public/ProfilePics",
        // "public/Summaries",
        // "public/Summaries_Pictures",
    ];

    directories.forEach((dir) => {
        ensureDirectoryExists(path.join(__dirname, "../", dir));
    });
};

module.exports = { initializeDirectories };
