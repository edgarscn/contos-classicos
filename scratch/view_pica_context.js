const fs = require("fs");
const path = require("path");

const contosDir = path.join(__dirname, "..", "content", "contos");

const checkContext = (file) => {
  const filePath = path.join(contosDir, file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  console.log(`Context in ${file}:`);
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes("pica")) {
      console.log(`L${idx + 1}: ${line.trim()}`);
    }
  });
  console.log("------------------------");
};

checkContext("a-feiticeira-afonso-arinos.md");
checkContext("contos-gauchescos-1912no-manantial.md");
