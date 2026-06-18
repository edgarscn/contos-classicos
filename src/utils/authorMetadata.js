// Local biographical database for classic authors to provide reading context
const AUTHOR_BIOS = {
  "machado de assis":
    "Joaquim Maria Machado de Assis (1839–1908) é amplamente considerado o maior nome da literatura brasileira. Escreveu em praticamente todos os gêneros literários, sendo um mestre da ironia, da análise psicológica e da crítica social sutil. Seus contos costumam investigar a ambiguidade da alma humana, as convenções da sociedade carioca do século XIX e o ceticismo filosófico.",

  "edgar allan poe":
    "Edgar Allan Poe (1809–1849) foi um autor, poeta e editor norte-americano, consagrado como um dos pioneiros do conto moderno e o pai das histórias de detetive e do terror gótico. Sua obra é caracterizada por mistérios sombrios, explorações da loucura e da morte, e uma atmosfera densa e psicológica que influenciou profundamente a literatura mundial.",

  "lima barreto":
    "Afonso Henriques de Lima Barreto (1881–1922) foi um importante romancista e cronista brasileiro, cuja obra é marcada por uma forte crítica social, humor satírico e denúncia do preconceito racial e social no início da República. Utilizava uma linguagem coloquial e direta, retratando a vida dos subúrbios do Rio de Janeiro e as contradições da elite de sua época.",

  "cruz e sousa":
    "João da Cruz e Sousa (1861–1898) foi um dos maiores poetas do Simbolismo brasileiro, conhecido como o 'Dante Negro'. Sua prosa poética e contos introspectivos (como em 'Evocações') são marcados por uma profunda densidade espiritual, angústia existencial, musicalidade e obsessão pela cor branca e pela transcendência da dor.",

  "florbela espanca":
    "Florbela Espanca (1894–1930) foi uma das maiores figuras da poesia e prosa poética em língua portuguesa. Suas obras de caráter introspectivo, como 'As Mágoas do Amor', exploram a subjetividade feminina, a melancolia profunda, o amor apaixonado e a busca incansável por identidade e libertação emocional.",

  "liev tolstói":
    "Liev Tolstói (1828–1910) foi um dos maiores escritores da literatura russa e mundial. Além de seus grandes romances, escreveu parábolas simples e profundas focadas na moral cristã primitiva, na caridade, na virtude, no desapego material e na busca sincera pela paz de espírito e pela verdade existencial.",

  "leo tolstoy":
    "Liev Tolstói (1828–1910) foi um dos maiores escritores da literatura russa e mundial. Além de seus grandes romances, escreveu parábolas simples e profundas focadas na moral cristã primitiva, na caridade, na virtude, no desapego material e na busca sincera pela paz de espírito e pela verdade existencial.",

  "irmaos grimm":
    "Jacob e Wilhelm Grimm foram acadêmicos, linguistas e folcloristas alemães do século XIX. Ficaram mundialmente conhecidos por coletar, compilar e publicar contos de fadas tradicionais alemães (como Cinderela, Branca de Neve e João e Maria), preservando a tradição oral e moldando a literatura infantil ocidental.",

  "irmãos grimm":
    "Jacob e Wilhelm Grimm foram acadêmicos, linguistas e folcloristas alemães do século XIX. Ficaram mundialmente conhecidos por coletar, compilar e publicar contos de fadas tradicionais alemães (como Cinderela, Branca de Neve e João e Maria), preservando a tradição oral e moldando a literatura infantil ocidental.",

  "monteiro lobato":
    "José Bento Monteiro Lobato (1882–1948) foi um influente escritor, editor e ensaísta brasileiro. Conhecido principalmente por sua revolucionária literatura infantil (como o Sítio do Picapau Amarelo), Lobato também foi um excelente contista adulto, retratando com crueza a realidade caipira do interior paulista, a decadência do café e o choque entre tradição e modernidade.",

  "joão do rio":
    "Paulo Barreto (1881–1921), sob o pseudônimo João do Rio, foi um célebre cronista, jornalista e tradutor carioca. Foi o grande retratista da 'Belle Époque' carioca, descrevendo tanto os salões aristocráticos quanto a boêmia, as ruas, os cortiços e os cultos populares do Rio de Janeiro, inovando na crônica moderna.",

  "raul pompeia":
    "Raul Pompeia (1863–1895) foi um escritor brasileiro, célebre pelo romance impressionista 'O Ateneu'. Sua escrita é densa, visualmente expressiva e carregada de análises psicológicas profundas. Seus contos e crônicas compartilham dessa intensidade emocional e espírito observador da sociedade.",

  "olavo bilac":
    "Olavo Bilac (1865–1918) foi um célebre poeta parnasiano, jornalista e inspetor de ensino brasileiro, conhecido como o 'Príncipe dos Poetas'. Além de sua poesia refinada e patriótica, Bilac escreveu contos e crônicas repletos de sensibilidade, linguagem polida e observações atentas sobre a evolução urbana do Rio de Janeiro.",

  "coelho neto":
    "Henrique Maximiano Coelho Neto (1864–1934) foi um prolífico escritor, teatrólogo e político brasileiro. Famoso por sua escrita rica e vocabulário extremamente vasto (característica da corrente neolatina), Coelho Neto transitou entre o realismo, simbolismo e regionalismo, criando contos fantásticos e narrativas folclóricas brasileiras.",

  "afonso arinos":
    "Afonso Arinos de Melo Franco (1868–1916) foi um jornalista, escritor e jurista brasileiro, pioneiro do regionalismo literário. Seus contos retratam com sensibilidade e autenticidade o interior do Brasil (especialmente o sertão de Minas Gerais), com sua fauna, flora, crendices populares e o linguajar caipira.",

  "alcântara machado":
    "Antônio Castilho de Alcântara Machado (1901–1935) foi um jornalista e escritor modernista brasileiro. Sua obra-prima 'Brás, Bexiga e Barra Funda' retrata com humor dinâmico, cortes cinematográficos e linguagem viva o cotidiano dos imigrantes italianos em São Paulo e sua integração na cultura brasileira.",

  alencar:
    "José de Alencar (1829–1877) foi um dos maiores expoentes do romantismo literário no Brasil, atuando como romancista, dramaturgo e político. Seus textos fundaram as bases da literatura nacional, buscando retratar o país sob vertentes indigenistas, históricas, urbanas e regionalistas, com rica expressividade poética.",

  "inglês de sousa":
    "Herculano Marcos Inglês de Sousa (1853–1918) foi um escritor e jornalista paraense, considerado um dos fundadores do naturalismo no Brasil. Seus contos ambientados na Amazônia (como em 'Contos de um Companheiro') registram de forma vívida e realista as lendas locais, a vida ribeirinha e o impacto da natureza sobre os homens.",

  "visconde de taunay":
    "Alfredo d'Escragnolle Taunay (1843–1899), o Visconde de Taunay, foi um nobre, político, militar e escritor brasileiro. Célebre pelo romance 'Inocência' e o relato 'A Retirada de Laguna', Taunay escreveu contos regionais e crônicas realistas e detalhadas, fruto de suas andanças pelo interior do Brasil durante a Guerra do Paraguai.",

  "joão simões lopes neto":
    "João Simões Lopes Neto (1865–1916) foi um escritor gaúcho, consagrado como o maior autor regionalista do Rio Grande do Sul. Suas obras, escritas na fala coloquial do gaúcho dos pampas, recuperam o folclore, as lendas (como o Negrinho do Pastoreio) e a alma heroica e melancólica do homem do campo.",

  "joaquim nabuco":
    "Joaquim Aurélio Barreto Nabuco de Araújo (1849–1910) foi um dos maiores intelectuais, diplomatas e políticos abolicionistas do Brasil. Sua produção escrita transita pela análise histórica, memórias primorosas e crônicas elegantes que analisam a transição social brasileira e a identidade nacional.",

  "adolfo coelho":
    "Francisco Adolfo Coelho (1847–1919) foi um pedagogo, filólogo e escritor português. Teve um papel proeminente na recolha de contos populares e folclore português, mapeando as tradições orais ibéricas e estruturando a educação infantil contemporânea em Portugal.",

  "padre manuel bernardes":
    "Padre Manuel Bernardes (1644–1710) foi um sacerdote e escritor espiritual português, mestre da prosa clássica da língua portuguesa. Em suas obras morais, como 'Nova Floresta', utiliza contos, fábulas e exemplos edificantes para ilustrar virtudes como a paciência, a temperança, a caridade e a retidão espiritual.",

  "legenda áurea":
    "A Legenda Áurea (ou Lenda Dourada) é uma compilação de vidas de santos e lendas hagiográficas reunidas pelo frei dominicano Jacopo de Varazze no século XIII. Tornou-se uma das obras mais populares da Idade Média, repleta de relatos sobre milagres, virtudes heroicas, martírios e piedade cristã.",

  fioretti:
    "Os Fioretti de São Francisco (Florinhas de São Francisco) é uma coleção clássica de lendas e anedotas populares sobre a vida de São Francisco de Assis e seus primeiros companheiros. Os relatos celebram a simplicidade franciscana, o amor por todas as criaturas, a perfeita alegria, a humildade e a virtude pura.",
}

// Returns paragraph for a specific author
export const getAuthorBio = authorName => {
  if (!authorName) return null
  const normalized = authorName.trim().toLowerCase()

  // Try matching directly
  if (AUTHOR_BIOS[normalized]) {
    return AUTHOR_BIOS[normalized]
  }

  // Try partial matching
  for (const key of Object.keys(AUTHOR_BIOS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return AUTHOR_BIOS[key]
    }
  }

  // Generic fallback for public domain authors
  return `${authorName} é um dos importantes nomes clássicos cujas obras compõem a nossa biblioteca. Seus contos e crônicas, agora em domínio público, continuam vivos como tesouros atemporais que moldaram a nossa língua e cultura literária.`
}
