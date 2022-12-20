import { Link } from "react-router-dom";
import { faChevronLeft, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNewReservationContext } from "../../../hooks/useNewReservationContext";
import { deleteTemporaryReservation } from "../../../api/reservationApi";
import { NewReservationViewEnum } from "../../../utils/enums/newReservationViewEnum";
import styles from "../../../styles/user/newReservation/toolbar/newReservationToolbar.module.css";

const NewReservationToolbar = () => {
    const { view, temporaryReservation, setView, setTemporaryReservation } = useNewReservationContext();

    const handleClickBack = () => {
        switch (view) {
            case NewReservationViewEnum.Form:
                if (temporaryReservation) {
                    setTemporaryReservation(null);
                    deleteTemporaryReservation(temporaryReservation).finally(() =>
                        setView(NewReservationViewEnum.Calendar)
                    );
                } else {
                    setView(NewReservationViewEnum.Calendar);
                }
                break;
            case NewReservationViewEnum.Times:
                setView(NewReservationViewEnum.Calendar);
                break;
            case NewReservationViewEnum.Calendar:
                setView(NewReservationViewEnum.Services);
                break;
        }
    };

    const backButton = () => {
        if (view === NewReservationViewEnum.Services) {
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
            case NewReservationViewEnum.Services:
                text = " Select service";
                break;
            case NewReservationViewEnum.Calendar:
                text = " Select day";
                break;
            case NewReservationViewEnum.Times:
                text = " Select time slot";
                break;
            case NewReservationViewEnum.Form:
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

export default NewReservationToolbar;
