import React, { useContext } from "react";
import { useState } from "react";
import { Props, Reservation, Service } from "../shared/types";
import { NewReservationViewEnum } from "../utils/enums/newReservationViewEnum";

type NewReservationContextType = {
    view: NewReservationViewEnum;
    bookedService: Service | null;
    bookedDate: Date | null;
    availableIntervals: Interval[] | null;
    temporalReservation: Reservation | null;
    timerOn: boolean;
    setView: React.Dispatch<React.SetStateAction<NewReservationViewEnum>>;
    setBookedService: React.Dispatch<React.SetStateAction<Service | null>>;
    setBookedDate: React.Dispatch<React.SetStateAction<Date | null>>;
    setAvilableIntervals: React.Dispatch<React.SetStateAction<Interval[] | null>>;
    setTemporalReservation: React.Dispatch<React.SetStateAction<Reservation | null>>;
    setTimerOn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NewReservationContext = React.createContext({} as NewReservationContextType);

export function useNewReservationContext() {
    return useContext(NewReservationContext);
}

export const NewReservationDataProvider = ({ children }: Props) => {
    const [view, setView] = useState(NewReservationViewEnum.Services);
    const [bookedService, setBookedService] = useState<null | Service>(null);
    const [bookedDate, setBookedDate] = useState<null | Date>(null);
    const [availableIntervals, setAvilableIntervals] = useState<null | Interval[]>(null);
    const [temporalReservation, setTemporalReservation] = useState<null | Reservation>(null);
    const [timerOn, setTimerOn] = useState(true);

    return (
        <NewReservationContext.Provider
            value={{
                view,
                bookedService,
                bookedDate,
                availableIntervals,
                temporalReservation,
                timerOn,
                setView,
                setBookedService,
                setBookedDate,
                setAvilableIntervals,
                setTemporalReservation,
                setTimerOn,
            }}
        >
            {children}
        </NewReservationContext.Provider>
    );
};
