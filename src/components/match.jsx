import React, { Component } from "react";
const championRef = require("../reference/champion.json");
const utils = require("./utils");

class Match extends Component {
  state = {
    matchData: ""
  };

  getChampionName = championId => {
    let champions = championRef.data;
    for (const champion in champions) {
      if (parseInt(champions[champion].key, 10) === championId) return champion;
    }
  };

  getMatchData = gameId => {
    fetch(`/match/${this.props.data.gameId}`)
      .then(response => response.json())
      .then(data => this.setState({ matchData: data.json }));
  };

  matchWin = accountId => {
    let participantId = "";
    let participantIdentities = this.state.matchData.participantIdentities;
    for (let participant in participantIdentities) {
      if (participantIdentities[participant].player.accountId === accountId)
        participantId = participantIdentities[participant].participantId;
    }
    if (participantId < 6) {
      return this.state.matchData.teams[0].win;
    } else return this.state.matchData.teams[1].win;
  };

  cardClass = () => {
    let classes = "card-body ";
    if (this.state.matchData) {
      let result = this.matchWin(this.props.accountId);
      if (result === "Win") classes += "win-color";
      else if (result === "Fail") classes += "fail-color";
    }
    return classes;
  };

  getLaneImage = lane => {
    if (lane === "BOTTOM")
      return `${process.env.PUBLIC_URL}/ranked-positions/Position_Gold-Bot.png`;
    else if (lane === "MIDDLE")
      return `${process.env.PUBLIC_URL}/ranked-positions/Position_Gold-Mid.png`;
    else
      return `${process.env.PUBLIC_URL}/ranked-positions/Position_Gold-${lane}.png`;
  };

  getTeams = () => {
    let team1 = [];
    let team2 = [];
    for (let participant of this.state.matchData.participants) {
      if (participant.teamId === 100) {
        team1.push({ ...participant });
      } else if (participant.teamId === 200) {
        team2.push({ ...participant });
      }
    }
    return [team1, team2];
  };

  getTeamsIdentities = () => {
    let team1 = [];
    let team2 = [];
    for (let participant of this.state.matchData.participantIdentities) {
      if (participant.participantId < 6) {
        team1.push({ ...participant });
      } else if (participant.participantId > 5) {
        team2.push({ ...participant });
      }
    }
    return [team1, team2];
  };

  getTeamHTML = team => {
    if (!this.state.matchData) return null;

    let teams = this.getTeams();
    let teamsIdentities = this.getTeamsIdentities();

    return teams[team].map(participant => {
      return (
        <div key={participant.participantId} className="player">
          <img
            src={
              `http://ddragon.leagueoflegends.com/cdn/10.4.1/img/champion/` +
              this.getChampionName(participant.championId) +
              `.png`
            }
            alt=""
            height="15rem"
            className="champion-img"
          />
          <p className="summoner-name">
            {teamsIdentities[team][
              participant.participantId <= 5
                ? participant.participantId - 1
                : participant.participantId - 6
            ].player.summonerName.substring(0, 7)}
          </p>
        </div>
      );
    });
  };

  componentDidMount = (props, state) => {
    if (this.props.data) {
      this.getMatchData(this.props.gameId);
    }
  };

  render() {
    const {
      champion,
      gameId,
      lane,
      platformId,
      queue,
      role,
      season,
      timestamp
    } = this.props.data;

    const { accountid } = this.props;

    let championName = "";
    if (this.state.matchData) {
      championName = this.getChampionName(champion);
    }

    return (
      <div className="card">
        <div className={this.cardClass()}>
          <div className="base-game-info">
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/10.4.1/img/champion/${championName}.png`} // fix it so it doesn't call undefined first run through
              alt={`Icon of ${championName}`}
              height="50rem"
            />
            {lane !== "NONE" ? (
              <img
                src={this.getLaneImage(lane)}
                alt={`Position:${lane}`}
                height="50rem"
              />
            ) : null}
            <p className="time-since">{utils.timeSince(timestamp)}</p>
          </div>
          <div className="detailed-game-info">
            <div className="champions">
              <div className="team1">{this.getTeamHTML(0)}</div>
              <div className="team2">{this.getTeamHTML(1)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Match;
