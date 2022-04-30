import React from "react";
import { Appbar } from "../components/appBar";
import Grid from "@mui/material/Grid";
import { CrearPubliacion } from "../components/crearPublicacion";
import { Publicacion } from "../components/publication";
import { NavBar } from "../components/navBar";
import Button from "@mui/material/Button";
import {withRouter} from '../router';
import CircularProgress from '@mui/material/CircularProgress';

class Noticias extends React.Component {
  state = {
    data: [],
    totalResults: 0,
    cargando: false
  };

  updateNews(ide){
    alert("Actualice la pagina, publicacion exitosa")
  }

  componentDidMount = () => {
    this.setState({id:this.props.location.state.id})
    this.loadData(this.props.location.state.id)
  };

  toTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }


  loadData(idUsuario){
    var sendJson = JSON.stringify({id:idUsuario})
    // console.log(sendJson)
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/obtenerPublicaciones`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body:sendJson
    }).then(async response => {
      const json = await response.json()
      for (let i = 0; i < json.data.length; i++) {
        var element = json.data[i];
        element.number=i
      }
      this.setState({data:json.data})
    }).catch(error => {
        console.log(error)
        alert("bad request")
    });
  }

  render() {
    return (
      <Grid
        container
        sx={{ margin: "auto", marginBottom: 2 }}
        justifyContent="center"
      >
        <Appbar />
        {/* navegacion  */}
        <NavBar />
        {/* boton para crear publicaciones */}
        <Grid item sx={{ marginTop: 1 }} xs={6} md={8}>
          <CrearPubliacion idUsuario={this.props.location.state.id} update={this.updateNews}/>
        </Grid>
        {/* vista de las publicaciones */}
        <Grid container justifyContent="center" spacing={1}>
          {this.state.data.map((value) => (
            <Grid key={value.number} item xs={9} sm={12}>
              <Publicacion data={value} />
            </Grid>
          ))}
        </Grid>
        <Grid item sx={{ marginTop: 1 }} xs={6} md={8}>
          {this.state.cargando === false ? (
            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#38598b",
                ":hover": {
                  backgroundColor: "#113f67",
                },
                marginBottom: 3,
              }}
              component="span"
              onClick={() => this.toTop()}
            >
              To Top
            </Button>
          ) : (
            <CircularProgress color="secondary" />
          )}
        </Grid>
      </Grid>
    );
  }

}

export const Publicaciones = withRouter(Noticias)
