const fs = require("fs")
const path = require("path")

const listPath = path.join(__dirname, "stories_list.json")
const stories = JSON.parse(fs.readFileSync(listPath, "utf8"))

stories.forEach(s => {
  if (s.author === "Olavo Bilac") {
    console.log(
      `- File: ${s.file} | Title: "${s.title}" | Snippet: ${s.snippet.substring(
        0,
        200
      )}...`
    )
  }
})
