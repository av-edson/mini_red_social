import React from "react";
import { Appbar } from "../components/appBar";
import { Friends } from "../components/friends";
import Grid from "@mui/material/Grid";
import { NavBar } from "../components/navBar";
import {withRouter} from '../router';

class Frien extends React.Component {

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
        <Friends idUser={this.props.location.state.id}/>
      </Grid>
    );
  }
}
export const FriendsVIew = withRouter(Frien)