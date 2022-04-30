import React from "react";
import { Appbar } from "../components/appBar";
import Grid from "@mui/material/Grid";
import { NotFriends } from "../components/notFriends";
import {withRouter} from '../router';
import { NavBar } from "../components/navBar";

class Buscar extends React.Component {

  state = {
    id:""
  }
  componentDidMount= () =>{
    this.setState({id:this.props.location.state.id})
  }

  render() {
    return (
      <Grid>
        <Appbar />
        <NavBar/>
        <NotFriends idUser={this.props.location.state.id}/>
      </Grid>
    );
  }
}

export const BuscarAmigos = withRouter(Buscar)