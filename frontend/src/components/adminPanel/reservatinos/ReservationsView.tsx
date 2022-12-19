import { useState } from "react";
import { Reservation } from "../../../shared/types";
import ReservationsCalendar from "./ReservationsCalendar";

const ReservationsView = () => {
    const [dayDetailReservations, setDayDetailReservations] = useState([] as Reservation[]);
    const [selectedReservationsDay, setSelectedReservationsDay] = useState<null | Date>(null);

    if (!selectedReservationsDay) {
        return (
            <ReservationsCalendar
                setDayDetailReservations={setDayDetailReservations}
                setSelectedReservationsDay={setSelectedReservationsDay}
            />
        );
    } else {
        return <></>;
    }
};

export default ReservationsView;
