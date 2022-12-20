import { useNewReservationContext } from "../../hooks/useNewReservationContext";
import DaySelection from "../../components/newReservation/daySelection/DaySelection";
import ErrorBoundary from "../../components/ErrorBoundary";
import NewReservationToolbar from "../../components/newReservation/toolbar/NewReservationToolbar";
import { NewReservationViewEnum } from "../../shared/utils/enums/newReservationViewEnum";
import ReservationSubmission from "../../components/newReservation/submission/ReservationSubmission";
import ServiceSelection from "../../components/newReservation/serviceSelection/ServiceSelection";
import styles from "../../styles/user/newReservation/newReservation.module.css";
import TimeSelection from "../../components/newReservation/timeSelection/TimeSelection";

const NewReservation = () => {
    const { view } = useNewReservationContext();

    const content = () => {
        switch (view) {
            case NewReservationViewEnum.Services:
                return <ServiceSelection />;
            case NewReservationViewEnum.Calendar:
                return <DaySelection />;
            case NewReservationViewEnum.Times:
                return <TimeSelection />;
            case NewReservationViewEnum.Form:
                return <ReservationSubmission />;
        }
    };

    return (
        <>
            <div className={styles.NewReservationContainer}>
                <div>
                    <ErrorBoundary>
                        <NewReservationToolbar />
                    </ErrorBoundary>
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

export default NewReservation;
