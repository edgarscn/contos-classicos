/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 */

exports.onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: `pt-BR` })
}
