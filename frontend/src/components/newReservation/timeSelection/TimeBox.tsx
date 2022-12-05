import { format, Interval } from "date-fns";
import { useNewBookingContext } from "../../../hooks/NewBookingContext";
import styles from "../../../styles/newReservation/timeSelection/timeBox.module.css";

type TimeBoxProps = {
    interval: Interval;
};

const TimeBox = ({ interval }: TimeBoxProps) => {
    const { bookedDate, setBookedDate } = useNewBookingContext();

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
            <p>{`${format(interval.start, "k:mm")} - ${format(interval.end, "k:mm")}`}</p>
        </div>
    );
};

export default TimeBox;
