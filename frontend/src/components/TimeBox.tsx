import { format, Interval } from "date-fns";
import { useNewBookingContext } from "../hooks/NewBookingContext";
import styles from "../styles/timeBox.module.css";

type TimeBoxProps = {
    interval: Interval;
};

const TimeBox = ({ interval }: TimeBoxProps) => {
    const { getBookedDate, setBookedDateState } = useNewBookingContext();
    const bookedDate = getBookedDate();

    const handleClick = async () => {
        if (bookedDate && interval.start instanceof Date) {
            setBookedDateState(interval.start);
        }
    };

    return (
        <div onClick={handleClick} className={styles.timeBox}>
            <p>{`${format(interval.start, "k:mm")} - ${format(interval.end, "k:mm")}`}</p>
        </div>
    );
};

export default TimeBox;
