import { faL } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Reservation } from "../../../shared/types";
import ReservationsCalendar from "./ReservationsCalendar";

const ReservationsView = () => {
    const [dayDetailReservations, setDayDetailReservations] = useState([] as Reservation[]);
    const [selectedReservationsDay, setSelectedReservationsDay] = useState<null | Date>(null);
    const [isDetailOn, setIsDetailOn] = useState(false);

    if (!isDetailOn) {
        return (
            <ReservationsCalendar
                setDayDetailReservations={setDayDetailReservations}
                setSelectedReservationsDay={setSelectedReservationsDay}
                setIsDetailOn={setIsDetailOn}
            />
        );
    } else {
        return <></>;
    }
};

export default ReservationsView;
