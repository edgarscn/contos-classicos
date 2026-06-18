const fs = require("fs")
const path = require("path")

const listPath = path.join(__dirname, "stories_list.json")
const stories = JSON.parse(fs.readFileSync(listPath, "utf8"))

// Strict filter
const strictKeywords = [
  "libidinoso",
  "luxuria",
  "devassa",
  "lascivia",
  "luxurioso",
  "amante",
  "trai",
  "pecado",
  "sensual",
  "infiel",
  "erot",
  "sexo",
]

const candidates = []

stories.forEach(s => {
  const text = (s.title + " " + s.category + " " + s.snippet).toLowerCase()
  const matched = strictKeywords.filter(kw => text.includes(kw))
  if (matched.length > 0) {
    candidates.push({
      file: s.file,
      title: s.title,
      author: s.author,
      matched,
      snippet: s.snippet,
    })
  }
})

console.log(
  `Found ${candidates.length} candidate stories. Saving to strict_candidates.json`
)
fs.writeFileSync(
  path.join(__dirname, "strict_candidates.json"),
  JSON.stringify(candidates, null, 2),
  "utf8"
)
candidates.forEach(c => {
  console.log(
    `- File: ${c.file} | Title: "${c.title}" | Author: ${
      c.author
    } | Matched: ${c.matched.join(", ")}`
  )
})
