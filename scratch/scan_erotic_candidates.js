const fs = require("fs");
const path = require("path");

const contosDir = path.join(__dirname, "..", "content", "contos");
const files = fs.readdirSync(contosDir).filter(file => file.endsWith(".md"));

const eroticKeywords = [
  "enrabar", "enrabou", "enrabado", "caralho", "fodido", "foder", "fóda", "fódas", "puta", "puto", "putaria", 
  "pica", "piroca", "porra", "leitada", "esporradela", "conho", "cú", "cagueiro", "anus", "chupão"
];

console.log("Scanning for explicit/erotic content:");
let candidatesCount = 0;

files.forEach(file => {
  const filePath = path.join(contosDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Exclude newly added deep and virtuous stories
  if (file.includes("-raul-pompeia") || file.includes("-cruz-e-sousa") || file.includes("-florbela-espanca") ||
      file.includes("-liev-tolstoi") || file.includes("-fioretti") || file.includes("-legenda-aurea") ||
      file.includes("-padre-manuel-bernardes")) {
    return;
  }

  const foundKeywords = [];
  const words = content.toLowerCase().split(/[^a-zA-Záéíóúâêôãõç]+/);
  
  eroticKeywords.forEach(kw => {
    if (words.includes(kw)) {
      foundKeywords.push(kw);
    }
  });

  const authorMatch = content.match(/author:\s*["']?([^"\n'\r]+)["']?/);
  const author = authorMatch ? authorMatch[1].trim() : "Unknown";

  if (foundKeywords.length > 0 || author.toLowerCase().includes("capadocio")) {
    console.log(`- File: ${file}`);
    console.log(`  Title: ${content.match(/title:\s*["']?([^"\n'\r]+)["']?/)?.[1]}`);
    console.log(`  Author: ${author}`);
    console.log(`  Keywords found: ${foundKeywords.join(", ")}`);
    console.log("---");
    candidatesCount++;
  }
});

console.log(`Total candidates found: ${candidatesCount}`);
