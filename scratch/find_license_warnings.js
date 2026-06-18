const fs = require("fs")
const path = require("path")

const dir = "content/contos"
const warnings = new Set()

if (fs.existsSync(dir)) {
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith(".md")) {
      const content = fs.readFileSync(path.join(dir, file), "utf8")
      const parts = content.split("---")
      if (parts.length >= 3) {
        const body = parts.slice(2).join("---").trim()
        const paragraphs = body.split(/\r?\n\r?\n/)

        // Check the first 3 paragraphs for public domain/licensing markers
        for (let i = 0; i < Math.min(3, paragraphs.length); i++) {
          const p = paragraphs[i].trim()
          if (
            p.includes("domínio público") ||
            p.includes("Wikisource") ||
            p.includes("marcação apenas") ||
            p.includes("informação acima será válida")
          ) {
            warnings.add(p)
          }
        }
      }
    }
  })
  console.log("Distinct Warning Paragraphs Found:")
  Array.from(warnings).forEach((w, index) => {
    console.log(`\n[${index + 1}]:\n${w}\n-------------------`)
  })
} else {
  console.error("Directory not found:", dir)
}
