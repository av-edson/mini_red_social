import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

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

export class Solicitud extends React.Component {
  state = {
    username: "av.edson",
    fullname: "edson avila",
    photo: "",
    color: "",
  };

  componentDidMount = () => {
    var datosUsuario = this.props.data;
    
    this.setState({
      username: datosUsuario.usuario,
      fullname: datosUsuario.nombre,
      photo: `${process.env.REACT_APP_PHOTO_URL}/${datosUsuario.foto}`,
      idU:this.props.UserId
    });
  };

  accept(){
    //   console.log({id:this.state.idU,userAmigo:this.state.username})
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/aceptarSolicitud`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({id:this.state.idU,userAmigo:this.state.username})
    }).then(async response => {
      const json = await response.json()
        if (json.status===200) {
            alert("se acepto la solicitud")
        }
    }).then(()=>{window.location.reload(false)})
  }
  reject(){
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/rechazarSolicitud`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({id:this.state.idU,userAmigo:this.state.username})
      }).then(async response => {
        const json = await response.json()
          if (json.status===200) {
              alert("se rechazo la solicitud")
          }
      }).then(()=>{window.location.reload(false)})
  }

  render() {
    return (
      <ThemeProvider theme={ThemePalette}>
        <Grid item>
          <Card
            variant="outlined"
            style={{ backgroundColor: "#385170"}}
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
                    <Grid item >
                    <Button sx={{
                          bgcolor: "#347474",
                          marginRight:2
                        }}
                        variant="contained"
                        onClick={()=>this.accept()}
                      >
                        Aceptar
                    </Button>
                    </Grid>
                    <Grid item>
                    <Button sx={{
                          bgcolor: "#347474",
                        }}
                        variant="contained"
                        onClick={()=>this.reject()}
                      >
                        Rechazar
                    </Button>
                    </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </ThemeProvider>
    );
  }
}
