import { validate as isUuid } from 'uuid'

import RecipeMention from '../../components/recipes/RecipeMention'

import Link from '@mui/material/Link'

export default function RecipeMeal(props) {
  const { text } = props

  if (isUuid(text)) return <RecipeMention id={text} />
  if (text.startsWith('http')) return <Link href={text}>{text}</Link>
  return text
}
