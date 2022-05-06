import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import RecipesIcon from '@mui/icons-material/RestaurantMenu'
import MealPlanIcon from '@mui/icons-material/MenuBook'
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
        <ListItem button>
          <ListItemIcon>
            <RecipesIcon />
          </ListItemIcon>
          <ListItemText primary='Recipes' />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <MealPlanIcon />
          </ListItemIcon>
          <ListItemText primary='Meal Plans' />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <ShoppingListIcon />
          </ListItemIcon>
          <ListItemText primary='Shopping list' />
        </ListItem>
      </List>
    </Box>
  )
}
