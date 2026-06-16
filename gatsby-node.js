const path = require("path")

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      title: String!
      author: String
      year: String
      category: String
      slug: String!
    }
  `
  createTypes(typeDefs)
}

// Mulberry32 generator for seeded pseudo-random numbers
const mulberry32 = a => {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Seeded shuffle helper
const seededShuffle = (array, seed) => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  const rand = mulberry32(Math.abs(hash))
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const getSuggestions = (currentStory, allStories) => {
  const currentSlug = currentStory.frontmatter.slug
  const otherStories = allStories.filter(
    s => s.frontmatter.slug !== currentSlug
  )

  // Sort stories: same category first, same author second, other stories last
  const sorted = [...otherStories].sort((a, b) => {
    const catA =
      a.frontmatter.category === currentStory.frontmatter.category ? 1 : 0
    const catB =
      b.frontmatter.category === currentStory.frontmatter.category ? 1 : 0
    if (catA !== catB) return catB - catA // same category first

    const autA =
      a.frontmatter.author === currentStory.frontmatter.author ? 1 : 0
    const autB =
      b.frontmatter.author === currentStory.frontmatter.author ? 1 : 0
    return autB - autA // same author second
  })

  // Seeded shuffle top 8 related stories to give variety, then pick top 3
  const pool = sorted.slice(0, 8)
  const shuffledPool = seededShuffle(pool, currentSlug)
  return shuffledPool.slice(0, 3)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          id
          timeToRead
          frontmatter {
            slug
            title
            author
            year
            category
          }
          excerpt(pruneLength: 120)
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const storyTemplate = path.resolve(`src/templates/conto-template.js`)
  const stories = result.data.allMarkdownRemark.nodes

  // Pre-serialize all stories to pass to pageContext
  const allStoriesContext = stories.map(s => ({
    id: s.id,
    timeToRead: s.timeToRead,
    frontmatter: {
      slug: s.frontmatter.slug,
      title: s.frontmatter.title,
      author: s.frontmatter.author,
      year: s.frontmatter.year,
      category: s.frontmatter.category,
    },
    excerpt: s.excerpt,
  }))

  stories.forEach(node => {
    if (node.frontmatter.slug) {
      const suggestions = getSuggestions(node, allStoriesContext)
      createPage({
        path: `/conto/${node.frontmatter.slug}`,
        component: storyTemplate,
        context: {
          id: node.id,
          slug: node.frontmatter.slug,
          suggestions,
        },
      })
    }
  })
}
