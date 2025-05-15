import React from "react";

import Navbar from "../components/Navbar/Navbar";
import LandingPage from "../components/LandingPage/LandingPage";
import Routing from "../routes/Routing";

const App = () => {
    return (
        <>
            <Navbar />
            <LandingPage />
            {/* <Routing /> */}
        </>
    );
};

export default App;
