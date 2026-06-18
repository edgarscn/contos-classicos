const fs = require("fs")
const path = require("path")

const listPath = path.join(__dirname, "stories_list.json")
const stories = JSON.parse(fs.readFileSync(listPath, "utf8"))

const targetAuthors = [
  "Edgar Allan Poe",
  "João do Rio",
  "Olavo Bilac",
  "Lima Barreto",
]

stories.forEach(s => {
  if (targetAuthors.includes(s.author)) {
    console.log(
      `- File: ${s.file} | Title: "${s.title}" | Author: ${
        s.author
      } | Snippet: ${s.snippet.substring(0, 150)}...`
    )
  }
})
