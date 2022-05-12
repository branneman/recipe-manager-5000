import { useState } from 'react'

import Logo from '../logo'
import Menu from '../menu'

import { grey } from '@mui/material/colors'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import MenuIcon from '@mui/icons-material/Menu'

export default function Header(props) {
  const { version, user } = props

  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setMenuOpen(!menuOpen)
  }

  return (
    <>
      <Drawer anchor='left' open={menuOpen} onClose={toggleMenu}>
        <Menu user={user} toggleMenu={toggleMenu} />
      </Drawer>
      <Stack direction='row' justifyContent='flex-start' spacing={2}>
        <Tooltip title='Menu'>
          <IconButton onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
        </Tooltip>

        <Stack
          direction='row'
          sx={{ cursor: 'pointer' }}
          onClick={() => (window.location.hash = '/')}
        >
          <Logo size={24} sx={{ mt: 0.75, mr: 1 }} />
          <Typography sx={{ pt: 1 }}>
            RECIPE MANAGER 5000
            <Typography component='span' sx={{ color: grey[600] }}>
              {' '}
              v{version}
            </Typography>
          </Typography>
        </Stack>
      </Stack>
    </>
  )
}
