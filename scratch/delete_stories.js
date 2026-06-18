const fs = require("fs")
const path = require("path")

const contosDir = path.join(__dirname, "..", "content", "contos")

const filesToDelete = [
  "como-os-caes.md",
  "a-costura.md",
  "o-vaso.md",
  "o-diabo.md",
  "o-pecado-olavo-bilac.md",
  "a-enguia.md",
  "como-a-pescada.md",
  "o-defunto-olavo-bilac.md",
  "a-nota-de-cem-mil-reis.md",
  "denuncia-involuntaria.md",
  "o-paulo.md",
  "o-telefone.md",
  "a-mulher-de-pau.md",
  "julieta-a-janela.md",
  "o-gato-preto.md",
  "berenice.md",
]

let deletedCount = 0

filesToDelete.forEach(file => {
  const filePath = path.join(contosDir, file)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    console.log(`Deleted: ${file}`)
    deletedCount++
  } else {
    console.log(`File not found, skipped: ${file}`)
  }
})

console.log(
  `Done. Total deleted files: ${deletedCount}/${filesToDelete.length}`
)
