import React from "react";
import "./App.css";
import LeagueStats from "./components/leagueStats";

function App() {
  return (
    <React.Fragment>
      <LeagueStats />
      <a
        className="github-link"
        href="https://github.com/DeveloperHarris/260Creative2"
      >
        Github
      </a>
    </React.Fragment>
  );
}

export default App;
