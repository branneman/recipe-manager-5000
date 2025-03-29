import { validate as isUuid } from 'uuid'

import { linkifyText } from '../../util/string'
import RecipeMention from './RecipeMention'

import Link from '@mui/material/Link'

export default function RecipeMeal(props) {
  const { text, linkify, ingredients } = props

  if (isUuid(text)) {
    return <RecipeMention id={text} ingredients={ingredients} />
  }

  if (linkify === true) {
    return linkifyText(text, Link)
  }

  return text
}
