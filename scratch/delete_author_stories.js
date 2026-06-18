const fs = require("fs")
const path = require("path")

const contosDir = path.join(__dirname, "..", "content", "contos")

const targetAuthors = [
  "humberto de campos",
  "artur de azevedo",
  "artur azevedo",
  "arthur azevedo",
]

let deletedCount = 0
let totalFilesChecked = 0

fs.readdir(contosDir, (err, files) => {
  if (err) {
    console.error("Error reading contos directory:", err)
    process.exit(1)
  }

  const markdownFiles = files.filter(file => file.endsWith(".md"))

  markdownFiles.forEach(file => {
    totalFilesChecked++
    const filePath = path.join(contosDir, file)
    const content = fs.readFileSync(filePath, "utf-8")

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---/)
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1]

      // Parse author from frontmatter
      const authorMatch = frontmatter.match(
        /author:\s*["']?([\s\S]+?)["']?\r?\n/
      )
      if (authorMatch) {
        const author = authorMatch[1].trim().toLowerCase()

        const shouldDelete = targetAuthors.some(
          target => author === target || author.includes(target)
        )
        if (shouldDelete) {
          fs.unlinkSync(filePath)
          console.log(`Deleted: ${file} (Author: "${authorMatch[1].trim()}")`)
          deletedCount++
        }
      }
    }
  })

  console.log("\n----------------------------------------")
  console.log(`Scan completed.`)
  console.log(`Total markdown files checked: ${totalFilesChecked}`)
  console.log(`Total files deleted: ${deletedCount}`)
  console.log("----------------------------------------\n")
})
