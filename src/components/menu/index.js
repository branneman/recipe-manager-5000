import { Link as RouterLink } from 'react-router-dom'
import { auth } from '../../util/firebase'
import { signOut } from 'firebase/auth'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import LogoutIcon from '@mui/icons-material/Logout'
import MealPlanIcon from '@mui/icons-material/MenuBook'
import RecipesIcon from '@mui/icons-material/RestaurantMenu'
import ShoppingListIcon from '@mui/icons-material/FormatListBulleted'

export default function Menu(props) {
  const { toggleMenu } = props

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

        <Divider />

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
