import React from "react";
import "./App.scss";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import DailyVideo from "./pages/daily-video/Daily.jsx";
import DailyAudio from "./pages/daily-audio/DailyAudio";
import Meeting from "./pages/meeting/Meeting";
import Meet100ms from "./pages/100ms/Meet100ms";
import MeetContainer from "./pages/closeapp-meeting/MeetContainer";

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <Route path="/" exact component={Home} />
                <Route path="/daily" exact component={DailyVideo} />
                <Route path="/daily-audio" exact component={DailyAudio} />
                <Route path="/meeting" exact component={Meeting} />
                <Route path="/meet" exact component={MeetContainer} />
                <Route path="/100ms" exact component={Meet100ms} />
            </BrowserRouter>
        </div>
    );
};

export default App;
