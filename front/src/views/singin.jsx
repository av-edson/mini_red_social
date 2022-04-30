import React from "react";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {withRouter} from '../router';

const Input = styled("input")({
  display: "none",
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

const botonTheme = createTheme({
  palette: {
    primary: {
      main: "#c24d2c",
    },
    secondary: {
      main: "#3e4a61",
    },
    warning: {
      main: "#DAA520",
    },
  },
});

class Sing extends React.Component {
  state = {
    cargado: false,
    estado: true,
    imageURL: "",
    image64: "",
    username: "",
    fullname: "",
    pass1: "",
    pass2: "",
  };

  render() {
    return (
      <Grid sx={{ marginLeft: "1%", marginRight: "1%" }}>
        <ThemeProvider theme={darkTheme}>
          <AppBar>
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Registro
              </Typography>
            </Toolbar>
          </AppBar>
        </ThemeProvider>

        <ThemeProvider theme={botonTheme}>
          <Box
            sx={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 7,
            }}
          >
            <Typography component="h1" variant="h5">
              Formulario de Registro
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="user"
                label="Nombre de Usuario"
                autoFocus
                variant="standard"
                color="grey"
                onChange={(e) => {
                  this.setState({ username: e.target.value });
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="name"
                label="Nombre completo"
                variant="standard"
                color="grey"
                onChange={(e) => {
                  this.setState({ fullname: e.target.value });
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                color="grey"
                variant="standard"
                onChange={(e) => {
                  this.setState({ pass1: e.target.value });
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Repita la Contraseña"
                type="password"
                id="password2"
                autoComplete="current-password"
                color="grey"
                variant="standard"
                onChange={(e) => {
                  this.setState({ pass2: e.target.value });
                }}
              />

              <Grid container sx={{ justifyContent: "center" }}>
                <Fade in={this.state.cargado}>{this.mostrarFoto()}</Fade>
              </Grid>

              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={(event) => this.Subir(event)}
                />
                <Button
                  fullWidth
                  color="warning"
                  variant="contained"
                  sx={{ mt: 3 }}
                  component="span"
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  Subir Foto
                </Button>
              </label>

              <Grid container spacing={2}>
                <Grid item xs>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 4, marginRight: 5 }}
                    onClick={this.fetchSing}
                  >
                    Sign In
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4 }}
                    onClick={() => {
                      this.props.navigate("/");
                    }}
                  >
                    Tengo Cuenta
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </ThemeProvider>
      </Grid>
    );
  }

  Subir(event) {
    this.setState({ cargado: true });
    var file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    this.setState({ imageURL: URL.createObjectURL(file) });
    reader.onload = () => {
      this.setState({
        image64: reader.result
          .toString()
          .replace("data:image/png;base64,", "")
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/jpg;base64,", ""),
      });
    };
  }

  mostrarFoto() {
    let url = this.state.imageURL;
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="200"
          image={url}
          alt="green iguana"
        />
      </Card>
    );
  }

  fetchSing = () => {
    if (this.state.pass1 !== this.state.pass2) {
      alert("las contraseñas son distintas");
      return;
    }

    var sendJson = {
      username: this.state.username,
      fullname: this.state.fullname,
      pass: this.state.pass1,
      photo: this.state.image64.toString(),
    };
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/registry`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify(sendJson)
    }).then(async response => {
      await response.json()
      console.log(response.ok)
      if (!response.ok){
          alert("No se pudo registrar el usuario")
      }else{
        alert("Registrado con exito")
        this.setState({cargado: false,
          estado: true,
          imageURL: "",
          image64: "",
          username: "",
          fullname: "",
          pass1: "",
          pass2: "",})
          // console.log("Usuario registrado con exito")
      }
    }).catch(() => {
        alert("bad request")
    });
  };
}

export const SingIn =  withRouter(Sing);