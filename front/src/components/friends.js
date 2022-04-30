import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Person } from "./person";

// const data = {
//   users: [
//     {
//       username: "av.edson",
//       fullname: "edson Avila",
//       url: "https://source.unsplash.com/random"
//     },
//     {
//       username: "pedroRigol2",
//       fullname: "el segundo",
//       url: "https://source.unsplash.com/random"
//     },
//     {
//       username: "otoe2s",
//       fullname: "tu pinche madre",
//       url: "https://source.unsplash.com/random"
//     },
//     {
//       username: "otoeh2fs",
//       fullname: "tu pinche madre",
//       url: "https://images.unsplash.com/photo-1589987598188-fd7e9105efe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY0NzQ1OTA0Mw&ixlib=rb-1.2.1&q=80&w=1080"
//     },
//     {
//       username: "otoesd2s",
//       fullname: "tu pinche madre",
//       url: "https://images.unsplash.com/photo-1646073506621-d63e90d9e49a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY0NzQ1ODkxNw&ixlib=rb-1.2.1&q=80&w=1080"
//     },
//     {
//       username: "otove2s",
//       fullname: "tu pinche madre",
//       url: "https://source.unsplash.com/random"
//     }
//   ]
// };
export class Friends extends React.Component {
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
      `http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/verAmigos`,
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
          Amigos agregados
        </Typography>
        <Grid item sx={{ padding: 2, width: "100%" }}>
          <Grid container justifyContent="center" spacing={1}>
            {this.state.data.map((value) => (
              <Grid key={value.usuario} item xs={6} sm={3}>
                <Person data={value} agregado={true} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    );
  }
}
