import { useState } from 'react'

import { auth, db } from '../../util/firebase'
import { ref } from 'firebase/database'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useObjectVal } from 'react-firebase-hooks/database'

import Menu from '../menu'

import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import MenuIcon from '@mui/icons-material/Menu'

export default function Header() {
  const [user] = useAuthState(auth)
  const r = ref(db, 'users/' + user.uid)
  const [userData, loading, error] = useObjectVal(r)

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
        <Menu toggleMenu={toggleMenu} />
      </Drawer>
      <Stack direction='row' spacing={2}>
        <Tooltip title='Menu'>
          <IconButton onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
        </Tooltip>

        {!error && !loading && userData && (
          <Typography sx={{ pt: 1 }}>Welcome {userData.name}!</Typography>
        )}
      </Stack>
    </>
  )
}
