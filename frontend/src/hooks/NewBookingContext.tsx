import React, { useContext } from "react";
import { useState } from "react";
import { Props, Service } from "../shared/types";

type NewBookingContext = {
    getBookedService: () => Service | null;
    getBookedDate: () => Date | null;
    getBookedTime: () => Date | null;
    getBookedFormData: () => BookedFormData | null;
    setBookedServiceState: (bookedService: Service) => void;
    setBookedDateState: (bookedService: Date) => void;
    setBookedTimeState: (bookedService: Date) => void;
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
    const [bookService, setBookedService] = useState<null | Service>(null);
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

    function setBookedServiceState(bookedService: Service) {
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
