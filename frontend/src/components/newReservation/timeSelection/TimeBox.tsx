import { faCalendar, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, Interval } from "date-fns";
import { useNewReservationContext } from "../../../hooks/NewReservationContext";
import styles from "../../../styles/user/newReservation/timeSelection/timeBox.module.css";

type TimeBoxProps = {
    interval: Interval;
};

const TimeBox = ({ interval }: TimeBoxProps) => {
    const { bookedDate, setBookedDate } = useNewReservationContext();

    const handleClick = async () => {
        if (bookedDate && interval.start instanceof Date) {
            setBookedDate(interval.start);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={
                interval.start instanceof Date && interval.start.getHours() < 12
                    ? styles.timeBoxMorning
                    : styles.timeBoxAfternoon
            }
        >
            <p>
                {interval.start instanceof Date && interval.start.getHours() < 12 ? (
                    <FontAwesomeIcon size="sm" icon={faCalendar} className={styles.icon} />
                ) : (
                    <FontAwesomeIcon size="sm" icon={faCalendarAlt} className={styles.icon} />
                )}
                {` ${format(interval.start, "k:mm")} - ${format(interval.end, "k:mm")}`}
            </p>
        </div>
    );
};

export default TimeBox;
