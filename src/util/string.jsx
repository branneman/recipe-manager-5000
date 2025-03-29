export const capitalise = (s) => s.substr(0, 1).toUpperCase() + s.substr(1)

/**
 * Splits text into parts, identifying URLs
 * @param {string} text - The text to process
 * @returns {Array} Array of text parts, where URLs are identified
 */
const urlPattern = /(https?:\/\/[^\s]+)/g
export const splitUrls = (text) => {
  const parts = text.split(urlPattern)
  return parts
    .filter((part) => part !== '' || text === '')
    .map((part) => ({
      text: part,
      isUrl: part.match(urlPattern) !== null,
    }))
}

/**
 * Splits text into parts and converts URLs into React elements
 * @param {string} text - The text to process
 * @param {Function} LinkComponent - The component to use for links (e.g. MUI Link)
 * @param {Object} linkProps - Additional props to pass to the Link component
 * @returns {Array} Array of text parts and link elements
 */
export const linkifyText = (text, LinkComponent, linkProps = {}) => {
  const parts = splitUrls(text)
  return parts.map((part, index) => {
    if (part.isUrl) {
      return (
        <LinkComponent
          key={index}
          href={part.text}
          target="_blank"
          {...linkProps}
        >
          {part.text}
        </LinkComponent>
      )
    }
    return part.text
  })
}
