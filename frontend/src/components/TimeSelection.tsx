import { useEffect, useState } from "react";
import { addMinutes, Interval, isBefore, parseISO, isEqual } from "date-fns";
import Loading from "./Loading";
import TimeBox from "./TimeBox";
import { IntervalString } from "../shared/types";
import { useNewBookingContext } from "../hooks/NewBookingContext";
import styles from "../styles/timeSelection.module.css";

const TimeSelection = () => {
    const [timeSlots, setTimeSlots] = useState<Interval[] | null>(null);
    const { getAvailableIntervals, getBookedService } = useNewBookingContext();

    const calculateTimeSlots = (availableTimeSlots: IntervalString[] | null, minutesNeeded: number | undefined) => {
        const slotsToShow = [] as Interval[];
        if (availableTimeSlots && minutesNeeded) {
            availableTimeSlots.forEach((timeSlot) => {
                const maxEnd = parseISO(timeSlot.end);
                let start = parseISO(timeSlot.start);
                let end = addMinutes(start, minutesNeeded);

                while (isBefore(end, maxEnd) || isEqual(end, maxEnd)) {
                    slotsToShow.push({ start, end });
                    start = addMinutes(start, parseInt(process.env.REACT_APP_BOOKING_EVERY_NEAREST_MINUTES || "15"));
                    end = addMinutes(end, parseInt(process.env.REACT_APP_BOOKING_EVERY_NEAREST_MINUTES || "15"));
                }
            });
            setTimeSlots(slotsToShow);
        }
    };

    useEffect(() => {
        calculateTimeSlots(getAvailableIntervals(), getBookedService()?.minutesRequired);
    }, []);

    if (timeSlots) {
        return (
            <div className={styles.timeList}>
                {timeSlots.map((singleInterval) => (
                    <TimeBox key={singleInterval.start.toString()} interval={singleInterval} />
                ))}
            </div>
        );
    }

    return <Loading />;
};

export default TimeSelection;
