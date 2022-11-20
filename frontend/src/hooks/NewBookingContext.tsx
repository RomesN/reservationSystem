import React, { ReactNode, useContext } from "react";
import { useState } from "react";

type NewBookingContext = {
    getBookedService: () => string;
    getBookedDate: () => Date | null;
    getBookedTime: () => Date | null;
    getBookedFormData: () => BookedFormData | null;
    setBookedServiceState: (bookedService: string) => void;
    setBookedDateState: (bookedService: Date) => void;
    setBookedTimeState: (bookedService: Date) => void;
    setBookedFormDataState: (bookedService: BookedFormData) => void;
};

type NewBookingContextProviderProps = {
    children: ReactNode;
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

export const NewBookingDataProvider = ({ children }: NewBookingContextProviderProps) => {
    const [bookService, setBookedService] = useState("");
    const [bookedDate, setBookedDate] = useState<null | Date>(null);
    const [bookedTime, setBookedTime] = useState<null | Date>(null);
    const [bookedFormData, setBookedFormData] = useState<null | BookedFormData>(null);

    function getBookedService() {
        return bookService;
    }

    function getBookedDate() {
        return bookedDate;
    }

    function getBookedTime() {
        return bookedTime;
    }

    function getBookedFormData() {
        return bookedFormData;
    }

    function setBookedServiceState(bookedService: string) {
        setBookedService(bookedService);
    }

    function setBookedDateState(bookedDate: Date) {
        setBookedDate(bookedDate);
    }

    function setBookedTimeState(bookedTime: Date) {
        setBookedTime(bookedTime);
    }

    function setBookedFormDataState(bookedFormData: BookedFormData) {
        setBookedFormData(bookedFormData);
    }

    return (
        <NewBookingDataContext.Provider
            value={{
                getBookedService,
                getBookedDate,
                getBookedTime,
                getBookedFormData,
                setBookedServiceState,
                setBookedDateState,
                setBookedTimeState,
                setBookedFormDataState,
            }}
        >
            {children}
        </NewBookingDataContext.Provider>
    );
};
