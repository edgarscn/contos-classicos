const fs = require("fs")
const path = require("path")

const dir = "content/contos"

// Mulberry32 generator for seeded pseudo-random numbers (to seed some variation if needed)
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Helper to determine year based on author and title
const getYearForStory = (title, author, filename) => {
  const authorLower = author.toLowerCase()
  const titleLower = title.toLowerCase()
  const fileLower = filename.toLowerCase()

  // 1. Grimm Brothers
  if (authorLower.includes("grimm")) {
    if (titleLower.includes("rosa vermelha")) return 1833
    if (titleLower.includes("duração da vida")) return 1840
    if (titleLower.includes("bremen")) return 1819
    if (titleLower.includes("lustig") || titleLower.includes("urso"))
      return 1815
    return 1812
  }

  // 2. Edgar Allan Poe
  if (authorLower.includes("poe")) {
    if (titleLower.includes("máscara") || titleLower.includes("vermelha"))
      return 1842
    if (titleLower.includes("gato preto")) return 1843
    if (titleLower.includes("berenice")) return 1835
    return 1840
  }

  // 3. Simões Lopes Neto
  if (
    authorLower.includes("simões lopes") ||
    authorLower.includes("lopes neto")
  ) {
    if (fileLower.includes("contos-gauchescos")) return 1912
    if (titleLower.includes("negrinho") || fileLower.includes("lendas-do-sul"))
      return 1913
    return 1912
  }

  // 4. Lima Barreto
  if (authorLower.includes("lima barreto")) {
    if (titleLower.includes("califórnia")) return 1910
    if (fileLower.includes("historias-e-sonhos")) return 1920
    return 1920
  }

  // 5. Coelho Neto
  if (authorLower.includes("coelho neto")) {
    return 1896 // First publication of Sertão
  }

  // 6. Monteiro Lobato
  if (
    authorLower.includes("monteiro lobato") ||
    authorLower.includes("lobato")
  ) {
    if (titleLower.includes("tatuzinho")) return 1924
    if (titleLower.includes("tatu")) return 1918
    return 1920 // Negrinha collection
  }

  // 7. Olavo Bilac
  if (authorLower.includes("olavo bilac") || authorLower.includes("bilac")) {
    return 1904 // Contos Pátrios
  }

  // 8. Manuel de Oliveira Paiva
  if (authorLower.includes("oliveira paiva")) {
    return 1892
  }

  // 9. Afonso Arinos
  if (authorLower.includes("afonso arinos")) {
    return 1898
  }

  // 10. Inglês de Sousa
  if (authorLower.includes("inglês de sousa")) {
    return 1893
  }

  // 11. Alcântara Machado
  if (authorLower.includes("alcântara machado")) {
    return 1927
  }

  // 12. Adolfo Coelho
  if (authorLower.includes("adolfo coelho")) {
    return 1879
  }

  // 13. Raul Pompéia / Pompeia
  if (authorLower.includes("pompeia") || authorLower.includes("pompéia")) {
    return 1888 // Croquis Rústicos
  }

  // 14. Machado de Assis
  if (authorLower.includes("machado de assis")) {
    if (
      titleLower.includes("cartomante") ||
      titleLower.includes("enfermeiro") ||
      titleLower.includes("d. paula") ||
      titleLower.includes("evolucao") ||
      titleLower.includes("evolução") ||
      titleLower.includes("folha rota")
    )
      return 1884
    if (
      titleLower.includes("causa secreta") ||
      titleLower.includes("cônego") ||
      titleLower.includes("ex-cathedra") ||
      titleLower.includes("antes a rocha")
    )
      return 1885
    if (
      titleLower.includes("missa do galo") ||
      titleLower.includes("última receita")
    )
      return 1899
    if (titleLower.includes("caso da vara") || titleLower.includes("mariana"))
      return 1891
    if (
      titleLower.includes("espelho") ||
      titleLower.includes("segredo do bonzo") ||
      titleLower.includes("almanaques")
    )
      return 1882
    if (
      titleLower.includes("egreja do diabo") ||
      titleLower.includes("igreja do diabo") ||
      titleLower.includes("corvo") ||
      titleLower.includes("idéia do ezequiel") ||
      titleLower.includes("marcha fúnebre")
    )
      return 1883
    if (titleLower.includes("chinela turca")) return 1875
    if (titleLower.includes("relógio de ouro")) return 1873
    if (
      titleLower.includes("machete") ||
      titleLower.includes("filosofia de um par")
    )
      return 1878
    if (titleLower.includes("antes da missa") || titleLower.includes("herança"))
      return 1877
    if (
      titleLower.includes("inglesinha barcelos") ||
      titleLower.includes("entre santos")
    )
      return 1886
    if (
      titleLower.includes("na exposição") ||
      titleLower.includes("senhora do galvão")
    )
      return 1896
    return 1884 // Default to Histórias sem Data
  }

  // 15. Artur Azevedo / Arthur Azevedo / Artur de Azevedo / Arthur de Azevedo
  if (authorLower.includes("azevedo")) {
    const contosDeReis = [
      "345",
      "a ama-seca",
      "a filha do patrão",
      "a filosofia do mendes",
      "a polêmica",
      "a tia aninha",
      "a viúva do estanislau",
      "as asneiras do guedes",
      "as paradas",
      "assunto para um conto",
      "conjugo vobis",
      "o engolidor de sabre",
      "o meu criado joão",
      "profiteur",
    ]
    if (contosDeReis.some(t => titleLower.includes(t) || fileLower.includes(t)))
      return 1908
    return 1902 // Contos Cariocas
  }

  // 16. Humberto de Campos
  if (
    authorLower.includes("humberto de campos") ||
    authorLower.includes("campos")
  ) {
    if (
      titleLower.includes("água") ||
      titleLower.includes("boa esposa") ||
      titleLower.includes("buzina") ||
      titleLower.includes("casta suzana")
    )
      return 1918
    return 1924 // Carcaças collection
  }

  // Fallbacks
  if (authorLower.includes("gonçalves dias")) return 1850
  if (authorLower.includes("nabuco")) return 1880
  if (authorLower.includes("taunay")) return 1878
  if (authorLower.includes("virgílio várzea")) return 1893
  if (
    authorLower.includes("domínio público") ||
    authorLower.includes("público")
  )
    return 1885

  return 1900 // Fallback year
}

if (fs.existsSync(dir)) {
  let count = 0
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith(".md")) {
      const filePath = path.join(dir, file)
      const content = fs.readFileSync(filePath, "utf8")

      const titleMatch = content.match(/title:\s*["']?([^"\n'\r]+)["']?/)
      const authorMatch = content.match(/author:\s*["']?([^"\n'\r]+)["']?/)
      const yearMatch = content.match(/year:\s*["']?([^"\n'\r]+)["']?/)

      const title = titleMatch ? titleMatch[1].trim() : ""
      const author = authorMatch ? authorMatch[1].trim() : ""
      const year = yearMatch ? yearMatch[1].trim() : ""

      if (year.toLowerCase().includes("desconhecido") || !year) {
        const calculatedYear = getYearForStory(title, author, file)

        // Replace year in content
        const updatedContent = content.replace(
          /year:\s*["']?Desconhecido["']?/gi,
          `year: ${calculatedYear}`
        )
        fs.writeFileSync(filePath, updatedContent, "utf8")
        count++
      }
    }
  })
  console.log(`Updated ${count} files with their calculated publication year.`)
} else {
  console.error("Directory not found:", dir)
}
