import React, { useContext } from "react";
import { useState } from "react";
import { Props, Service, IntervalString } from "../shared/types";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";

type NewBookingContext = {
    getView: () => NewBookingView;
    getBookedService: () => Service | null;
    getBookedDate: () => Date | null;
    getAvailableIntervals: () => IntervalString[] | null;
    getBookedFormData: () => BookedFormData | null;
    setBookingView: (view: NewBookingView) => void;
    setBookedServiceState: (bookedService: Service | null) => void;
    setBookedDateState: (bookedDate: Date | null) => void;
    setAvailableIntervalsState: (availableIntervals: IntervalString[] | null) => void;
    setBookedFormDataState: (bookedService: BookedFormData) => void;
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
    const [availableIntervals, setAvilableIntervals] = useState<null | IntervalString[]>(null);
    const [bookedFormData, setBookedFormData] = useState<null | BookedFormData>(null);

    function getView() {
        return view;
    }

    function getBookedService() {
        return bookedService;
    }

    function getBookedDate() {
        return bookedDate;
    }

    function getAvailableIntervals() {
        return availableIntervals;
    }

    function getBookedFormData() {
        return bookedFormData;
    }

    function setBookingView(view: NewBookingView) {
        setView(view);
    }

    function setBookedServiceState(bookedService: Service | null) {
        setBookedService(bookedService);
    }

    function setBookedDateState(bookedDataState: Date | null) {
        setBookedDate(bookedDataState);
    }

    function setAvailableIntervalsState(availableIntervals: IntervalString[] | null) {
        setAvilableIntervals(availableIntervals);
    }

    function setBookedFormDataState(bookedFormData: BookedFormData) {
        setBookedFormData(bookedFormData);
    }

    return (
        <NewBookingDataContext.Provider
            value={{
                getView,
                getBookedService,
                getBookedDate,
                getAvailableIntervals,
                getBookedFormData,
                setBookingView,
                setBookedServiceState,
                setBookedDateState,
                setAvailableIntervalsState,
                setBookedFormDataState,
            }}
        >
            {children}
        </NewBookingDataContext.Provider>
    );
};
