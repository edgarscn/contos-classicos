const fs = require("fs")
const path = require("path")

const contosDir = path.join(__dirname, "..", "content", "contos")
const files = fs.readdirSync(contosDir)

const metadataList = []

files.forEach(file => {
  if (file.endsWith(".md")) {
    const filePath = path.join(contosDir, file)
    const content = fs.readFileSync(filePath, "utf8")

    // Simple frontmatter parser
    const fmMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---/)
    if (fmMatch) {
      const fmText = fmMatch[1]
      const metadata = { file }

      fmText.split("\n").forEach(line => {
        const parts = line.split(":")
        if (parts.length >= 2) {
          const key = parts[0].trim()
          const val = parts
            .slice(1)
            .join(":")
            .trim()
            .replace(/^["']|["']$/g, "")
          metadata[key] = val
        }
      })

      // Get a small snippet of the first few lines of content for review
      const bodyText = content.replace(/^---\r?\n[\s\S]+?\r?\n---/, "").trim()
      metadata.snippet = bodyText.substring(0, 300).replace(/\r?\n/g, " ")

      metadataList.push(metadata)
    }
  }
})

fs.writeFileSync(
  path.join(__dirname, "stories_list.json"),
  JSON.stringify(metadataList, null, 2),
  "utf8"
)
console.log(
  `Total stories found: ${metadataList.length}. Saved to stories_list.json`
)
