import { format, Interval } from "date-fns";
import styles from "../styles/timeBox.module.css";

type TimeBoxProps = {
    interval: Interval;
};

const TimeBox = ({ interval }: TimeBoxProps) => {
    const handleClick = () => {};

    return (
        <div
            onClick={() => {
                handleClick();
            }}
            className={styles.timeBox}
        >
            <p>{`${format(interval.start, "k:mm")} - ${format(interval.end, "k:mm")}`}</p>
        </div>
    );
};

export default TimeBox;
