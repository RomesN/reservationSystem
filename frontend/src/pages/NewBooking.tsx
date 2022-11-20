import { useState } from "react";
import NewBookingToolbar from "../components/NewBookingToolbar";
import ErrorBoundary from "../components/ErrorBoundary";
import Services from "../components/Services";
import styles from "../styles/newBooking.module.css";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";

const NewBooking = () => {
    const [view, setView] = useState<string>(NewBookingView.Services);

    const content = () => {
        switch (view) {
            case NewBookingView.Services:
                return <Services />;
            case NewBookingView.Calendar:
                return;
            case NewBookingView.Times:
                return;
            case NewBookingView.Form:
                return;
        }
    };

    return (
        <>
            <div className={styles.newBookingContainer}>
                <NewBookingToolbar view={view} setView={setView} />
                <div>
                    <hr className={styles.contentLine} />
                </div>
                <ErrorBoundary>{content()}</ErrorBoundary>
            </div>
        </>
    );
};

export default NewBooking;
