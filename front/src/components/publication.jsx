import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export class Publicacion extends React.Component {
  state = {
    username: "",
    date: "",
    content: {
      texto: "",
      foto: "",
    },
    tieneFoto: false,
    tieneTexto: false,
    // content puede ser {text:'dsfdf', photo:'wwwl.asdfdsf'}
  };
  componentDidMount = () => {
    var datosUsuario = this.props.data;
    this.setState({
      username: datosUsuario.usuario,
      date: String(datosUsuario.fecha),
      content: {
        texto: datosUsuario.contenido,
        foto: `${process.env.REACT_APP_PHOTO_URL}/${datosUsuario.imagen}`,
      },
    });
    if (datosUsuario.imagen !== "") {
      this.setState({ tieneFoto: true });
    }
    if (datosUsuario.contenido !== "") {
      this.setState({ tieneTexto: true });
    }
  };

  render() {
    return (
      <Paper
        sx={{
          p: 2,
          margin: "auto",
          marginTop: 3,
          maxWidth: 600,
          flexGrow: 1,
          backgroundColor: "#f79592",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h6" component="div">
                  {this.state.username}
                </Typography>
                {this.state.tieneTexto === true && (
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ textAlign: "left" }}
                  >
                    {this.state.content.texto}
                  </Typography>
                )}
                {this.state.tieneFoto === true && (
                  <Grid container justifyContent="center">
                    <ButtonBase>
                      <Img
                        sx={{ width: 200, maxHeight: 250, margin: "auto" }}
                        alt="complex"
                        src={this.state.content.foto}
                      />
                    </ButtonBase>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <div className="fecha">
              <Grid item sx={{ textAlign: "right" }}>
                <Typography variant="subtitle1" component="div">
                  {this.state.date}
                </Typography>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
