import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import AdminPanel from "./pages/admin/AdminPanel";
import CancelReservation from "./pages/user/CancelReservation";
import LandingPage from "./pages/user/LandingPage";
import Login from "./pages/admin/Login";
import NewBooking from "./pages/user/NewReservation";
import { NewReservationDataProvider } from "./hooks/NewReservationContext";
import "./styles/general/index.css";

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
            <Route path="/admin/login" element={<Login />}></Route>
            <Route path="/admin/panel" element={<AdminPanel />}></Route>
        </Routes>
    );
}

export default App;
