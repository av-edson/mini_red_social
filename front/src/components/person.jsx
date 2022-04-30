import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const ThemePalette = createTheme({
  palette: {
    primary: {
      main: "#062306",
    },
    secondary: {
      main: "#0f4e2c",
    },
    warning: {
      main: "#cd7641  ",
    },
    success: {
      main: "#e5e5e5",
    },
    info: {
      main: "#e8e8bf",
    },
  },
});

export class Person extends React.Component {
  state = {
    username: "av.edson",
    fullname: "edson avila",
    photo: "",
    status: false,
    esAmigo: false,
    color: "",
  };

  componentDidMount = () => {
    var datosUsuario = this.props.data;
    
    this.setState({
      username: datosUsuario.usuario,
      fullname: datosUsuario.nombre,
      photo: `${process.env.REACT_APP_PHOTO_URL}/${datosUsuario.foto}`,
      idU:this.props.idUser
    });
    this.setState({ esAmigo: this.props.agregado });
    if (this.props.agregado) {
      this.setState({ color: "#385170" });
    } else {
      this.setState({ color: "#155263" });
    }
  };

  sendRequest() {
    this.setState({ status: true });
    console.log({id:this.state.idU,userAmigo:this.state.username})
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/enviarSolicitud`,{
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({id:this.state.idU,userAmigo:this.state.username})
    }).then(async response =>{
      const result = await response.json() 
      if(result.status===200){
        alert("solicitud enviada")
      }
    })
  }

  render() {
    return (
      <ThemeProvider theme={ThemePalette}>
        <Grid item>
          <Card
            variant="outlined"
            style={{ backgroundColor: this.state.color }}
          >
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                color="success.main"
              >
                {this.state.username}
              </Typography>
              <Typography
                gutterBottom
                variant="h7"
                component="div"
                color="success.main"
              >
                {this.state.fullname}
              </Typography> 
              <CardMedia
                component="img"
                height="140"
                alt="green iguana"
                image={this.state.photo}
                />
            </CardContent>
            <CardActions>
              <Grid container justifyContent="flex-end">
                {this.state.esAmigo === false && (
                  <div>
                    {this.state.status ? (
                      <Button
                        sx={{
                          bgcolor: "#347474",
                        }}
                        endIcon={<MarkEmailReadIcon />}
                        variant="contained"
                      >
                        Enviado
                      </Button>
                    ) : (
                      <Button
                        onClick={() => this.sendRequest()}
                        color="warning"
                        endIcon={<PersonAddIcon />}
                        variant="contained"
                        sx={{
                          ":hover": {
                            color: "black",
                          },
                        }}
                      >
                        Agregar
                      </Button>
                    )}
                  </div>
                )}
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </ThemeProvider>
    );
  }
}
