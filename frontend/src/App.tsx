import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import "./styles/general/index.css";
import LandingPage from "./pages/user/LandingPage";
import NewBooking from "./pages/user/NewReservation";
import { NewReservationDataProvider } from "./hooks/NewReservationContext";
import CancelReservation from "./pages/user/CancelReservation";

function App() {
    return (
        <Routes>
            <Route path="/cancel-booking" element={<CancelReservation />} />
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
