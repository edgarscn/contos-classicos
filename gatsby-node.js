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
      createPage({
        path: `/conto/${node.frontmatter.slug}`,
        component: storyTemplate,
        context: {
          id: node.id,
          slug: node.frontmatter.slug,
          allStories: allStoriesContext,
        },
      })
    }
  })
}
