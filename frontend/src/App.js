import logo from "./logo.svg";
import "./App.css";
import GenerateTrackingLink from "./components/GenerateTrackingLink";
import TrackingList from "./components/TrackingList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Tracking Link Generator</h1>
        <GenerateTrackingLink />
        <TrackingList />
      </header>
    </div>
  );
}

export default App;
