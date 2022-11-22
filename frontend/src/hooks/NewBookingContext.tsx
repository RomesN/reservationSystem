import React, { useContext } from "react";
import { useState } from "react";
import { Props, Service, Interval } from "../shared/types";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";

type NewBookingContext = {
    getView: () => NewBookingView;
    getBookedService: () => Service | null;
    getBookedDate: () => Date | null;
    getAvailableIntervals: () => Interval[] | null;
    getBookedTime: () => Date | null;
    getBookedFormData: () => BookedFormData | null;
    setBookingView: (view: NewBookingView) => void;
    setBookedServiceState: (bookedService: Service | null) => void;
    setBookedDateState: (bookedData: Date) => void;
    setAvailableIntervalsState: (availableIntervals: Interval[]) => void;
    setBookedTimeState: (bookedTime: Date) => void;
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
    const [bookService, setBookedService] = useState<null | Service>(null);
    const [bookedDate, setBookedDate] = useState<null | Date>(null);
    const [availableIntervals, setAvilableIntervals] = useState<null | Interval[]>(null);
    const [bookedTime, setBookedTime] = useState<null | Date>(null);
    const [bookedFormData, setBookedFormData] = useState<null | BookedFormData>(null);

    function getView() {
        return view;
    }

    function getBookedService() {
        return bookService;
    }

    function getBookedDate() {
        return bookedDate;
    }

    function getAvailableIntervals() {
        return availableIntervals;
    }

    function getBookedTime() {
        return bookedTime;
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

    function setBookedDateState(bookedDataState: Date) {
        setBookedDate(bookedDataState);
    }

    function setAvailableIntervalsState(availableIntervals: Interval[]) {
        setAvilableIntervals(availableIntervals);
    }

    function setBookedTimeState(bookedTimeState: Date) {
        setBookedTime(bookedTimeState);
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
                getBookedTime,
                getBookedFormData,
                setBookingView,
                setBookedServiceState,
                setBookedDateState,
                setAvailableIntervalsState,
                setBookedTimeState,
                setBookedFormDataState,
            }}
        >
            {children}
        </NewBookingDataContext.Provider>
    );
};
