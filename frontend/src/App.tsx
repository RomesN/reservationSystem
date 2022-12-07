import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import "./styles/general/index.css";
import LandingPage from "./pages/LandingPage";
import NewBooking from "./pages/NewReservation";
import { NewReservationDataProvider } from "./hooks/NewReservationContext";

function App() {
    return (
        <Routes>
            <Route path="/cancel-booking" element={""} />
            <Route
                path="/new-booking"
                element={
                    <NewReservationDataProvider>
                        <NewBooking />
                    </NewReservationDataProvider>
                }
            />
            <Route path="/" element={<LandingPage />} />
        </Routes>
    );
}

export default App;
