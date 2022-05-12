import { Link as RouterLink } from 'react-router-dom'
import { auth, db } from '../../util/firebase'
import { signOut } from 'firebase/auth'
import { ref, update } from 'firebase/database'
import { useObjectVal } from 'react-firebase-hooks/database'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import ThemeModeIcon from '@mui/icons-material/Brightness4'
import LogoutIcon from '@mui/icons-material/Logout'
import MealPlanIcon from '@mui/icons-material/MenuBook'
import RecipesIcon from '@mui/icons-material/RestaurantMenu'
import ShoppingListIcon from '@mui/icons-material/FormatListBulleted'

export default function Menu(props) {
  const { user, toggleMenu } = props

  const r = ref(db, `users/${user.uid}/theme-mode`)
  const [themeMode, themeModeLoading, themeModeError] = useObjectVal(r)
  const otherThemeMode =
    themeMode === null || themeMode === 'dark' ? 'light' : 'dark'

  const setThemeMode = async (mode) => {
    try {
      await update(ref(db), {
        [`users/${user.uid}/theme-mode`]: mode,
      })
    } catch (err) {
      // todo: report error
    }
  }

  if (themeModeLoading || themeModeError) return null

  return (
    <Box
      sx={{ width: 250 }}
      role='presentation'
      onClick={toggleMenu}
      onKeyDown={toggleMenu}
    >
      <List>
        <ListItem button to='/recipes' component={RouterLink}>
          <ListItemIcon>
            <RecipesIcon />
          </ListItemIcon>
          <ListItemText primary='Recipes' />
        </ListItem>

        <ListItem button to='/meal-plans' component={RouterLink}>
          <ListItemIcon>
            <MealPlanIcon />
          </ListItemIcon>
          <ListItemText primary='Meal Plans' />
        </ListItem>

        <ListItem button to='/shopping-list' component={RouterLink}>
          <ListItemIcon>
            <ShoppingListIcon />
          </ListItemIcon>
          <ListItemText primary='Shopping list' />
        </ListItem>

        <Divider sx={{ mt: 2, mb: 2 }} />

        <ListItem button onClick={() => setThemeMode(otherThemeMode)}>
          <ListItemIcon>
            <ThemeModeIcon />
          </ListItemIcon>
          <ListItemText primary={`Switch to ${otherThemeMode} mode`} />
        </ListItem>

        <ListItem button onClick={() => signOut(auth)}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItem>
      </List>
    </Box>
  )
}
