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
          frontmatter {
            slug
            title
          }
          id
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

  stories.forEach(node => {
    if (node.frontmatter.slug) {
      createPage({
        path: `/conto/${node.frontmatter.slug}`,
        component: storyTemplate,
        context: {
          id: node.id,
          slug: node.frontmatter.slug,
        },
      })
    }
  })
}
