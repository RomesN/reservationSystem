import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import AdminPanel from "./pages/admin/AdminPanel";
import { AdminPanelContextProvider } from "./hooks/useAdminPanelContext";
import CancelReservation from "./pages/user/CancelReservation";
import LandingPage from "./pages/user/LandingPage";
import Login from "./pages/admin/Login";
import NewReservation from "./pages/user/NewReservation";
import { NewReservationDataProvider } from "./hooks/useNewReservationContext";
import "./styles/general/index.css";
import "./styles/general/dateTimePicker.css";
import "./styles/general/timePicker.css";

function App() {
    return (
        <Routes>
            <Route path="/cancel-booking" element={<CancelReservation />} />
            <Route
                path="/new-booking"
                element={
                    <NewReservationDataProvider>
                        <NewReservation />
                    </NewReservationDataProvider>
                }
            />
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/login" element={<Login />}></Route>
            <Route
                path="/admin/panel"
                element={
                    <AdminPanelContextProvider>
                        <AdminPanel />
                    </AdminPanelContextProvider>
                }
            ></Route>
        </Routes>
    );
}

export default App;
