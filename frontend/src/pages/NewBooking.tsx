import NewBookingToolbar from "../components/NewBookingToolbar";
import ErrorBoundary from "../components/ErrorBoundary";
import Services from "../components/Services";
import styles from "../styles/newBooking.module.css";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";
import { useNewBookingContext } from "../hooks/NewBookingContext";
import DaySelection from "../components/DaySelection";

const NewBooking = () => {
    const { getView } = useNewBookingContext();

    const content = () => {
        switch (getView()) {
            case NewBookingView.Services:
                return <Services />;
            case NewBookingView.Calendar:
                return <DaySelection />;
            case NewBookingView.Times:
                return;
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
