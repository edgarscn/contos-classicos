const fs = require("fs")
const path = require("path")

const contosDir = path.join(__dirname, "..", "content", "contos")

const stories = [
  {
    title: "As Três Perguntas",
    author: "Liev Tolstói",
    year: 1903,
    category: "Contos de virtudes",
    slug: "as-tres-perguntas-liev-tolstoi",
    content: `Um certo rei pensou que, se sempre soubesse a hora certa de começar tudo, se soubesse quem eram as pessoas certas para ouvir e quem evitar, e, acima de tudo, se sempre soubesse qual era o assunto mais importante a tratar, nunca falharia em nada. Para isso, prometeu uma grande recompensa a quem lhe ensinasse essas três coisas.

Muitos sábios vieram, mas deram respostas diferentes. O rei decidiu consultar um eremita que vivia numa floresta e era famoso por sua sabedoria. Ao chegar lá, o eremita estava cavando a terra. O rei fez as perguntas, mas o eremita nada respondeu, continuando a cavar. O rei, vendo-o cansado, ofereceu-se para ajudá-lo e cavou por horas.

Ao cair da tarde, um homem ferido saiu da floresta correndo em direção a eles, desmaiando de dor. O rei lavou e bandajou as feridas do homem até que ele recuperasse as forças. No dia seguinte, o homem revelou ser um inimigo do rei que viera para matá-lo, mas fora ferido pelos guardas. Grato pela salvação de sua vida, o homem pediu perdão e prometeu servi-lo fielmente.

O eremita então explicou ao rei: "Você já tem a resposta! O momento mais importante é o *agora*, pois é o único momento sobre o qual temos poder; a pessoa mais importante é aquela com quem você está no presente; e a ação mais importante é fazer o bem a essa pessoa, pois fomos enviados à vida apenas para isso."`,
  },
  {
    title: "Quanta Terra Precisa um Homem",
    author: "Liev Tolstói",
    year: 1886,
    category: "Contos de virtudes",
    slug: "quanta-terra-precisa-um-homem-liev-tolstoi",
    content: `Pahom era um camponês que trabalhava arduamente, mas que se queixava de não ter terra suficiente. Dizia que, se tivesse toda a terra que desejasse, não temeria nem o próprio diabo. O diabo, ouvindo isso por trás do forno, resolveu dar-lhe terras para depois cobrá-lo.

Pahom começou a comprar terras, mas sua ganância crescia a cada aquisição. Nunca estava satisfeito. Um dia, ouviu falar dos Bashkires, um povo simples que vendia terras férteis por quase nada. Ele viajou até eles. O chefe dos Bashkires propôs-lhe um negócio peculiar: "Por mil rublos, você pode ter toda a terra que conseguir contornar a pé num único dia, do nascer ao pôr do sol. Mas se não voltar ao ponto de partida antes que o sol se ponha, perderá o dinheiro e a terra."

No dia seguinte, Pahom começou a caminhar. A terra era tão fértil que ele quis abranger mais e mais, estendendo a caminhada. Quando percebeu que o sol estava se pondo, percebeu que estava longe demais. Começou a correr desesperadamente, o coração batendo com violência, os pés feridos, as forças se esgotando.

Pahom alcançou o ponto de partida no último instante, caindo morto de exaustão no chão. Seu servo pegou uma pá e cavou uma cova para sepultá-lo. A cova tinha apenas dois metros de comprimento — exatamente a quantidade de terra de que Pahom realmente precisava.`,
  },
  {
    title: "O Grão de Trigo",
    author: "Liev Tolstói",
    year: 1886,
    category: "Contos de virtudes",
    slug: "o-grao-de-trigo-liev-tolstoi",
    content: `Um dia, umas crianças encontraram numa ravina um objeto que parecia um grão de trigo, mas do tamanho de um ovo de galinha. Um viajante comprou-o e vendeu-o ao rei como uma curiosidade. O rei convocou os seus sábios para descobrir o que era aquilo, mas nenhum soube responder.

O rei ordenou que trouxessem o camponês mais velho do reino. Veio um velho muito fraco, andando com duas muletas, surdo e de vista cansada. Ele examinou o grão, mas não soube dizer nada, pois nunca vira trigo daquele tamanho. Sugeriu que chamassem seu pai.

O pai do velho camponês veio andando com apenas uma muleta, enxergava melhor e ouvia melhor que o filho. Mas também ele não soube responder, embora lembrasse de ter ouvido falar de trigo grande na sua infância. Sugeriu que chamassem seu pai.

Veio então o avô. Ele entrou andando firme, sem muletas, tinha os olhos brilhantes, a fala clara e ouvia perfeitamente. Ao ver o grão, reconheceu-o imediatamente: "Este é o trigo do meu tempo! No meu tempo, os homens viviam da lei de Deus. Cada um trabalhava na sua própria terra e ninguém cobiçava o alheio. O trigo crescia grande porque a terra não era comprada nem vendida, e o trabalho era abençoado pela partilha e pela paz. Vivíamos do nosso próprio esforço e não do suor dos outros."`,
  },
  {
    title: "Onde Está o Amor, Deus Está",
    author: "Liev Tolstói",
    year: 1885,
    category: "Contos de virtudes",
    slug: "onde-esta-o-amor-deus-esta-liev-tolstoi",
    content: `Martinho era um sapateiro viúvo que vivia numa pequena cave, cuja única janela dava para a rua. Ele perdera todos os seus filhos e caíra no desespero, até que um ancião lhe ensinou a ler os Evangelhos. A partir de então, sua vida transformou-se e ele passou a viver na paz e na retidão.

Uma noite, enquanto lia as escrituras, Martinho ouviu uma voz que lhe dizia: "Martinho, olhe para a rua amanhã, pois eu irei visitar-te." No dia seguinte, Martinho ficou atento à janela.

De manhã, viu um velho soldado limpando a neve, cansado e com frio. Martinho chamou-o para dentro, deu-lhe chá quente e aqueceu-o. Mais tarde, viu uma mulher pobre com um bebê nos braços, sem roupas adequadas para o frio. Chamou-a, alimentou-a, deu-lhe uma capa velha e dinheiro. Depois, viu um rapaz tentando roubar uma maçã de uma velhinha; Martinho correu para a rua, pagou a maçã, reconciliou os dois e fez o rapaz ajudar a velha a carregar o cesto.

Ao cair da noite, Martinho perguntou-se se a promessa falhara. De repente, figuras surgiram no canto escuro da sala e uma voz perguntou: "Martinho, não me reconheces?" Era o soldado, a mulher com o bebê e os dois da maçã. E a voz concluiu: "Tudo o que fizeste a um destes meus irmãos mais pequeninos, a mim o fizeste. Onde está o amor, Deus está."`,
  },
  {
    title: "A Vela",
    author: "Liev Tolstói",
    year: 1886,
    category: "Contos de virtudes",
    slug: "a-vela-liev-tolstoi",
    content: `Havia um feitor cruel chamado Miguel que maltratava os camponeses, exigindo trabalho pesado mesmo nos dias santos. Os camponeses odiavam-no e alguns planejavam assassiná-lo para se livrarem da opressão. Apenas um camponês justo, chamado Pedro, aconselhava a paciência e o perdão, dizendo que o mal não se vence com o mal.

Na Páscoa, Miguel obrigou os camponeses a irem lavrar a terra em pleno domingo de ressurreição. Pedro foi, mas levou consigo uma vela benta da igreja. Acendeu a vela e colou-a na charrua. Enquanto trabalhava, a vela continuava a queimar sob o vento e a chuva, sem se apagar. Pedro cantava hinos de Páscoa e trabalhava em paz, sem odiar o feitor.

Miguel veio a cavalo vigiar o trabalho. Ao ver a vela benta na charrua de Pedro e ouvir o seu canto de louvor, sentiu um profundo golpe na consciência. Ficou mudo, deu meia-volta com o cavalo e partiu. Mais tarde, ao cair da tarde, Miguel caiu do cavalo acidentalmente e morreu.

Os camponeses perceberam que a justiça de Deus se manifestara sem necessidade de violência, e que a paciência e a retidão de Pedro haviam salvado a aldeia do pecado do crime.`,
  },
  {
    title: "Dois Velhos",
    author: "Liev Tolstói",
    year: 1885,
    category: "Contos de virtudes",
    slug: "dois-velhos-liev-tolstoi",
    content: `Dois camponeses idosos, Efim e Eliseu, decidiram fazer uma peregrinação a Jerusalém. Efim era um homem rico e sério; Eliseu era um camponês simples, bondoso e alegre. Eles caminharam por muitas semanas.

Ao passarem por uma aldeia atingida pela fome e pela peste, Eliseu resolveu parar para ajudar uma família necessitada que estava à beira da morte. Efim, temendo atrasar-se, continuou a viagem sozinho. Eliseu comprou comida, limpou a casa dos doentes, vendeu os seus bens para pagar as dívidas deles e só partiu quando a família estava salva e restabelecida. Sem dinheiro para continuar a viagem, Eliseu voltou para a sua aldeia.

Efim chegou a Jerusalém, visitou os lugares santos e comprou relíquias, mas sempre preocupado com o seu dinheiro e com os negócios em casa. No Santo Sepulcro, Efim viu de longe a figura de Eliseu cercada de luz, mas não conseguiu aproximar-se dele devido à multidão.

Ao regressar, Efim passou pela mesma aldeia e ouviu a família abençoar o camponês que os salvara. Ao chegar a casa, encontrou Eliseu trabalhando em paz no seu apiário. Efim compreendeu que Eliseu, ao praticar a caridade viva aos necessitados, chegara a Jerusalém em espírito antes dele, cuja peregrinação fora apenas exterior.`,
  },
  {
    title: "A Madrinha",
    author: "Liev Tolstói",
    year: 1886,
    category: "Contos de virtudes",
    slug: "a-madrinha-liev-tolstoi",
    content: `Havia uma jovem órfã que vivia na pobreza, mas cuja madrinha espiritual a visitava em sonhos para lhe ensinar as virtudes do trabalho, da paciência e da caridade silenciosa. A madrinha dizia que a verdadeira riqueza não consiste em ter ouro, mas em ter um coração limpo de egoísmo e de inveja.

A jovem cresceu seguindo esses conselhos. Trabalhava para os vizinhos doentes, fiava a lã para os necessitados e nunca se queixava de sua sorte. Um jovem rico da região, admirado com a sua modéstia, bondade e paz de espírito, pediu-a em casamento, preferindo-a às jovens ricas e orgulhosas da cidade.

No dia do casamento, a madrinha apareceu disfarçada de mendiga. A noiva, reconhecendo-a pela luz do seu olhar, deixou a mesa de honra para servir a mendiga com as suas próprias mãos. O noivo e os convidados aprenderam com esse gesto que a hospitalidade e a gratidão são mais preciosas do que qualquer convenção social, e que a verdadeira nobreza acolhe a todos com igual amor.`,
  },
  {
    title: "A Centelha",
    author: "Liev Tolstói",
    year: 1885,
    category: "Contos de virtudes",
    slug: "a-centelha-liev-tolstoi",
    content: `Dois vizinhos, Ivan e Gabriel, viviam em paz até que uma pequena discussão sobre uma galinha que pusera um ovo no quintal do outro desencadeou uma briga feia. O orgulho de ambos impediu a reconciliação. A briga cresceu com insultos, processos na justiça e agressões mútuas.

O velho pai de Ivan, que estava doente no hospital, aconselhava o filho a perdoar: "Apague a centelha antes que ela se transforme num incêndio que queime tudo!" Mas Ivan não o ouvia, cego pelo desejo de vingança.

Uma noite, Gabriel, cego pelo ódio, ateou fogo ao celeiro de Ivan. Ivan viu o fogo começar, mas em vez de apagá-lo imediatamente, correu atrás de Gabriel para agredi-lo. Enquanto brigavam na rua, o vento espalhou as chamas e todo o vilarejo ardeu, destruindo as casas de ambos os vizinhos.

O velho pai de Ivan, moribundo devido ao fumo, disse-lhe antes de expirar: "De quem é a culpa?" Ivan reconheceu o seu erro. Fez as pazes com Gabriel e, juntos, reconduziram a vida na aldeia, ensinando a todos que a raiva não contida destrói a própria vida de quem a abriga.`,
  },
  {
    title: "O Afilhado",
    author: "Liev Tolstói",
    year: 1886,
    category: "Contos de virtudes",
    slug: "o-afilhado-liev-tolstoi",
    content: `Um homem pobre teve um filho e não conseguia encontrar ninguém para ser padrinho do menino. Um estranho na floresta aceitou o papel, prometendo dar ao menino um bom destino se ele seguisse a virtude. O padrinho levou o menino e educou-o no amor à verdade, na obediência e no trabalho.

Quando o rapaz cresceu, o padrinho deu-lhe a tarefa de cuidar de um jardim sagrado, com a única condição de nunca abrir uma determinada porta. O rapaz desobedeceu, abriu a porta e viu o mundo cheio de pecados e de dores causados pela falta de amor dos homens. Para reparar a sua desobediência e a dor que vira, o padrinho ordenou-lhe que vivesse no mundo ajudando os necessitados.

O afilhado caminhou pelo mundo fazendo o bem, perdoando os seus inimigos e curando os doentes com a sua prece. Compreendeu que o pecado do mundo só se cura com a força do amor paciente e do exemplo reto, e que aquele que quer julgar os outros com dureza só aumenta a desordem do universo.`,
  },
  {
    title: "O Arrependimento do Pecador",
    author: "Liev Tolstói",
    year: 1886,
    category: "Contos de virtudes",
    slug: "o-arrependimento-do-pecador-liev-tolstoi",
    content: `Havia um homem que vivera setenta anos no pecado e na injustiça, sem nunca pensar na salvação de sua alma. Ao sentir a aproximação da morte, percebeu a gravidade dos seus erros e clamou a Deus com lágrimas de arrependimento sincero, pedindo misericórdia no último sopro de vida.

Ao chegar às portas do Paraíso, bateu. O apóstolo Pedro respondeu de dentro: "Quem bate? Não podes entrar aqui, pois foste um pecador durante toda a tua vida." O homem respondeu: "Sim, fui pecador; mas lembra-te de que tu também negaste o Senhor três vezes e foste perdoado pelo Seu amor infinito." Pedro calou-se.

O homem bateu novamente. O rei Davi respondeu: "Não há lugar para ti aqui, pecador." O homem replicou: "Fui pecador; mas lembra-te do teu pecado com a esposa de Urias e de como o Senhor te perdoou quando te arrependeste." Davi calou-se.

Bateu pela terceira vez. O apóstolo João abriu a porta. O homem disse: "Tu que escreveste que Deus é amor, não podes fechar-me a porta se me apresento arrependido." João abraçou-o e deixou-o entrar, ensinando que o arrependimento sincero abre as portas da misericórdia eterna.`,
  },
  {
    title: "Elias",
    author: "Liev Tolstói",
    year: 1885,
    category: "Contos de virtudes",
    slug: "elias-liev-tolstoi",
    content: `Elias era um camponês que trabalhou muito durante trinta anos com a sua esposa, até acumular grande riqueza na estepe. Tinha rebanhos de cavalos, ovelhas e servos que o serviam. Mas a riqueza trouxe-lhe preocupações: os filhos tornaram-se orgulhosos, os servos roubavam-no e as doenças mataram os seus rebanhos. Elias perdeu tudo e ficou pobre na velhice.

Para sobreviver, Elias e a sua esposa começaram a trabalhar como servos na casa de um vizinho bondoso chamado Babas. Limpavam o estábulo, ordenhavam as éguas e serviam os hóspedes do patrão.

Um dia, o patrão recebeu hóspedes ricos e perguntou a Elias, na presença de todos, se ele sentia saudade dos tempos em que era rico. Elias sorriu e pediu que sua esposa respondesse.

A esposa de Elias explicou: "Durante trinta anos de riqueza, nunca tivemos paz. Preocupávamo-nos com os bens, brigávamos entre nós e não tínhamos tempo para rezar ou pensar na nossa alma. Agora, trabalhando como servos, temos tudo de que precisamos, vivemos em paz, conversamos com amor e temos tempo para rezar e agradecer a Deus. Descobrimos a verdadeira felicidade na pobreza e no trabalho honesto."`,
  },
  {
    title: "O Ivan, o Tolo",
    author: "Liev Tolstói",
    year: 1886,
    category: "Contos de virtudes",
    slug: "o-ivan-o-tolo-liev-tolstoi",
    content: `Ivan era um camponês simples a quem todos chamavam de "o Tolo". Seus irmãos mais velhos, um soldado e um comerciante, dividiram a herança do pai de forma injusta, deixando para Ivan apenas a velha casa e o trabalho da terra. Ivan aceitou tudo com paciência, sem reclamar de nada, e continuou a trabalhar no campo cantando e ajudando a todos.

Três pequenos demônios tentaram destruir a paz de Ivan. Tentaram fazê-lo odiar os irmãos, arruinar o seu trabalho e fazê-lo adoecer; mas a paciência, a simplicidade e o trabalho honesto de Ivan venceram todas as ciladas. Ivan dividia o seu pão com os mendigos e trabalhava com tanta alegria que a própria terra produzia em abundância.

Os reis vizinhos tentaram conquistar o reino de Ivan com exércitos e com dinheiro. Mas os camponeses de Ivan eram tão simples que não tinham exército para lutar nem valorizavam o ouro, acolhendo os soldados com caridade e dando-lhes comida de graça. Os soldados, sem ter contra quem lutar, desertaram e tornaram-se trabalhadores da terra.

Ivan tornou-se rei dos camponeses, estabelecendo uma única lei no seu reino: "Aquele que tem calos nas mãos come à mesa; aquele que não trabalha come as sobras." A simplicidade e a justiça venceram a força do orgulho e da ganância.`,
  },
  {
    title: "O Café de Surate",
    author: "Liev Tolstói",
    year: 1893,
    category: "Contos de virtudes",
    slug: "o-cafe-de-surate-liev-tolstoi",
    content: `Num café na cidade indiana de Surate, reuniram-se viajantes de diferentes partes do mundo e de diferentes religiões. Um teólogo persa, que perdera a fé devido ao excesso de especulação filosófica, começou a discutir com os presentes sobre a natureza de Deus.

Cada viajante afirmava que a sua própria religião era a única verdadeira e que o seu povo era o único que conhecia a Deus. O turco, o romano, o hindu, o judeu e o protestante começaram a gritar uns com os outros defendendo os seus templos e dogmas com orgulho e intolerância.

Um sábio chinês, que estava sentado a um canto ouvindo a discussão em silêncio, foi solicitado a dar a sua opinião. Ele explicou através de uma parábola: "Deus é como o sol. Um cego que nunca viu o sol pode negar a sua existência; mas o sol continua a iluminar o mundo de todos. Aquele que quer prender a Deus dentro de um templo ou de uma única fórmula é como quem tenta fechar a luz do sol dentro de uma caixa. O verdadeiro templo de Deus é o universo inteiro, e o Seu verdadeiro culto é a caridade para com todos os homens."`,
  },
  {
    title: "A Oração dos Três Eremitas",
    author: "Liev Tolstói",
    year: 1886,
    category: "Contos de virtudes",
    slug: "a-oracao-dos-tres-eremitas-liev-tolstoi",
    content: `Um bispo viajava de barco em direção a um mosteiro quando ouviu falar de três eremitas muito simples que viviam numa ilha deserta e procuravam a salvação de suas almas. Curioso, o bispo ordenou que o barco parasse na ilha para visitá-los.

Ao chegar, encontrou três velhos muito humildes que não sabiam ler nem conheciam as orações oficiais da Igreja. Sua única oração era: "Nós somos três, Vós sois três, tende piedade de nós." O bispo, achando a oração inadequada, passou o dia inteiro ensinando-lhes o Pai Nosso com muita paciência. Os eremitas agradeceram e o bispo partiu no barco à noite.

No meio da noite, o bispo e a tripulação viram uma luz brilhante aproximando-se do barco na água corrente. Para espanto de todos, eram os três eremitas correndo sobre a água como se estivessem em terra firme.

Ao alcançarem o barco, os eremitas disseram humildemente ao bispo: "Santo homem, esquecemos a oração que nos ensinaste! Por favor, ensina-nos novamente!" O bispo, caindo de joelhos diante deles, respondeu com lágrimas nos olhos: "Sua oração é perfeita diante de Deus. Rezem por nós, pecadores!"`,
  },
  {
    title: "São Francisco e a Perfeita Alegria",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-a-perfeita-alegria-fioretti",
    content: `Caminhava São Francisco de Assis com Frei Leão num dia de inverno rigoroso, o frio cortando-lhes a pele. Frei Leão perguntou-lhe: "Pai, diz-me em que consiste a perfeita alegria."

São Francisco respondeu: "Se chegarmos ao convento de Santa Maria dos Anjos completamente encharcados pela chuva, trêmulos de frio, cobertos de lama e famintos, e o porteiro não nos reconhecer, chamar-nos de vagabundos e recusar-se a abrir a porta, deixando-nos na neve até a noite; se aceitarmos essa humilhação com paciência, sem nos queixarmos nem murmurarmos contra o irmão, pensando com humildade que o porteiro nos trata assim por permissão divina... escreve, Frei Leão, que nisso consiste a perfeita alegria."

E continuou: "Mais ainda: se batermos de novo e o porteiro sair com um bastão, nos agredir com violência e nos jogar no chão coberto de gelo, e nós suportarmos tudo isso com paciência, lembrando as dores de Cristo bendito que devemos carregar por amor a Ele... escreve que nisso consiste a perfeita alegria. Pois acima de todos os dons do Espírito Santo está o dom de vencer a si mesmo e sofrer por amor a Deus."`,
  },
  {
    title: "São Francisco e o Lobo de Gubbio",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-o-lobo-de-gubbio-fioretti",
    content: `Na época em que São Francisco vivia na cidade de Gubbio, um lobo enorme e feroz aterrorizava a região. Devorava os animais e atacava os homens, de modo que ninguém ousava sair da cidade sem armas. Os cidadãos estavam desesperados.

São Francisco, sentindo compaixão pelos cidadãos e pelo lobo, resolveu ir ao encontro do animal na floresta, confiando na proteção de Deus. Ao avistar o lobo que corria em sua direção de boca aberta, Francisco fez o sinal da cruz e disse-lhe: "Vem cá, irmão lobo! Ordeno-te, da parte de Cristo, que não faças mal a mim nem a ninguém."

O lobo fechou a boca, parou de correr e deitou-se humildemente aos pés do santo. Francisco explicou-lhe: "Irmão lobo, tu fizeste grandes males nesta terra, destruindo as criaturas de Deus. Mas eu quero fazer as pazes entre ti e os homens. Se prometeres nunca mais atacar ninguém, os cidadãos dar-te-ão alimento todos os dias na cidade."

O lobo inclinou a cabeça e colocou a pata na mão de Francisco como sinal de promessa. A partir daquele dia, o lobo viveu pacificamente na cidade de Gubbio, entrando nas casas sem fazer mal a ninguém, sendo alimentado com caridade por todos até morrer de velhice.`,
  },
  {
    title: "São Francisco e as Rolas Silvestres",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-as-rolas-silvestres-fioretti",
    content: `Certo dia, um jovem carregava ao mercado de Assis várias rolas silvestres que capturara em armadilhas para vender. São Francisco, cruzando o caminho com o jovem e vendo as pequenas aves presas que gemiam de medo, sentiu uma profunda piedade das criaturas de Deus.

Francisco disse ao rapaz com doçura: "Bom jovem, peço-te que me entregues estas aves inocentes, que as escrituras comparam às almas puras e fiéis, para que não caiam nas mãos de quem as matará." O jovem, tocado pela bondade e pela autoridade espiritual do santo, entregou-lhe o cesto imediatamente.

Francisco acolheu as rolas no peito e conversou com elas: "Minhas irmãs rolas, simples, inocentes e castas, por que vos deixastes prender? Eu vou construir ninhos para vós, para que possais crescer e multiplicar-vos segundo o mandamento do Criador."

O santo construiu ninhos no convento. As rolas viveram ali pacificamente com os frades, alimentando-se em suas mãos e nidificando nos ramos próximos, sem nunca fugir até receberem a bênção de Francisco para voar livremente pelo céu.`,
  },
  {
    title: "São Francisco e Frei Leão",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-frei-leao-fioretti",
    content: `Frei Leão, o discípulo mais amado de São Francisco devido à sua pureza e simplicidade de coração, passava por um período de grande provação espiritual. Sentia-se indigno da graça divina e temia perder a salvação de sua alma, caindo numa profunda melancolia.

São Francisco, percebendo a aflição do irmão através do discernimento dos espíritos, escreveu num pequeno pedaço de pergaminho a bênção de Deus e entregou-a a Leão: "O Senhor te abençoe e te guarde; mostre-te a Sua face e tenha misericórdia de ti; volte para ti o Seu olhar e te dê a paz." E acrescentou de próprio punho o sinal da cruz (o Tau).

Francisco disse-lhe com ternura: "Guarda este papel contigo até a morte, e sempre que a tristeza te assaltar, lê estas palavras e lembra-te de que és amado por Deus."

Frei Leão guardou a bênção no peito. A angústia desapareceu imediatamente do seu coração, dando lugar a uma paz profunda e duradoura. Compreendeu que a santidade de Francisco residia na sua capacidade de levar o consolo e a misericórdia aos corações aflitos dos homens.`,
  },
  {
    title: "São Francisco e o Irmão Masseo",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-o-irmao-masseo-fioretti",
    content: `Frei Masseo era um homem de bela presença, eloquente e de grande inteligência, que se unira à ordem dos frades menores. Um dia, quis testar a humildade de São Francisco e perguntou-lhe com tom de brincadeira: "Por que todo o mundo corre atrás de ti? Tu não és belo, não tens grande ciência nem és de nobre linhagem. Por que todos querem ver-te e ouvir-te?"

São Francisco, ouvindo isso, olhou para o céu por muito tempo em êxtase espiritual. Depois, ajoelhou-se e agradeceu a Deus. Voltando-se para Masseo, explicou:

"Os olhos do Altíssimo viram que na terra não há criatura mais pecadora, mais fraca e mais ignorante do que eu. Por isso, Ele me escolheu para realizar a Sua obra, a fim de confundir a nobreza, a sabedoria e a força do mundo orgulhoso. Deus quis mostrar que toda a virtude e toda a graça vêm d'Ele e não do homem, para que ninguém se glorie na Sua presença."

Frei Masseo compreendeu a profundidade da humildade de Francisco e o motivo pelo qual Deus o enchera de tantas bênçãos, e aprendeu a valorizar a pequenez espiritual acima de qualquer glória humana.`,
  },
  {
    title: "São Francisco e a Cotovia",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-a-cotovia-fioretti",
    content: `No momento em que São Francisco de Assis estava prestes a entregar a sua alma a Deus no chão da Porciúncula, rodeado pelos frades que choravam a sua partida, ocorreu um fato extraordinário que encheu a todos de consolação espiritual.

Embora fosse o crepúsculo da tarde e as cotovias sejam aves que amam a luz da manhã e calam-se ao pôr do sol, uma grande multidão dessas pequenas aves desceu sobre o telhado da cela do santo. As aves começaram a cantar alegremente e a bater as asas com força, como se estivessem celebrando a passagem daquela alma luminosa para a pátria celeste.

Os frades perceberam que a natureza inteira prestava a sua última homenagem ao homem que a amara com tanta pureza e simplicidade. As cotovias, com a sua veste parda como o hábito franciscano e o seu voo reto em direção ao céu, eram a imagem perfeita da vida de Francisco, que subira da poeira da terra à glória da presença eterna de Deus.`,
  },
  {
    title: "São Francisco e o Milagre dos Peixes",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-o-milagre-dos-peixes-fioretti",
    content: `Caminhava São Francisco perto do lago de Piediluco quando um pescador lhe ofereceu um grande peixe que acabara de pescar. Francisco aceitou o presente com alegria e gratidão, mas em vez de guardá-lo para comer, colocou-o delicadamente na água do lago.

Francisco conversou com o peixe com doçura: "Meu irmão peixe, agradece ao teu Criador por te dar esta água pura para nadar, a liberdade e o alimento de que precisas."

Para espanto do pescador e dos frades presentes, o peixe não fugiu imediatamente. Ficou brincando na água junto à mão do santo, olhando para ele com afeição, como se estivesse ouvindo a sua voz. Francisco abençoou o peixe e ordenou-lhe que partisse em paz. O peixe deu um salto de alegria e sumiu nas profundezas do lago.

O milagre mostrou que a caridade de Francisco não se limitava aos homens, mas abraçava todas as criaturas de Deus com o mesmo amor fraterno, reconhecendo em cada ser vivo a obra sábia do Criador.`,
  },
  {
    title: "São Francisco e a Senhora Pobreza",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-a-senhora-pobreza-fioretti",
    content: `Desde a sua conversão espiritual, São Francisco escolheu como sua esposa mística a Senhora Pobreza, a quem o mundo despreza e evita com pavor. Dizia aos frades que a pobreza era a rainha das virtudes, pois fora a companheira constante de Cristo desde o presépio de Belém até a Cruz do Calvário.

Francisco ensinava que a verdadeira pobreza não consiste apenas em não ter bens materiais, mas em ter o espírito desapegado de tudo, inclusive das próprias opiniões e da própria vontade. Aquele que não possui nada na terra é livre de preocupações, não precisa de armas para defender as suas riquezas e pode voar com asas livres em direção ao céu.

O santo alegrava-se ao pedir esmolas de porta em porta, considerando o pão da caridade mais saboroso do que qualquer banquete real. Sua vida de despojamento total inspirou milhares de homens a abandonar a busca do ouro e do poder para buscar apenas a riqueza imperecível da graça divina.`,
  },
  {
    title: "São Francisco e Frei Junípero",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-frei-junipero-fioretti",
    content: `Frei Junípero era um dos frades mais simples e de maior caridade na ordem de São Francisco. Sua compaixão pelos pobres era tão grande que muitas vezes dava a sua própria túnica ou os livros do convento a quem lhe pedia esmola. Os frades tinham de vigiá-lo para que ele não desse tudo o que havia no convento.

Certo dia, um doente pediu-lhe que lhe trouxesse um pé de porco para comer. Junípero, na sua simplicidade cega de amor, correu ao campo, cortou o pé de um porco que pastava e trouxe-o cozido ao doente. O dono do animal veio furioso ao convento queixar-se do roubo.

São Francisco repreendeu Junípero pela falta de prudência. Junípero, humilde, correu atrás do fazendeiro, abraçou-o, confessou o seu erro com tanta dor e simplicidade que o homem, comovido pela sua santa loucura de caridade, perdoou o furto, deu o porco inteiro ao convento e converteu-se à vida de prece.

Francisco costumava dizer aos frades com um sorriso: "Quem me dera ter uma floresta inteira de tais juníperos!"`,
  },
  {
    title: "São Francisco e a Cura do Leproso",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-a-cura-do-leproso-fioretti",
    content: `Havia num hospital perto de Assis um leproso tão impaciente e orgulhoso que agredia os enfermeiros e insultava a Deus com blasfêmias horríveis devido à sua dor. Os frades que o serviam estavam desanimados e queriam abandoná-lo.

São Francisco resolveu visitá-lo. Ao entrar na cela do enfermo, disse-lhe com doçura: "Deus te dê a paz, meu irmão querido!" O leproso respondeu irado: "Que paz posso ter se Deus me castigou com esta podridão?"

Francisco ofereceu-se para lavá-lo com as suas próprias mãos. À medida que o santo lavava as feridas com água morna e pétalas de rosas, o milagre ocorria: a carne leprosa cicatrizava e a alma do doente abria-se ao arrependimento. Vendo-se curado na pele e no espírito, o homem começou a chorar de dor pelos seus pecados e a bendizer a Deus.

O milagre provou que a paciência e a caridade de Francisco podiam vencer não apenas a lepra física do corpo, mas também a lepra do ódio e da revolta que destrói a alma do pecador.`,
  },
  {
    title: "São Francisco e Frei Bernardo",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-frei-bernardo-fioretti",
    content: `Frei Bernardo de Quintavalle foi o primeiro companheiro a unir-se a São Francisco na vida de pobreza. Sendo um homem rico e de grande respeito em Assis, resolveu testar a santidade do jovem Francisco antes de segui-lo. Convidou-o para passar a noite em sua casa e fingiu dormir profundamente.

Francisco, pensando estar sozinho na presença de Deus, ajoelhou-se e passou a noite inteira em prece fervorosa, repetindo com lágrimas nos olhos: "Meu Deus e meu tudo! Meu Deus e meu tudo!" Bernardo contemplou aquela cena no segredo da noite.

Na manhã seguinte, Bernardo disse-lhe: "Francisco, eu quero dispor de todos os meus bens por amor a Cristo e seguir-te na pobreza." Francisco alegrou-se muito e foram à igreja abrir os Evangelhos para buscar a vontade de Deus.

Os três trechos abertos diziam: "Se queres ser perfeito, vai, vende o que tens e dá aos pobres"; "Não leveis nada para o caminho"; "Se alguém quer seguir-me, renuncie a si mesmo". Bernardo vendeu tudo, distribuiu o dinheiro aos necessitados e tornou-se o braço direito de Francisco na fundação da ordem.`,
  },
  {
    title: "São Francisco e as Três Bolsas de Ouro",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-as-tres-bolsas-de-ouro-fioretti",
    content: `Caminhava São Francisco com Frei Masseo por uma estrada real quando encontraram no chão três grandes bolsas cheias de moedas de ouro, perdidas por algum viajante rico. Masseo disse: "Pai, peguemos neste ouro para distribuir aos pobres que tanto sofrem."

Francisco respondeu-lhe: "Meu irmão, o ouro que não nos pertence é uma armadilha do diabo. Não devemos tocar no que não é nosso, mesmo com a intenção de fazer o bem, pois a caridade verdadeira não se faz com a injustiça do alheio."

Como Masseo insistisse, Francisco sugeriu que rezassem para buscar a vontade de Deus. Enquanto rezavam, uma serpente enorme surgiu de dentro das bolsas de ouro e sumiu na floresta, mostrando que o apego ao dinheiro traz consigo o veneno da discórdia e do pecado.

Masseo compreendeu a lição e pediu perdão pela sua pressa intelectual, reconhecendo que a verdadeira pobreza confia inteiramente na Providência divina para o sustento dos necessitados, sem recorrer aos atalhos do mundo.`,
  },
  {
    title: "São Francisco e a Pregação aos Pássaros",
    author: "Fioretti",
    year: 1390,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-a-pregacao-aos-passaros-fioretti",
    content: `Caminhava São Francisco pela planície de Spoleto quando avistou uma grande multidão de pássaros de diversas espécies reunida nos ramos das árvores e no chão. Sentindo um profundo amor pelas pequenas criaturas, o santo correu até elas e saudou-as.

Para espanto dos frades, os pássaros não fugiram. Ficaram quietos nos ramos e no solo, estendendo o pescoço e olhando para ele com atenção. Francisco começou a pregar-lhes:

"Meus irmãos pássaros, deveis muito ao vosso Criador! Ele vos deu as asas para voar, a veste de penas macias para o frio e o ar livre para habitar. Vós não semeais nem colheis, mas Deus vos alimenta com amor de pai, dando-vos as fontes para beber e as altas árvores para construir os vossos ninhos. Não sejais ingratos, minhas pequenas irmãs, mas louvai sempre ao Senhor pela Sua bondade."

Os pássaros abriram os bicos, bateram as asas e inclinaram as cabeças em sinal de agradecimento. Francisco fez o sinal da cruz sobre eles e os pássaros levantaram voo em direção aos quatro cantos do céu cantando alegremente.`,
  },
  {
    title: "São Bento e o Milagre do Crivo",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-bento-e-o-milagre-do-crivo-legenda-aurea",
    content: `Na juventude, Bento de Núrsia retirou-se para viver no recolhimento acompanhado por sua fiel ama Cirila na localidade de Enfide. A boa mulher, querendo limpar o trigo para o pão do jovem santo, pediu emprestado a uma vizinha um crivo de argila cozida.

Por um acidente infeliz, o crivo caiu da mesa e partiu-se em dois pedaços. Cirila, vendo o objeto que não lhe pertencia quebrado, começou a chorar de dor e preocupação com a vizinha pobre.

Bento, sentindo compaixão das lágrimas de sua ama e movido pela caridade, pegou nos pedaços do crivo quebrado, ajoelhou-se a um canto e começou a rezar com fervor a Deus. Quando terminou a prece e levantou-se, o crivo estava completamente curado, sem qualquer sinal ou racha da quebra.

O milagre espalhou-se pela região e os cidadãos penduraram o crivo na entrada da igreja de Enfide como testemunho da santidade do jovem Bento, que preferira recorrer à prece fervorosa para consolar o sofrimento de sua ama pobre do que aceitar a perda com indiferença.`,
  },
  {
    title: "São Bento e a Visão da Alma de sua Irmã",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-bento-e-a-visao-da-alma-de-sua-irma-legenda-aurea",
    content: `Santa Escolástica, a irmã de São Bento, vivia num convento próximo e costumava encontrar-se com o irmão uma vez por ano numa pequena casa de retiro para conversar sobre as escrituras e a vida espiritual.

No último encontro de suas vidas, conversaram até a noite. Escolástica pediu ao irmão que ficasse com ela até a manhã para continuarem a conversar sobre as alegrias do céu. Bento recusou com firmeza, dizendo que não podia passar a noite fora de sua cela monástica devido à regra.

Escolástica cruzou as mãos sobre a mesa, inclinou a cabeça e rezou a Deus com lágrimas nos olhos. Assim que terminou a prece, o céu limpo escureceu e desabou uma tempestade tão violenta de raios, trovões e chuva que Bento e seus monges não puderam sair de casa.

Bento disse-lhe com tristeza: "Que fizeste, minha irmã?" E ela respondeu: "Pedi a ti e não me ouviste; pedi ao meu Deus e Ele me atendeu." Três dias depois, em sua cela, Bento olhou para o céu e viu a alma de sua irmã subir em direção ao firmamento sob a forma de uma pomba branca de extraordinária beleza.`,
  },
  {
    title: "São Nicolau e as Bolsas de Ouro",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-nicolau-e-as-bolsas-de-ouro-legenda-aurea",
    content: `Na cidade de Patara viveu um homem nobre que perdera todos os seus bens, caindo na miséria absoluta. Desesperado com a pobreza e sem dinheiro para casar as suas três filhas jovens, o homem planejava prostituí-las para obter o sustento de sua casa.

O jovem Nicolau, que herdara grande riqueza de seus pais e vivia na virtude e na caridade, soube da aflição daquela família. Querendo ajudá-los sem ser visto e sem humilhar o pai com a sua esmola, Nicolau foi à casa deles à noite no segredo das trevas.

Nicolau jogou pela janela aberta uma bolsa de couro cheia de moedas de ouro e retirou-se em silêncio. Com esse ouro, o pai pôde casar a filha mais velha com dignidade. Nicolau repetiu o gesto na noite seguinte para a segunda filha.

Na terceira noite, o pai ficou vigiando na rua e correu atrás de Nicolau para lhe beijar as mãos. Nicolau pediu-lhe com humildade que nunca revelasse a autoria da esmola enquanto ele vivesse, ensinando que a verdadeira caridade deve ser feita no segredo do silêncio para a glória exclusiva de Deus.`,
  },
  {
    title: "São Nicolau e a Tempestade Acalmada",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-nicolau-e-a-tempestade-acalmada-legenda-aurea",
    content: `Viajava um grupo de marinheiros num barco pelo mar Mediterrâneo quando desabou uma tempestade violenta. As ondas cobriam o convés, o mastro quebrou e a embarcação estava prestes a afundar nas águas escuras. Os marinheiros, apavorados, começaram a clamar pela intercessão do santo bispo Nicolau.

Para espanto de todos, a figura de Nicolau apareceu no meio deles no convés do navio. Ele disse-lhes com autoridade espiritual: "Aqui estou! Tende confiança e não temais o mar."

Nicolau começou a puxar as cordas com os marinheiros e ordenou ao vento e às ondas que se acalmassem em nome de Jesus Cristo. A tempestade cessou imediatamente, o mar acalmou-se e o barco navegou seguro até o porto de Mira.

Os marinheiros correram à catedral para agradecer a salvação de suas vidas. Ao verem o santo bispo Nicolau no altar, ajoelharam-se diante dele. Nicolau exortou-os a viver na retidão, no amor à verdade e na justiça, ensinando que o verdadeiro milagre é a conversão do coração à lei de Deus.`,
  },
  {
    title: "São Jerônimo e o Leão Agradecido",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-jeronimo-e-o-leao-agradecido-legenda-aurea",
    content: `Enquanto São Jerônimo vivia no seu mosteiro de Belém cercado por seus monges, um enorme leão manco entrou no pátio do convento rugindo de dor. Os monges, apavorados, fugiram para todos os lados em busca de abrigo; apenas Jerônimo permaneceu calmo e caminhou ao encontro do animal feroz.

Jerônimo sentiu compaixão do leão e percebeu que ele trazia uma enorme farpa de espinho cravada na pata dianteira. Com paciência e carinho, o santo limpou a pata ferida, retirou o espinho doloroso e tratou da ferida até que o leão estivesse completamente curado.

O leão, grato pela salvação de sua vida, perdeu toda a sua ferocidade e passou a viver pacificamente no mosteiro como se fosse um animal doméstico. Jerônimo deu-lhe a tarefa de vigiar o burro que trazia lenha da floresta para o convento.

O milagre mostrou que mesmo as feras mais selvagens são sensíveis ao amor puro e à caridade sincera, e que a bondade do homem justo pode restabelecer a harmonia original da criação de Deus.`,
  },
  {
    title: "São Jerônimo e a Lição da Paciência",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-jeronimo-e-a-licao-da-paciencia-legenda-aurea",
    content: `São Jerônimo, famoso por sua grande ciência e por traduzir as escrituras para a língua latina (a Vulgata), era também conhecido por ter um temperamento forte e impaciente. Para vencer essa fraqueza moral e purificar a sua alma, retirou-se para viver no deserto de Calcis.

No deserto,Jerônimo enfrentou o calor escaldante, a solidão absoluta, as doenças do corpo e as tentações da mente que o atormentavam. Sempre que sentia a impaciência ou a raiva assaltar o seu espírito, Jerônimo pegava numa pedra pesada e batia no peito até que o seu coração se acalmasse e a sua alma se abrisse ao arrependimento.

Jerônimo passava as noites em prece e jejum pedindo a Deus o dom da paciência e da humildade. Compreendeu que a verdadeira ciência não consiste em saber muitas línguas ou escrever belos tratados, mas em vencer as próprias paixões e em suportar com resignação as provações da vida terrena.`,
  },
  {
    title: "São Cristóvão e o Menino Jesus no Rio",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-cristovao-e-o-menino-jesus-no-rio-legenda-aurea",
    content: `Cristóvão era um homem gigante, de força extraordinária, que decidira servir apenas ao rei mais poderoso da terra. Depois de procurar em vão entre os imperadores e o próprio diabo, um eremita ensinou-lhe que o rei mais poderoso era Jesus Cristo, e que ele deveria servi-Lo ajudando os caminhantes a atravessar um rio perigoso e sem ponte.

Cristóvão construiu uma cabana junto ao rio e passava os dias carregando as pessoas sobre os seus ombros gigantes de uma margem à outra, apoiando-se num grande tronco de árvore.

Uma noite, ouviu a voz de um menino chamando-o na rua. Cristóvão colocou o menino nos ombros e entrou na água corrente. À medida que avançava no rio, o peso da criança crescia de forma extraordinária, até parecer que Cristóvão carregava o mundo inteiro nas costas.

Ao alcançar a outra margem com muito esforço, Cristóvão disse ao menino: "Tu me colocaste em grande perigo! Se eu carregasse o mundo inteiro nos ombros, não pesaria mais do que tu." E o Menino Jesus respondeu-lhe: "Não temas, Cristóvão! Tu não carregaste apenas o mundo nas costas, mas Aquele que criou o mundo. Eu sou o teu Rei, Jesus Cristo, a quem serve no trabalho da caridade."`,
  },
  {
    title: "São Cristóvão e a Força da Fé",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-cristovao-e-a-forca-da-fe-legenda-aurea",
    content: `Após o seu encontro milagroso com o Menino Jesus no rio, Cristóvão viajou para a cidade de Lícia para pregar o evangelho e consolar os cristãos que sofriam as dores da perseguição sob o jugo do imperador pagão Décio.

Ao chegar lá, Cristóvão enfiou o seu cajado de madeira seca no chão da praça pública e rezou a Deus com fervor pedindo um sinal para o povo. O cajado de madeira floresceu imediatamente, cobrindo-se de folhas verdes e de flores brancas. Diante do milagre, milhares de cidadãos abandonaram o paganismo e converteram-se à fé de Cristo.

O rei ordenou a prisão de Cristóvão e mandou que duas mulheres bonitas entrassem na sua cela para fazê-lo cair no pecado. Cristóvão conversou com as mulheres com tanta pureza, dignidade e amor espiritual que ambas choraram de arrependimento, destruíram os seus ídolos pagãos e aceitaram o martírio pela fé.

O testemunho de Cristóvão mostrou que a sua verdadeira força não residia nos seus músculos gigantes, mas na pureza do seu coração e na sua fé inabalável em Cristo.`,
  },
  {
    title: "São Bento e a Serpente no Copo",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-bento-e-a-serpente-no-copo-legenda-aurea",
    content: `Os monges de um mosteiro vizinho, admirados com a santidade de Bento de Núrsia, pediram-lhe com insistência que se tornasse o abade deles. Bento recusou a princípio, dizendo que as suas regras morais eram muito severas para eles; mas, diante da insistência dos monges, aceitou o cargo.

Cedo ou tarde, os monges indisciplinados começaram a arrepender-se da escolha, pois Bento exigia silêncio, trabalho honesto e oração fervorosa. Para se livrarem do abade justo, alguns monges planejaram envenená-lo, misturando uma poção mortal no seu copo de vinho durante o jantar.

Ao sentar-se à mesa, o servo estendeu o copo de vinho a Bento. Como era o seu costume constante antes de comer, Bento levantou a mão e fez o sinal da cruz sobre o copo para abençoá-lo.

No mesmo instante, o copo de vidro quebrado partiu-se em mil pedaços como se tivesse sido atingido por uma pedra pesada, e uma serpente venenosa surgiu de dentro do vinho derramado. Bento levantou-se em paz, perdoou os monges culpados e retirou-se para viver no deserto, ensinando que a proteção divina acompanha sempre o homem de prece.`,
  },
  {
    title: "São Bento e o Menino que Afundava no Lago",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-bento-e-o-menino-que-afundava-no-lago-legenda-aurea",
    content: `Enquanto São Bento vivia no seu mosteiro de Subíaco, o jovem monge Plácido foi ao lago vizinho buscar água com um balde de madeira. Devido ao vento forte e à pressa, Plácido escorregou da margem e caiu nas águas profundas do lago, sendo arrastado pela correnteza rápida.

Bento, que estava em oração na sua cela a um quilômetro de distância, percebeu o acidente espiritual através do dom da clarividência. Chamou o monge Mauro e ordenou-lhe: "Irmão Mauro, corre ao lago, pois o menino Plácido está se afogando!"

Mauro pediu a bênção de Bento, correu ao lago e, cego pela obediência espiritual e pelo amor ao irmão, entrou na água sem perceber que corria sobre as ondas como se estivesse em terra firme. Pegou Plácido pelos cabelos e arrastou-o seguro até a margem.

Ao regressarem ao convento, Mauro e Bento discutiam humildemente sobre a autoria do milagre: Mauro atribuía-o à santidade e à ordem de Bento; Bento afirmava que o milagre fora realizado pela obediência pura de Mauro. Plácido confirmou que vira a capa de Bento cobrindo-o nas águas do lago.`,
  },
  {
    title: "Santo Antônio e a Pregação aos Peixes",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "santo-antonio-e-a-pregacao-aos-peixes-legenda-aurea",
    content: `Santo Antônio de Pádua viajou para a cidade de Rímini para pregar aos hereges que ali viviam na descrença moral. Os chefes da cidade proibiram o povo de ouvi-lo, de modo que Antônio encontrou as igrejas vazias e as praças desertas.

Antônio, sem desanimar e confiando na sabedoria divina, caminhou até a beira do mar Adriático, onde o rio deságua na água salgada. Ficou de pé na rocha e disse com voz solene: "Escutai a palavra de Deus, ó peixes do mar, já que os homens orgulhosos recusam-se a ouvi-la!"

No mesmo instante, uma grande multidão de peixes de todos os tamanhos aproximou-se da margem. Os peixes pequenos ficaram junto à areia, os médios logo atrás e os maiores nas águas profundas. Todos mantinham as cabeças fora d'água em ordem perfeita, olhando para o santo em silêncio.

Antônio pregou-lhes sobre a bondade do Criador que lhes dera a liberdade e a água pura. Os peixes abriram as bocas e inclinaram as cabeças em sinal de louvor. O povo da cidade, vendo o milagre extraordinário, correu à praia arrependido e converteu-se à fé verdadeira.`,
  },
  {
    title: "São Francisco e os Estigmas da Paixão",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "sao-francisco-e-os-estigmas-da-paixao-legenda-aurea",
    content: `Dois anos antes de sua morte, São Francisco de Assis retirou-se para viver a Quaresma de São Miguel no monte Alverne, acompanhado por Frei Leão. Francisco passava os dias em prece fervorosa pedindo a Deus que lhe permitisse sentir na alma e no corpo as dores da paixão de Cristo por amor.

Na manhã da festa da Exaltação da Santa Cruz, enquanto rezava no segredo da floresta, Francisco viu um Serafim de seis asas resplandecentes descer do céu azul. O Serafim trazia a figura de um homem crucificado entre as asas.

Enquanto Francisco contemplava aquela visão em êxtase de dor e amor espiritual, raios de luz saíram das chagas do Serafim e atingiram as suas mãos, os seus pés e o seu lado direito.

Quando a visão desapareceu, Francisco trazia gravado no seu próprio corpo os estigmas da paixão: pregos de carne preta nas palmas das mãos e nos pés, e uma ferida aberta no lado que sangrava constantemente. O milagre mostrou que a união de Francisco com Cristo fora consumada na carne e no espírito.`,
  },
  {
    title: "Santa Isabel e o Milagre das Rosas",
    author: "Legenda Áurea",
    year: 1260,
    category: "Contos de virtudes",
    slug: "santa-isabel-e-o-milagre-das-rosas-legenda-aurea",
    content: `Santa Isabel da Hungria, esposa do duque Luís da Turíngia, dedicava a sua vida ao serviço dos pobres e doentes, distribuindo alimentos de sua própria mesa aos necessitados da cidade. Seus cunhados acusavam-na de desperdiçar a riqueza do castelo com os mendigos.

Certo dia de inverno rigoroso, Isabel descia as escadas do castelo carregando no seu manto de seda vários pães de trigo para distribuir aos pobres que esperavam com fome na porta. Seu marido, Luís, vinha subindo a cavalo acompanhado por seus cavaleiros.

Luís, querendo testar a verdade das acusações, barrou o caminho e perguntou-lhe com firmeza: "Isabel, que levas escondido no teu manto?" E puxou a barra do manto de seda.

No mesmo instante, os pães de trigo desapareceram e o manto de Isabel apareceu cheio de rosas brancas e vermelhas de extraordinária beleza e perfume, embora estivesse no meio da neve invernal de janeiro. Luís ajoelhou-se diante dela, reconhecendo a proteção divina que acompanhava a caridade silenciosa de sua esposa santa.`,
  },
  {
    title: "O Eremita e o Ladrão",
    author: "Padre Manuel Bernardes",
    year: 1706,
    category: "Contos de virtudes",
    slug: "o-eremita-e-o-ladrao-padre-manuel-bernardes",
    content: `Vivia no deserto um eremita muito santo que passava os dias em oração e jejum. Uma noite, um ladrão armado invadiu a sua pequena cabana rústica procurando ouro ou bens de valor. O ladrão revirou tudo, mas não achou nada além de um velho cesto de palha e uma capa de lã gasta.

O eremita, acordado pelo barulho, não sentiu raiva nem medo do invasor. Levantou-se em paz e disse-lhe com doçura: "Meu filho, desculpa-me por não ter nada de valor para te oferecer no meu lar pobre! Mas leva este cesto e esta capa, pois são as únicas coisas que possuo."

O ladrão, confuso com tamanha generosidade e humildade espiritual, pegou os objetos e retirou-se apressado na escuridão. O eremita voltou a deitar-se e dormiu em paz.

Ao amanhecer, o ladrão voltou à cabana do eremita, caiu de joelhos e devolveu o cesto e a capa com lágrimas nos olhos: "Pai, devolvo os teus bens, pois a tua bondade e a tua paz roubaram-me o desejo de pecar. Peço-te que me ensines a servir a Deus como tu serves." O eremita acolheu-o com amor e tornaram-se companheiros de prece no deserto.`,
  },
  {
    title: "O Cego de Jericó",
    author: "Padre Manuel Bernardes",
    year: 1706,
    category: "Contos de virtudes",
    slug: "o-cego-de-jerico-padre-manuel-bernardes",
    content: `À beira do caminho que levava à cidade de Jericó, estava sentado o cego Bartimeu mendigando o seu pão de cada dia. Ao ouvir o barulho da grande multidão que passava, perguntou o que era aquilo, e responderam-lhe: "É Jesus de Nazaré que passa!"

Bartimeu começou a clamar com força na estrada: "Jesus, Filho de Davi, tem misericórdia de mim!" Os discípulos e os caminhantes repreendiam-no com dureza para que se calasse, achando que as suas queixas incomodavam o Mestre justo; mas o cego gritava ainda mais forte.

Jesus parou na estrada e ordenou que o trouxessem. Perguntou-lhe: "Que queres que eu te faça?" O cego respondeu com fé inabalável: "Senhor, que eu volte a enxergar!"

Jesus disse-lhe: "Vai em paz, a tua fé te salvou!" No mesmo instante, a vista do cego voltou e ele passou a enxergar a luz do sol e as cores do mundo. Bartimeu jogou fora a sua capa de mendigo e seguiu Jesus pela estrada glorificando a Deus, ensinando que a fé paciente vence a oposição do mundo.`,
  },
  {
    title: "A Paciência do Filósofo",
    author: "Padre Manuel Bernardes",
    year: 1706,
    category: "Contos de virtudes",
    slug: "a-paciencia-do-filosofo-padre-manuel-bernardes",
    content: `Contam os antigos sábios que um filósofo muito virtuoso era casado com uma mulher de temperamento extremamente difícil, impaciente e dada a insultar o marido na presença de todos por qualquer capricho ou contrariedade.

Certo dia, após insultá-lo com palavras ásperas durante horas no pátio de casa sem que o filósofo respondesse uma única palavra de raiva, a mulher jogou-lhe na cabeça um balde cheio de água fria e suja para fazê-lo perder a paciência.

O filósofo, enxugando o rosto com a sua capa com total calma, disse aos amigos presentes com um sorriso sereno: "Depois de tantos trovões da senhora minha esposa, era natural que viesse a chuva."

Os amigos admiraram a sua extraordinária paciência espiritual. O filósofo explicou que a paciência exercitada no segredo do lar com as fraquezas da esposa era a sua melhor escola de virtude, e que aquele que quer vencer os inimigos no mundo deve aprender a vencer primeiro a própria raiva dentro de casa.`,
  },
  {
    title: "A Justiça do Rei",
    author: "Padre Manuel Bernardes",
    year: 1706,
    category: "Contos de virtudes",
    slug: "a-justica-do-rei-padre-manuel-bernardes",
    content: `Um rei justo e temente a Deus estabeleceu uma lei severa no seu reino: "Qualquer pessoa que for pega em adultério ou roubo grave será punida com a perda de ambos os olhos, para que sirva de exemplo a todos os cidadãos." A lei era cumprida com rigor por seus juízes.

Por uma infelicidade do destino, o próprio filho do rei foi pego em flagrante num roubo grave e levado ao tribunal. O povo e os juízes estavam ansiosos: o rei perdoaria o filho violando a própria lei, ou puniria o filho com a cegueira demonstrando falta de amor paterno?

O rei subiu ao trono de julgamento e ordenou que a lei fosse cumprida, mas de uma forma extraordinária que salvou a justiça e revelou o seu amor de pai: mandou que arrancassem um olho do filho culpado e um olho dele próprio.

O rei sacrificou a sua própria vista para pagar metade da pena do filho culpado. O povo compreendeu a gravidade da lei e a profundidade da misericórdia do rei, que soube ser justo com a lei e generoso com o próprio sangue, governando com o exemplo de amor.`,
  },
  {
    title: "O Exemplo da Caridade",
    author: "Padre Manuel Bernardes",
    year: 1706,
    category: "Contos de virtudes",
    slug: "o-exemplo-da-caridade-padre-manuel-bernardes",
    content: `Um comerciante rico viajava por uma estrada de montanha quando encontrou um homem pobre deitado à beira do caminho, trêmulo de frio e quase moribundo devido à fome. O comerciante, sentindo uma profunda compaixão espiritual, desceu do seu cavalo e cobriu o pobre com a sua própria capa de pele.

O comerciante levou o homem pobre até uma hospedaria próxima, pagou ao dono do local pelo alimento, pelo banho e pela cura do enfermo por várias semanas, e disse-lhe: "Cuida bem dele com caridade, e tudo o que gastares a mais eu te pagarei no meu regresso."

Enquanto viajava, o comerciante sentiu uma paz e uma alegria interior que nunca experimentara com as suas grandes transações comerciais. Compreendeu que o ouro guardado na arca traz apenas preocupações, ao passo que o ouro gasto na caridade silenciosa com os necessitados transforma-se em tesouro imperecível no céu.`,
  },
  {
    title: "A Temperança do Monge",
    author: "Padre Manuel Bernardes",
    year: 1706,
    category: "Contos de virtudes",
    slug: "a-temperanca-do-monge-padre-manuel-bernardes",
    content: `No mosteiro de Alcobaça vivia um monge idoso que passara cinquenta anos na virtude da temperança e da moderação no alimento. Sua única refeição diária consistia em pão de centeio, ervas amargas e água limpa da fonte, sem nunca provar carnes ou vinhos finos.

Um jovem monge, achando aquela severidade excessiva e querendo testar a sua virtude, trouxe-lhe um prato de peixe assado perfumado com especiarias finas e ofereceu-lho: "Pai, come deste peixe bento, pois o corpo também precisa de alegria!"

O velho monge aceitou o prato com caridade e agradeceu ao jovem monge pelo presente. Mas em vez de comê-lo, dividiu o peixe com um servo doente que trabalhava no jardim do convento, continuando a comer as suas ervas secas com a mesma paz de espírito.

O velho monge explicou-lhe com doçura: "A verdadeira alegria do monge não está no sabor do peixe que passa pela garganta, mas na temperança que vence os desejos da carne e na caridade que distribui o melhor de si aos outros."`,
  },
  {
    title: "O Pescador Generoso",
    author: "Padre Manuel Bernardes",
    year: 1706,
    category: "Contos de virtudes",
    slug: "o-pescador-generoso-padre-manuel-bernardes",
    content: `Um pescador pobre vivia com a sua esposa e os seus filhos pequenos numa velha choupana à beira-mar. Seu único sustento vinha do peixe que capturava diariamente no seu barco de madeira sob o sol e o vento do mar.

Certa noite de tempestade furiosa, a esposa de um pescador vizinho morreu na choupana próxima, deixando dois bebês recém-nascidos sozinhos no berço de vime. O pescador pobre entrou na cabana vizinha, recolheu os dois órfãos no peito e trouxe-os para a sua própria casa.

A esposa do pescador pobre perguntou-lhe preocupada com a comida: "Como vamos alimentar mais dois bebês se mal temos pão para os nossos filhos?" O pescador respondeu com fé inabalável na Providência: "Deus que dá a vida não deixará faltar o sustento. Nós trabalharemos mais, comeremos menos e dividiremos o nosso pão com os órfãos com amor."

À medida que os anos passavam, a pescaria do pescador pobre tornou-se abundante e a sua casa nunca passou fome, mostrando que a caridade feita aos necessitados atrai a bênção de Deus sobre toda a família justa.`,
  },
  {
    title: "O Perdão do Ofendido",
    author: "Padre Manuel Bernardes",
    year: 1706,
    category: "Contos de virtudes",
    slug: "o-perdao-do-ofendido-padre-manuel-bernardes",
    content: `Havia na cidade de Évora um homem justo que fora falsamente acusado de um crime grave por um inimigo invejoso. Devido à mentira do outro, o homem justo perdeu o seu emprego, foi humilhado em público e passou um ano na prisão de pedra.

Mais tarde, a verdade veio à tona e o acusador mentiroso caiu na desgraça. Foi condenado ao exílio e perdeu todos os seus bens na miséria. Doente e abandonado por todos na estrada pública, o acusador aguardava a morte deitado sob uma oliveira.

O homem justo, sabendo da situação do seu inimigo, foi ao seu encontro na estrada. Em vez de se vingar com palavras duras, trouxe consigo um carro de bois, recolheu o enfermo, levou-o para a sua própria casa, tratou da sua saúde e cuidou dele com caridade contínua.

O acusador, chorando de arrependimento, perguntou-lhe: "Por que me tratas com tanto amor se eu destruí a tua vida?" O homem justo respondeu: "Cristo me ensinou a perdoar os inimigos e a amar os que nos odeiam. O meu perdão é o teu caminho de paz e a minha salvação espiritual."`,
  },
  {
    title: "A Humildade do Sábio",
    author: "Padre Manuel Bernardes",
    year: 1706,
    category: "Contos de virtudes",
    slug: "a-humildade-do-sabio-padre-manuel-bernardes",
    content: `Um doutor em teologia muito famoso por sua grande ciência e por escrever volumosos tratados de filosofia viajava por uma estrada de Portugal quando se perdeu na floresta ao cair da noite. Encontrou abrigo na cabana de um pastor de ovelhas muito simples e analfabeto.

Durante o jantar, o teólogo começou a discursar sobre as escrituras com termos complexos, querendo demonstrar a sua superioridade intelectual sobre o pastor simples. O pastor ouvia tudo em silêncio com respeito e modéstia.

Ao amanhecer, o teólogo pediu ao pastor que o guiasse até a estrada real. No caminho, cruzaram com um lobo feroz. O pastor, com a sua agilidade e conhecimento da natureza, afugentou o lobo com o seu cajado de madeira protegendo a vida do teólogo apavorado.

O teólogo agradeceu a salvação de sua vida. O pastor disse-lhe com simplicidade: "A tua ciência ensina a falar de Deus com belas palavras; a minha simplicidade ensina a servir a Deus no silêncio da floresta protegendo a vida dos irmãos." O teólogo compreendeu a lição e aprendeu a valorizar a humildade prática acima de qualquer orgulho intelectual.`,
  },
  {
    title: "O Caminho do Céu",
    author: "Padre Manuel Bernardes",
    year: 1706,
    category: "Contos de virtudes",
    slug: "o-caminho-do-ceu-padre-manuel-bernardes",
    content: `Um jovem monge perguntou ao abade do mosteiro qual era o caminho mais curto e seguro para se alcançar o Reino do Céu e a união perfeita com Deus na eternidade.

O abade justo levou o jovem monge até a entrada do cemitério do convento e disse-lhe: "Vai e insulta os mortos que estão sepultados nas covas! Grita-lhes que foram vaidosos, orgulhosos e pecadores!" O jovem monge fez como lhe fora ordenado e voltou. O abade perguntou: "Que responderam os mortos?" E o monge disse: "Nada, pai! Ficaram em silêncio."

O abade ordenou: "Agora vai e elogia-os com palavras doces! Grita-lhes que foram santos, virtuosos e dignos de glória eterna!" O monge fez e voltou. O abade perguntou: "Que responderam?" E o monge disse: "Nada, pai! Ficaram em silêncio igual."

O abade explicou-lhe: "Eis o caminho do céu! Sê como os mortos diante das vozes do mundo orgulhoso. Não te exaltes com os elogios da vaidade terrena nem te perturbes com os insultos das injustiças dos homens. Vive na humildade silenciosa, no trabalho honesto e no amor a Deus, pois só as boas ações permanecem na eternidade."`,
  },
]

let generatedCount = 0

stories.forEach(story => {
  const fileName = `${story.slug}.md`
  const filePath = path.join(contosDir, fileName)

  const fileContent = `---
title: "${story.title}"
author: "${story.author}"
year: ${story.year}
category: "${story.category}"
slug: "${story.slug}"
---

${story.content}
`

  fs.writeFileSync(filePath, fileContent, "utf-8")
  console.log(`Generated: ${fileName}`)
  generatedCount++
})

console.log(`\nDone. Generated ${generatedCount} virtuous stories.\n`)
