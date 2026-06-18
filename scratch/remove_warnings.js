const fs = require("fs")
const path = require("path")

const dir = "content/contos"

const warningPatterns = [
  "Todas as obras escritas por autores brasileiros falecidos até 31 de dezembro de 1935",
  "Todas as obras publicadas antes de 1.º de janeiro de 1931",
  "A informação acima será válida apenas para usos nos Estados Unidos",
  "Utilize esta marcação apenas se não for possível apresentar outro raciocínio",
]

if (fs.existsSync(dir)) {
  let count = 0
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith(".md")) {
      const filePath = path.join(dir, file)
      const content = fs.readFileSync(filePath, "utf8")

      const lines = content.split(/\r?\n/)
      let cleanedLines = []
      let skipEmpty = false
      let modified = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // Check if the line matches any of the warning patterns
        const isWarning = warningPatterns.some(p => line.includes(p))

        if (isWarning) {
          modified = true
          // If we skip a warning line, we can also skip a following empty line
          skipEmpty = true
        } else {
          if (skipEmpty && line === "") {
            // Skip the blank line right after a warning to avoid extra spacing
            skipEmpty = false
          } else {
            cleanedLines.push(lines[i])
            skipEmpty = false
          }
        }
      }

      if (modified) {
        // Remove trailing empty lines or fix spacing at the start of body
        let text = cleanedLines.join("\n")

        // If there are multiple consecutive blank lines at the start of the body, collapse them
        text = text.replace(/---\n\n\n+/g, "---\n\n")

        fs.writeFileSync(filePath, text, "utf8")
        count++
      }
    }
  })
  console.log(`Successfully removed license warnings from ${count} files.`)
} else {
  console.error("Directory not found:", dir)
}
