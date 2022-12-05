import { useNewBookingContext } from "../hooks/NewBookingContext";
import DaySelection from "../components/newReservation/daySelection/DaySelection";
import ErrorBoundary from "../components/ErrorBoundary";
import NewBookingToolbar from "../components/newReservation/toolbar/NewReservationToolbar";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";
import ReservationSubmission from "../components/newReservation/submission/ReservationSubmission";
import ServiceSelection from "../components/newReservation/serviceSelection/ServiceSelection";
import styles from "../styles/newReservation/newReservation.module.css";
import TimeSelection from "../components/newReservation/timeSelection/TimeSelection";

const NewBooking = () => {
    const { view } = useNewBookingContext();

    const content = () => {
        switch (view) {
            case NewBookingView.Services:
                return <ServiceSelection />;
            case NewBookingView.Calendar:
                return <DaySelection />;
            case NewBookingView.Times:
                return <TimeSelection />;
            case NewBookingView.Form:
                return <ReservationSubmission />;
        }
    };

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
