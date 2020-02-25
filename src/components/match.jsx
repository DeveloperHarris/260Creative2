import React, { Component } from "react";
const championRef = require("../reference/champion.json");
const queueRef = require("../reference/queues.json");
const spellRef = require("../reference/summoner.json");
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

  getOutcome = accountId => {
    if (this.state.matchData) {
      let result = this.matchWin(accountId);
      if (this.state.matchData.gameDuration < 300) return "Remake";
      if (result === "Win") return "Victory";
      else if (result === "Fail") return "Defeat";
    } else return null;
  };

  cardClass = () => {
    let classes = "card-body ";
    if (this.state.matchData) {
      let result = this.matchWin(this.props.accountId); // could potentially optimize this by only calculating it once
      if (this.state.matchData.gameDuration < 300) classes += "remake-color";
      else if (result === "Win") classes += "win-color";
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
    // refactor this to not have two arrays, makes it harder
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

  getQueueType = queueId => {
    let result;
    for (let queueType of queueRef) {
      if (queueType.queueId === queueId) {
        result = queueType.description.substring(
          0,
          queueType.description.length - 5
        );
        break;
      }
    }

    if (result.includes("5v5")) result = result.substring(3);

    return result;
  };

  getKDA = accountId => {
    if (!this.state.matchData) return null;

    let participants = this.state.matchData.participants;
    let teamsIdentities = this.state.matchData.participantIdentities;

    let participantId = "";

    let kills, deaths, assists;

    for (let participant of teamsIdentities) {
      if (participant.player.accountId === accountId) {
        participantId = participant.participantId;
      }
    }

    for (let participant of participants) {
      if (participant.participantId === participantId) {
        kills = participant.stats.kills;
        deaths = participant.stats.deaths;
        assists = participant.stats.assists;
      }
    }

    let kdaScore =
      deaths === 0
        ? `Perfect KDA`
        : `${Math.round(((kills + assists) / deaths + Number.EPSILON) * 100) /
            100} KDA`;

    return (
      <React.Fragment>
        <div>{`${kills} / ${deaths} / ${assists} `}</div>
        <div>{kdaScore}</div>
      </React.Fragment>
    );
  };

  getStats = accountId => {
    if (!this.state.matchData) return null;

    let participants = this.state.matchData.participants;
    let teamsIdentities = this.state.matchData.participantIdentities;

    let participantId = "";

    let champLevel, totalMinionsKilled, visionScore;

    for (let participant of teamsIdentities) {
      if (participant.player.accountId === accountId) {
        participantId = participant.participantId;
      }
    }

    for (let participant of participants) {
      if (participant.participantId === participantId) {
        champLevel = participant.stats.champLevel;
        totalMinionsKilled =
          participant.stats.totalMinionsKilled +
          participant.stats.neutralMinionsKilled;
        visionScore = participant.stats.visionScore;
      }
    }

    return (
      <React.Fragment>
        <p className="level">Level: {champLevel}</p>
        <p>
          {totalMinionsKilled} (
          {Math.round(
            (totalMinionsKilled / (this.state.matchData.gameDuration / 60.0) +
              Number.EPSILON) *
              10
          ) / 10}
          ) CS
        </p>
        <p>Vision: {visionScore}</p>
      </React.Fragment>
    );
  };

  getSummonerSpells = accountId => {
    if (!this.state.matchData) return null;

    let participants = this.state.matchData.participants;
    let teamsIdentities = this.state.matchData.participantIdentities;

    let participantId = "";

    let sum1, sum2;

    for (let participant of teamsIdentities) {
      if (participant.player.accountId === accountId) {
        participantId = participant.participantId;
      }
    }

    for (let participant of participants) {
      if (participant.participantId === participantId) {
        sum1 = participant.spell1Id;
        sum2 = participant.spell2Id;
      }
    }

    let sum1Name = this.getSpellName(sum1);
    let sum2Name = this.getSpellName(sum2);

    return (
      <React.Fragment>
        <img
          src={
            `http://ddragon.leagueoflegends.com/cdn/10.4.1/img/spell/` +
            sum1Name +
            `.png`
          }
          alt={`Summoner Spell: ` + sum1Name}
          height="25rem"
        />
        <img
          src={
            `http://ddragon.leagueoflegends.com/cdn/10.4.1/img/spell/` +
            sum2Name +
            `.png`
          }
          alt={`Summoner Spell: ` + sum2Name}
          height="25rem"
        />
      </React.Fragment>
    );
  };

  getSpellName = id => {
    let spells = spellRef.data;
    for (let summoner in spells) {
      if (spells[summoner].key == id) return spells[summoner].id;
    }
  };

  componentDidMount = (props, state) => {
    if (this.props.data) {
      this.getMatchData(this.props.gameId);
    }
  };

  render() {
    const { champion, lane, queue, timestamp } = this.props.data;

    let championName = "";
    if (this.state.matchData) {
      championName = this.getChampionName(champion);
    }

    return (
      <div className="card">
        <div className={this.cardClass()}>
          <div className="base-game-info">
            <div className="preview">
              <p className="queue-type">{this.getQueueType(queue)}</p>
              <p className="time-since">{utils.timeSince(timestamp)}</p>
              <p className="outcome">{this.getOutcome(this.props.accountId)}</p>
              <p className="game-length">
                {Math.round(this.state.matchData.gameDuration / 60.0)}m
              </p>
            </div>
            <div className="images">
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
            </div>
            <div className="spells-runes">
              {this.getSummonerSpells(this.props.accountId)}
            </div>
          </div>
          <div className="game-stats">
            <div className="kda">{this.getKDA(this.props.accountId)}</div>
            <div className="stats">{this.getStats(this.props.accountId)}</div>
          </div>
          <div className="detailed-team-info">
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
