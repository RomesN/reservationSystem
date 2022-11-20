import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNewBookingContext } from "../hooks/NewBookingContext";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";
import styles from "../styles/newBookingToolbar.module.css";

type Props = {
    view: string;
    setView: React.Dispatch<React.SetStateAction<string>>;
};

const NewBookingToolbar = ({ view, setView }: Props) => {
    const handleClickBack = () => {
        switch (view) {
            case NewBookingView.Form:
                setView(NewBookingView.Times);
                break;
            case NewBookingView.Times:
                setView(NewBookingView.Calendar);
                break;
            case NewBookingView.Calendar:
                setView(NewBookingView.Services);
                break;
        }
    };

    const backButton = () => {
        if (view === NewBookingView.Services) {
            return (
                <Link to="/">
                    <Button variant="primary" className={styles.backButton}>
                        <FontAwesomeIcon size="sm" icon={faChevronLeft} />
                        Back
                    </Button>
                </Link>
            );
        } else {
            return (
                <Button variant="primary" className={styles.backButton} onClick={handleClickBack}>
                    <FontAwesomeIcon size="sm" icon={faChevronLeft} />
                    Back
                </Button>
            );
        }
    };

    const heading = () => {
        switch (view) {
            case NewBookingView.Services:
                return (
                    <>
                        <h2 className={styles.heading}>Select service</h2>
                    </>
                );
            case NewBookingView.Calendar:
                return (
                    <>
                        <h2 className={styles.heading}>Select day</h2>
                    </>
                );
            case NewBookingView.Times:
                return (
                    <>
                        <h2 className={styles.heading}>Select time slot</h2>
                    </>
                );
            case NewBookingView.Form:
                return (
                    <>
                        <h2 className={styles.heading}>Fill in details</h2>
                    </>
                );
        }
    };

    return (
        <div className={styles.container}>
            <div>{backButton()}</div>
            <div className={styles.containeritemTwo}>{heading()}</div>
        </div>
    );
};

export default NewBookingToolbar;
