import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export class Appbar extends React.Component {
  render() {
    return (
      <AppBar sx={{ backgroundColor: "#0c2a33", width: "100%" }}>
        <Toolbar>
          <Typography variant="h6">My App</Typography>
        </Toolbar>
      </AppBar>
    );
  }
}
