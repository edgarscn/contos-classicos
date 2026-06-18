const fs = require("fs")
const path = require("path")

const listPath = path.join(__dirname, "stories_list.json")
const stories = JSON.parse(fs.readFileSync(listPath, "utf8"))

// Group by category
const categories = {}
const authors = {}

stories.forEach(s => {
  categories[s.category] = (categories[s.category] || 0) + 1
  authors[s.author] = (authors[s.author] || 0) + 1
})

console.log("=== CATEGORIES ===")
console.log(categories)

console.log("\n=== AUTHORS (Top 30) ===")
const sortedAuthors = Object.entries(authors).sort((a, b) => b[1] - a[1])
console.log(sortedAuthors.slice(0, 30))

// Find potential mature/adult/humor negro candidates based on keywords
const keywords = [
  "sexo",
  "erot",
  "sensual",
  "bocage",
  "decameron",
  "cama",
  "despida",
  "nua",
  "nu ",
  "amante",
  "infiel",
  "trai",
  "pecado",
  "luxuria",
  "devassa",
  "lascivia",
  "luxurioso",
  "beijo",
  "abraço",
  "desejo",
  "humor negro",
  "cinico",
  "morte",
  "suicidio",
  "assassinato",
  "enforcado",
  "enforcamento",
  "boccaccio",
  "marguerite de navarre",
  "deameron",
  "heptameron",
  "machado de assis",
  "defeitos",
  "bocage",
  "marques de sade",
  "sade",
  "erotico",
  "obsceno",
  "pornografia",
  "lascivo",
  "libidinoso",
]

console.log("\n=== KEYWORD HITS ===")
const hits = []
stories.forEach(s => {
  const text = (s.title + " " + s.category + " " + s.snippet).toLowerCase()
  const matchedKeywords = keywords.filter(kw => text.includes(kw))
  if (matchedKeywords.length > 0) {
    hits.push({
      file: s.file,
      title: s.title,
      author: s.author,
      category: s.category,
      matched: matchedKeywords,
    })
  }
})

console.log(
  `Found ${hits.length} potential hits. Saving to potential_hits.json`
)
fs.writeFileSync(
  path.join(__dirname, "potential_hits.json"),
  JSON.stringify(hits, null, 2),
  "utf8"
)
