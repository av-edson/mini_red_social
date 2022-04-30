import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import Modal from "@mui/material/Modal";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Fade from "@mui/material/Fade";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import CancelIcon from "@mui/icons-material/Cancel";
import {withRouter} from '../router';

const Input = styled("input")({
  display: "none",
});

class Crear extends React.Component {
  state = {
    open: false,
    cargado: false,
    imageURL: "",
    image64: "",
    publicacionText: ""
  };

  componentDidMount = () =>{
    this.setState({updateNews:this.props.update})
    // console.log(this.props.idUsuario)
    this.setState({id:this.props.idUsuario})
  }

  handleOpen() {
    this.setState({ open: true });
  }
  handleClose() {
    this.setState({ open: false,
      cargado: false,
      imageURL: "",
      image64: "",
      publicacionText: "" });
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

  SubirFoto(event) {
    this.setState({ cargado: true });
    var file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    this.setState({ imageURL: URL.createObjectURL(file) });
    reader.onload = () => {
      this.setState({ image64: reader.result
        .toString()
        .replace("data:image/png;base64,", "")
        .replace("data:image/jpeg;base64,", "")
        .replace("data:image/jpg;base64,", "") });
    };
  }

  SubirPublicacion() {
    var sendJson = {id:this.state.id,contenido:this.state.publicacionText,imagen:this.state.image64}
    // console.log(sendJson)
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/crearPublicacion`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify(sendJson)
    }).then(async response => {
      await response.json()
      if (response.status!==200){
          alert("No se pudo subir tu publicacion")
      }else{
        this.handleClose()
      }
    }).then(() => {
      this.state.updateNews(this.state.id)
      window.location.reload(false)
    }).catch((e) => {
      console.log(e)
        alert("bad request")
    });
  }
  CancelarPublicacion() {
    this.handleClose();
  }

  render() {
    return (
      <Grid>
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <Button
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#38598b",
              ":hover": {
                backgroundColor: "#113f67",
              },
            }}
            component="span"
            startIcon={<FiberNewIcon />}
            onClick={() => this.handleOpen()}
          >
            Comparte tus pensamientos!
          </Button>
          <Modal
            open={this.state.open}
            onClose={() => this.handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sm={3}
            md={4}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "#d5e1df",
                border: "2px solid #000",
                boxShadow: 24,
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ mt: 2, textAlign: "center", marginBottom: 2 }}
              >
                Crea una publicacion
              </Typography>
              <Grid
                container
                sx={{ justifyContent: "center", marginBottom: 2 }}
              >
                <TextareaAutosize
                  id="textArea"
                  onChange={(e) => {
                    this.setState({ publicacionText: e.target.value });
                  }}
                  aria-label="empty textarea"
                  placeholder="Que estas pensando?"
                  style={{ width: 300, fontSize: 17 }}
                />
              </Grid>

              <Grid container sx={{ justifyContent: "center" }}>
                <Fade in={this.state.cargado}>{this.mostrarFoto()}</Fade>
              </Grid>
              <Grid container spacing={1} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs="auto">
                  <label htmlFor="contained-button-file">
                    <Input
                      accept="image/*"
                      id="contained-button-file"
                      type="file"
                      onChange={(event) => this.SubirFoto(event)}
                    />
                    <Button
                      fullWidth
                      color="success"
                      variant="contained"
                      sx={{ mt: 3 }}
                      component="span"
                      startIcon={<AddPhotoAlternateIcon />}
                    >
                      Agregar foto
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={2} sm={3} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      backgroundColor: "#e8630a",
                      ":hover": {
                        backgroundColor: "#C73D20",
                      },
                    }}
                    component="span"
                    startIcon={<ArrowCircleUpIcon />}
                    onClick={() => this.SubirPublicacion()}
                  >
                    Subir
                  </Button>
                </Grid>
                <Grid item xs={1} sm={1} md={0.7}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      backgroundColor: "#dc2f2f",
                      ":hover": {
                        backgroundColor: "#C70039",
                      },
                    }}
                    component="span"
                    startIcon={<CancelIcon />}
                    onClick={() => this.CancelarPublicacion()}
                  ></Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </Box>
      </Grid>
    );
  }
}

export const CrearPubliacion = withRouter(Crear)