import { Link } from "react-router-dom";
import { faChevronLeft, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNewBookingContext } from "../../../hooks/NewBookingContext";
import { deleteTemporalReservation } from "../../../api/reservationApi";
import { NewBookingView } from "../../../utils/enums/newBookingViewEnum";
import styles from "../../../styles/newBookingToolbar.module.css";

const NewBookingToolbar = () => {
    const { view, temporalReservation, setView, setTemporalReservation } = useNewBookingContext();

    const handleClickBack = () => {
        switch (view) {
            case NewBookingView.Form:
                if (temporalReservation) {
                    setTemporalReservation(() => null);
                    deleteTemporalReservation(temporalReservation).finally(() =>
                        setView(() => NewBookingView.Calendar)
                    );
                } else {
                    setView(() => NewBookingView.Calendar);
                }
                break;
            case NewBookingView.Times:
                setView(() => NewBookingView.Calendar);
                break;
            case NewBookingView.Calendar:
                setView(() => NewBookingView.Services);
                break;
        }
    };

    const backButton = () => {
        if (view === NewBookingView.Services) {
            return (
                <Link to="/">
                    <button className={styles.backButton}>
                        <FontAwesomeIcon size="sm" icon={faChevronLeft} />
                        Back
                    </button>
                </Link>
            );
        } else {
            return (
                <button className={styles.backButton} onClick={handleClickBack}>
                    <FontAwesomeIcon size="sm" icon={faChevronLeft} />
                    Back
                </button>
            );
        }
    };

    const heading = () => {
        let text;
        switch (view) {
            case NewBookingView.Services:
                text = " Select service";
                break;
            case NewBookingView.Calendar:
                text = " Select day";
                break;
            case NewBookingView.Times:
                text = " Select time slot";
                break;
            case NewBookingView.Form:
                text = " Fill in details and confirm";
        }

        return (
            <>
                <h2 className={styles.heading}>
                    <FontAwesomeIcon size="sm" icon={faCheckDouble} />
                    {text}
                </h2>
            </>
        );
    };

    return (
        <div className={styles.container}>
            <div>{backButton()}</div>
            <div className={styles.containeritemTwo}>{heading()}</div>
        </div>
    );
};

export default NewBookingToolbar;
