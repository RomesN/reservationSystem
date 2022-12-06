import React, { useContext } from "react";
import { useState } from "react";
import { Props, Reservation, Service } from "../shared/types";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";

type NewBookingContext = {
    view: NewBookingView;
    bookedService: Service | null;
    bookedDate: Date | null;
    availableIntervals: Interval[] | null;
    temporalReservation: Reservation | null;
    bookedFormData: BookedFormData | null;
    setView: React.Dispatch<React.SetStateAction<NewBookingView>>;
    setBookedService: React.Dispatch<React.SetStateAction<Service | null>>;
    setBookedDate: React.Dispatch<React.SetStateAction<Date | null>>;
    setAvilableIntervals: React.Dispatch<React.SetStateAction<Interval[] | null>>;
    setTemporalReservation: React.Dispatch<React.SetStateAction<Reservation | null>>;
    setBookedFormData: React.Dispatch<React.SetStateAction<BookedFormData | null>>;
};

type BookedFormData = {
    firsName: string;
    lastName: string;
    telephone: number;
    email: string;
};

export const NewBookingDataContext = React.createContext({} as NewBookingContext);

export function useNewBookingContext() {
    return useContext(NewBookingDataContext);
}

export const NewBookingDataProvider = ({ children }: Props) => {
    const [view, setView] = useState(NewBookingView.Services);
    const [bookedService, setBookedService] = useState<null | Service>(null);
    const [bookedDate, setBookedDate] = useState<null | Date>(null);
    const [availableIntervals, setAvilableIntervals] = useState<null | Interval[]>(null);
    const [temporalReservation, setTemporalReservation] = useState<null | Reservation>(null);
    const [bookedFormData, setBookedFormData] = useState<null | BookedFormData>(null);

    return (
        <NewBookingDataContext.Provider
            value={{
                view,
                bookedService,
                bookedDate,
                availableIntervals,
                temporalReservation,
                bookedFormData,
                setView,
                setBookedService,
                setBookedDate,
                setAvilableIntervals,
                setTemporalReservation,
                setBookedFormData,
            }}
        >
            {children}
        </NewBookingDataContext.Provider>
    );
};
