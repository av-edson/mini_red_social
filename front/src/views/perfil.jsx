import React from "react";

import Grid from "@mui/material/Grid";
import { Appbar } from "../components/appBar";
import { NavBar } from "../components/navBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Fade from "@mui/material/Fade";
import {withRouter} from '../router';


const Input = styled("input")({
  display: "none",
});

class Prof extends React.Component {
  state = {
    photo: "",
    username: "",
    fullname: "",
    pass: "",
    pass2:"",
    id:0
  };

  componentDidMount = () => {
    this.getData(this.props.location.state.id)
  };

  getData(idUsuario){
    var sendJson = JSON.stringify({id:idUsuario})
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/obtenerUsuario`,{
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body:sendJson
    }).then(async response =>{
      const json = await response.json() 
      if (json.id===-1) {alert("no user");return;}
      // console.log(`${process.env.REACT_APP_PHOTO_URL}/${json.foto}`)
      this.setState({photo: `${process.env.REACT_APP_PHOTO_URL}/${json.foto}`,
      username: json.usuario,
      fullname: json.nombre,
      pass: json.contra,id:json.id})
    })
    
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
  updateUser(){
    if (this.state.pass !== this.state.pass2) {alert("ambas claves deben coincidir")}
    else{
      var sendJson = {id:this.state.id,
        username:this.state.username,
        fullname:this.state.fullname,
        pass:this.state.pass,
        photo:this.state.image64
    }

      fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/editarUsuario`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify(sendJson)
    }).then(async response => {
      const json = await response.json()
      if (json.status!==200) {alert('No se pudieron actualizar los datos')}
      else{
        alert('datos actualizados con exito')
        this.getData(this.state.id)
        window.location.reload(false);
      }
    }).catch((e) => { 
        console.log(e)
        alert("bad request")
    });
    }
  }

  render() {
    return (
      <Grid
        container
        sx={{ margin: "auto", marginBottom: 2 }}
        justifyContent="center"
      >
        <Appbar />
        <NavBar/>
        <Grid item xs={8} md={8}>
          <Card variant="outlined">
            <CardContent sx={{backgroundColor:"#e5e3df"}}>
              <CardMedia component="img" height="300" src={this.state.photo} />
              <Box component="form" sx={{ mt: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="success.main"
                >
                  Formulario Cambio de Datos
                </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Nombre de Usuario"
                  value={this.state.username}
                  name="email"
                  autoComplete="email"
                  variant="standard"
                  color="secondary"
                  onChange={(e) => {
                    this.setState({ username: e.target.value });
                  }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="fulname"
                  label="Nombre Completo"
                  value={this.state.fullname}
                  name="fulname"
                  variant="standard"
                  color="secondary"
                  onChange={(e) => {
                    this.setState({ fullname: e.target.value });
                  }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Contraseña"
                  value={this.state.pass}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  variant="standard"
                  color="secondary"
                  onChange={(e) => {
                    this.setState({ pass: e.target.value });
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password2"
                  label="Confirmar Contraseña"
                  type="password"
                  id="password2"
                  autoComplete="current-password"
                  variant="standard"
                  color="secondary"
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
                    color="primary"
                    variant="contained"
                    sx={{ mt: 3 }}
                    component="span"
                    startIcon={<AddPhotoAlternateIcon />}
                  >
                    Cambiar Foto
                  </Button>
                </label>
                <Grid container justifyContent="flex-end">
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={()=>this.updateUser()}
                    sx={{
                      marginTop:3,
                      ":hover": {
                        bgcolor: "primary.main",
                        color: "white",
                      },
                    }}
                  >
                    Realizar Cambios
                  </Button>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export const Profile =  withRouter(Prof);
