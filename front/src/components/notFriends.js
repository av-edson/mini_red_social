import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Person } from "./person";
import { withRouter } from "../router";

class NotFri extends React.Component {
  state = {
    id: "",
    data: [],
  };

  componentDidMount = () => {
    this.setState({ id: this.props.idUser });
    this.getData(this.props.idUser);
  };

  getData(idUsuario) {
    var sendJson = JSON.stringify({ id: idUsuario });
    fetch(
      `http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/noAmigos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: sendJson,
      }
    )
      .then(async (response) => {
        const result = await response.json();
        var list = result.data;
        this.setState({ data: list });
      })
      .catch((e) => {
        console.log(e);
        alert("bad request");
      });
  }

  render() {
    return (
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
          Buscar Personas
        </Typography>
        <Grid item sx={{ padding: 2, width: "100%" }}>
          <Grid container justifyContent="center" spacing={1}>
            {this.state.data.map((value) => (
              <Grid key={value.usuario} item xs={6} sm={3}>
                <Person
                  data={value}
                  agregado={false}
                  idUser={this.props.idUser}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export const NotFriends = withRouter(NotFri);
