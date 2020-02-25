import React, { Component } from "react";
import Match from "./match";

class MatchHistory extends Component {
  state = {
    matchHistory: "",
    accountId: ""
  };
  render() {
    const { matchHistory, accountId } = this.state;

    if (!matchHistory) return null;
    return (
      <React.Fragment>
        {matchHistory.matches.slice(0, 10).map(match => (
          <Match key={match.gameId} data={match} accountId={accountId} />
        ))}
      </React.Fragment>
    );
  }

  componentDidUpdate(props, state) {
    if (this.props.accountId && this.state.accountId !== this.props.accountId) {
      this.setState({ accountId: this.props.accountId });
      fetch(`/matches/${this.props.accountId}`)
        .then(response => response.json())
        .then(data => {
          this.setState({ matchHistory: data["json"] });
        });
    }
  }
}

export default MatchHistory;
