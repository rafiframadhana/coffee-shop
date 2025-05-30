import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import ViewListIcon from '@mui/icons-material/ViewList';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setOpen(!open);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/admin' },
    { text: 'View All Products', icon: <ViewListIcon />, path: '/admin/view-products' },
    { text: 'Add Product', icon: <AddBoxIcon />, path: '/admin/add-product' },
    { text: 'Edit Product', icon: <EditIcon />, path: '/admin/edit-product' },
    { text: 'User Management', icon: <PersonIcon />, path: '/admin/user-management' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false); 
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="fixed" sx={{backgroundColor: '#1a1a1a', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <Link to="/admin" className='no-link-style'>Admin Dashboard | Coffee Culture</Link>
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box
          sx={{ width: 250, mt: 9 }}
          role="presentation"
          onKeyDown={(e) => {
            if (e.key === 'Escape') toggleDrawer();
          }}
        >
          <List>
            {menuItems.map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => handleNavigation(path)}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box sx={{ mt: 8, p: 3 }}>
      </Box>
    </>
  );
}
