import React from "react";

const profile = props => {
  const { profileIconId, name, summonerLevel, revisionDate } = props;

  if (!name) return null;

  let date = new Date(revisionDate);

  return (
    <React.Fragment>
      <h4 className="h4 mt-4">{name}</h4>
      <img
        height="100vh"
        alt="Profile Icon"
        src={
          "http://ddragon.leagueoflegends.com/cdn/10.4.1/img/profileicon/" +
          profileIconId +
          ".png"
        }
      />
      <p className="p">Level {summonerLevel}</p>
      <p className="p">Last Seen Online: {date.toDateString()}</p>
    </React.Fragment>
  );
};

export default profile;
