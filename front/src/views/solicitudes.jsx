import React from "react";
import {withRouter} from '../router';
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Appbar } from "../components/appBar";
import { NavBar } from "../components/navBar";
import { Solicitud } from "../components/request";

class soli extends React.Component {
    state={
        id:0,
        data:[]
    }

    componentDidMount = () =>{
        this.setState({id:this.props.location.state.id})
        this.getData(this.props.location.state.id)
    }

    getData(idU){
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/verSolicitudes`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({id:idU})
    }).then(async response => {
      const json = await response.json()
    //   console.log(json.data)
      this.setState({data:json.data})
    })
    }

  render() {
    return (
      <Grid container
      sx={{ margin: "auto", marginBottom: 2 }}
      justifyContent="center">
          <Appbar />
        <NavBar/>
          <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 7,
        }}
      >
        <Typography variant="h3" component="h6">
          Solicitudes
        </Typography>
        <Grid item sx={{ padding: 2, width: "100%" }}>
          <Grid container justifyContent="center" spacing={1}>
          {this.state.data.map((value) => (
              <Grid key={value.usuario} item>
                <Solicitud data={value} UserId={this.props.location.state.id}/>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
      </Grid>
    );
  }
}

export const Requests = withRouter(soli)
