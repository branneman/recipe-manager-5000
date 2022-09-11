import { Anchorme } from 'react-anchorme'
import { validate as isUuid } from 'uuid'

import RecipeMention from '../../components/recipes/RecipeMention'

import Link from '@mui/material/Link'

export default function RecipeMeal(props) {
  const { text, linkify, ingredients } = props

  if (isUuid(text)) return <RecipeMention id={text} ingredients={ingredients} />

  if (text.startsWith('http'))
    return (
      <Link href={text} target="_blank">
        {text}
      </Link>
    )

  if (linkify === true)
    return (
      <Anchorme linkComponent={Link} target="_blank">
        {text}
      </Anchorme>
    )

  return text
}
