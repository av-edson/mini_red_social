import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import {withRouter} from '../router';

const theme = createTheme();

class Log extends React.Component {
  state = {
    url: "",
    username: "",
    pass: "",
    loginComplete: false,
    navigate: null,
  };

  componentDidMount = () => {
    this.setState({
      url: "https://source.unsplash.com/random",
    });
    console.log(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/login`);
  };

  fetchLogin = () => {
    var sendJson = {usuario:this.state.username.toString(),contra:this.state.pass.toString()}
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/login`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify(sendJson)
    }).then(async response => {
      const json = await response.json()
      // console.log(json)
      if (json.id === -1){
          alert("Revise sus credenciales")
      }else{
        this.props.navigate("/Profile",{state:{id:json.id}});
      }
    }).catch((e) => { 
        console.log(e)
        alert("bad request")
    });
  };

  goToSing = () => {
    this.props.navigate("/SingIn")
  };

  render() {
    
    return (
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={6}
            sx={{
              backgroundImage: "url(" + this.state.url + ")",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <Grid
            item
            xs={12}
            sm={8}
            md={6}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "primary",
              }}
            >
              <Avatar sx={{ m: 5, bgcolor: "primary.main" }}>
                <LockOutlinedIcon />
              </Avatar>

              <Typography component="h1" variant="h5">
                Inicio de Sesion
              </Typography>

              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Nombre de Usuario"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  variant="standard"
                  color="primary"
                  onChange={(e) => {
                    this.setState({ username: e.target.value });
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  variant="standard"
                  color="primary"
                  onChange={(e) => {
                    this.setState({ pass: e.target.value });
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 7, mb: 2 }}
                  color="primary"
                  endIcon={<LoginIcon />}
                  onClick={this.fetchLogin}
                >
                  Log In
                </Button>

                <Grid container justifyContent="flex-end">
                  <Button
                    color="primary"
                    endIcon={<AppRegistrationIcon />}
                    variant="outlined"
                    onClick={this.goToSing}
                    sx={{
                      ":hover": {
                        bgcolor: "primary.main",
                        color: "white",
                      },
                    }}
                  >
                    No tengo cuenta
                  </Button>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }
}

export const LogIn =  withRouter(Log);