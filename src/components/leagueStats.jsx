import React, { Component } from "react";
import Form from "./form";
import Profile from "./profile";

class LeagueStats extends Component {
  state = {
    username: "ArkenStorm", // default value
    accountId: "",
    id: "",
    name: "",
    profileIconId: "",
    puuid: "",
    revisionDate: "",
    summonerLevel: ""
  };

  handleOnSubmit = event => {
    event.preventDefault();

    fetch(`/summoner/${this.state.username}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState(data["json"]);
      });
  };

  handleOnChange = event => {
    this.setState({
      username: event.target.value
    });
  };

  render() {
    const { name, username } = this.state;

    return (
      <main className="container">
        <img src="" />
        <h4 className="h4">Enter League of Legends Summoner Name</h4>
        <Form
          onSubmit={this.handleOnSubmit}
          onChange={this.handleOnChange}
          currentValue={username}
        />
        <Profile name={name} />
      </main>
    );
  }
}

export default LeagueStats;
