const fs = require("fs");
const path = require("path");

const contosDir = path.join(__dirname, "..", "content", "contos");
const targetFile = path.join(contosDir, "o-menino-do-gouveia.md");

if (fs.existsSync(targetFile)) {
  fs.unlinkSync(targetFile);
  console.log("Successfully deleted: o-menino-do-gouveia.md");
} else {
  console.log("File o-menino-do-gouveia.md not found, already deleted or moved.");
}

// Search for any other files matching "capadocio"
const files = fs.readdirSync(contosDir).filter(file => file.endsWith(".md"));
let foundOthers = 0;

files.forEach(file => {
  const filePath = path.join(contosDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  if (content.toLowerCase().includes("capadocio")) {
    console.log(`Found mention in: ${file}`);
    foundOthers++;
  }
});

console.log(`Search completed. Other files with 'capadocio' mentions: ${foundOthers}`);
