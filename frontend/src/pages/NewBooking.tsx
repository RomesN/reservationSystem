import NewBookingToolbar from "../components/newBooking/NewBookingToolbar";
import ErrorBoundary from "../components/ErrorBoundary";
import ServiceSelection from "../components/newBooking/ServiceSelection";
import styles from "../styles/newBooking.module.css";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";
import { useNewBookingContext } from "../hooks/NewBookingContext";
import DaySelection from "../components/newBooking/DaySelection";
import TimeSelection from "../components/newBooking/TimeSelection";

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
                return;
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
