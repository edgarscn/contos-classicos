const fs = require("fs")
const path = require("path")

const listPath = path.join(__dirname, "stories_list.json")
const stories = JSON.parse(fs.readFileSync(listPath, "utf8"))

const darkKeywords = [
  "suicidio",
  "suicídio",
  "assassinato",
  "homicidio",
  "assassino",
  "enforcar",
  "enforcado",
  "enforcamento",
  "veneno",
  "envenenado",
  "envenenar",
  "cynico",
  "cínico",
  "humor negro",
]

const candidates = []

stories.forEach(s => {
  const text = (s.title + " " + s.category + " " + s.snippet).toLowerCase()
  const matched = darkKeywords.filter(kw => text.includes(kw))
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

console.log(`Found ${candidates.length} dark candidate stories.`)
candidates.forEach(c => {
  console.log(
    `- File: ${c.file} | Title: "${c.title}" | Author: ${
      c.author
    } | Matched: ${c.matched.join(", ")}`
  )
})
