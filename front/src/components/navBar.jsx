import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import GroupIcon from "@mui/icons-material/Group";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LogoutIcon from '@mui/icons-material/Logout';
import {withRouter} from '../router';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

 class NavB extends React.Component {
  state = {
    open: false,
  };

  componentDidMount = () => {
    this.setState({id:this.props.location.state.id})
    this.getRequestCount(this.props.location.state.id)
  }

  getRequestCount(idU){
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/contarSolicitudes`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({id:idU})
    }).then(async response => {
      const json = await response.json()
      this.setState({numero:json.data[0].nuevas})
    })
  }

  toggleDrawer(valor) {
    this.setState({ open: valor });
  }

  goToPublications = () => {
    this.props.navigate("/Publications",{state:{id:this.state.id}});
  };
  goToFriends = () => {
    this.props.navigate("/Friends",{state:{id:this.state.id}});
  };
  goToPeople = () => {
    this.props.navigate("/People",{state:{id:this.state.id}});
  };
  goToProfile = () => {
    this.props.navigate("/Profile",{state:{id:this.state.id}});
  };
  goToRequest = () => {
    this.props.navigate("/Request",{state:{id:this.state.id}});
  };
  goOut= () =>{
    this.props.navigate("/");
  }

  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <Grid container justifyContent="left" sx={{ marginTop: 9 }}>
          <Grid item md={1}>
            <Button
              onClick={() => this.toggleDrawer(true)}
              endIcon={<MenuIcon sx={{ color: "black" }} />}
            ></Button>
          </Grid>
          <Drawer
            anchor="left"
            open={this.state.open}
            onClose={() => this.toggleDrawer(false)}
          >
            <Box
              role="presentation"
              onClick={() => this.toggleDrawer(false)}
              onKeyDown={() => this.toggleDrawer(false)}
            >
              <List>
                <ListItem button onClick={this.goToPublications}>
                  <ListItemIcon>
                    <NewspaperIcon />
                  </ListItemIcon>
                  <ListItemText primary="Publicaciones" />
                </ListItem>
                <ListItem button onClick={this.goToPeople}>
                  <ListItemIcon>
                    <PersonSearchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Buscar Amigos" />
                </ListItem>
                <ListItem button onClick={this.goToFriends}>
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Ver Amigos" />
                </ListItem>
                <ListItem button onClick={this.goToProfile}>
                  <ListItemIcon>
                    <AppRegistrationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Modificar Usuario" />
                </ListItem>
                <ListItem button onClick={this.goToRequest}>
                  <ListItemIcon>
                    <ContactMailIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Ver Solicitudes "+this.state.numero}/>
                </ListItem>
                <ListItem button onClick={this.goOut}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Salir" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </Grid>
      </ThemeProvider>
    );
  }
}

export const NavBar = withRouter(NavB)
