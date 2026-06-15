const fs = require("fs")
const path = require("path")

const dir = "content/contos"
const authors = new Set()

if (fs.existsSync(dir)) {
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith(".md")) {
      const content = fs.readFileSync(path.join(dir, file), "utf8")
      const match = content.match(/author:\s*["']?([^"\n'\r]+)["']?/)
      if (match) {
        authors.add(match[1].trim())
      }
    }
  })
  console.log(JSON.stringify(Array.from(authors).sort(), null, 2))
} else {
  console.error("Directory not found:", dir)
}
