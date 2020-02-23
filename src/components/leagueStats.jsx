import React, { Component } from "react";
import Form from "./form";
import Profile from "./profile";
import MatchHistory from "./matchHistory";

class LeagueStats extends Component {
  state = {
    username: "ArkenStorm", // default value
    accountId: "",
    id: "",
    name: "",
    profileIconId: "",
    puuid: "",
    revisionDate: "",
    summonerLevel: "",
    matchHistory: ""
  };

  handleOnSubmit = event => {
    event.preventDefault();

    fetch(`/summoner/${this.state.username}`)
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
    const {
      name,
      username,
      profileIconId,
      summonerLevel,
      revisionDate,
      id,
      accountId
    } = this.state;

    return (
      <main className="container">
        <h4 className="h4">Enter League of Legends Summoner Name</h4>
        <Form
          onSubmit={this.handleOnSubmit}
          onChange={this.handleOnChange}
          currentValue={username}
        />
        <Profile
          name={name}
          profileIconId={profileIconId}
          summonerLevel={summonerLevel}
          revisionDate={revisionDate}
          id={id}
          accountId={accountId}
        />
        <MatchHistory accountId={accountId} />
      </main>
    );
  }
}

export default LeagueStats;
