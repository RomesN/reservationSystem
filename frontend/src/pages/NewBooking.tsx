import axios from "axios";
import NewBookingToolbar from "../components/NewBookingToolbar";
import ErrorBoundary from "../components/ErrorBoundary";
import { createTemporalBooking, isDateAvailable } from "../api/reservationApi";
import ServiceSelection from "../components/ServiceSelection";
import styles from "../styles/newBooking.module.css";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";
import { useNewBookingContext } from "../hooks/NewBookingContext";
import DaySelection from "../components/DaySelection";
import TimeSelection from "../components/TimeSelection";
import { useEffect } from "react";

const NewBooking = () => {
    const { getView, getBookedDate, getBookedService } = useNewBookingContext();

    const content = () => {
        switch (getView()) {
            case NewBookingView.Services:
                return <ServiceSelection />;
            case NewBookingView.Calendar:
                return <DaySelection />;
            case NewBookingView.Times:
                return <TimeSelection />;
            case NewBookingView.Form:
                return;
        }
    };

    const checkAndMakeTemporalBooking = async (date: Date, serviceId: number) => {
        const isFree = await isDateAvailable(date.toISOString(), serviceId);
        if (isFree && !axios.isAxiosError(isFree) && isFree.data.isAvailable) {
            const response = await createTemporalBooking(date.toISOString(), serviceId);
        }
    };

    useEffect(() => {
        const date = getBookedDate();
        const service = getBookedService();
        if (date?.getHours() !== 0 && service && date) {
            checkAndMakeTemporalBooking(date, service.id);
        }
    }, [getBookedDate()]);

    return (
        <>
            <div className={styles.newBookingContainer}>
                <div>
                    <NewBookingToolbar />
                </div>
                <div>
                    <hr className={styles.contentLine} />
                </div>
                <div>
                    <ErrorBoundary>{content()}</ErrorBoundary>
                </div>
            </div>
        </>
    );
};

export default NewBooking;
