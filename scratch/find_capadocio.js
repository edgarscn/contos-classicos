const fs = require("fs");
const path = require("path");

const contosDir = path.join(__dirname, "..", "content", "contos");

const files = fs.readdirSync(contosDir).filter(file => file.endsWith(".md"));

console.log("Checking for 'Capadocio Maluco' contos:");
files.forEach(file => {
  const filePath = path.join(contosDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  
  const authorMatch = content.match(/author:\s*["']?([^"\n'\r]+)["']?/);
  if (authorMatch) {
    const author = authorMatch[1].trim();
    if (author.toLowerCase().includes("capadocio")) {
      console.log(`- File: ${file}`);
      console.log(`  Title: ${content.match(/title:\s*["']?([^"\n'\r]+)["']?/)?.[1]}`);
      console.log(`  Author: ${author}`);
      console.log(`  Snippet: ${content.split("\n").slice(7, 10).join("\n").substring(0, 300)}...`);
      console.log("---");
    }
  }
});
