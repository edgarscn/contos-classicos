const fs = require("fs")
const path = require("path")

const dir = "content/contos"
const results = []

if (fs.existsSync(dir)) {
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith(".md")) {
      const content = fs.readFileSync(path.join(dir, file), "utf8")
      const titleMatch = content.match(/title:\s*["']?([^"\n'\r]+)["']?/)
      const authorMatch = content.match(/author:\s*["']?([^"\n'\r]+)["']?/)
      const yearMatch = content.match(/year:\s*["']?([^"\n'\r]+)["']?/)

      const title = titleMatch ? titleMatch[1].trim() : ""
      const author = authorMatch ? authorMatch[1].trim() : ""
      const year = yearMatch ? yearMatch[1].trim() : ""

      if (year.toLowerCase().includes("desconhecido") || !year) {
        results.push({ file, title, author, year })
      }
    }
  })
  fs.writeFileSync(
    "scratch/desconhecidos.json",
    JSON.stringify(results, null, 2)
  )
  console.log(
    `Found ${results.length} files with unknown years. Saved to scratch/desconhecidos.json`
  )
} else {
  console.error("Directory not found:", dir)
}
