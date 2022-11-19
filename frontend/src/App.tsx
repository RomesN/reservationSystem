import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from "./pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import "./styles/index.css";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
        </Routes>
    );
}

export default App;
