import LogoIcon from './logo.png'

import Avatar from '@mui/material/Avatar'

export default function Logo(props) {
  const { size, sx } = props

  return (
    <Avatar
      alt='RECIPE MANAGER 5000'
      src={LogoIcon}
      variant='square'
      sx={{ width: size, height: size, ...(sx || {}) }}
    />
  )
}
