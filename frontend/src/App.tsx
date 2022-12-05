import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import "./styles/general/index.css";
import LandingPage from "./pages/LandingPage";
import NewBooking from "./pages/NewReservation";
import { NewBookingDataProvider } from "./hooks/NewBookingContext";

function App() {
    return (
        <Routes>
            <Route path="/cancel-booking" element={""} />
            <Route
                path="/new-booking"
                element={
                    <NewBookingDataProvider>
                        <NewBooking />
                    </NewBookingDataProvider>
                }
            />
            <Route path="/" element={<LandingPage />} />
        </Routes>
    );
}

export default App;
