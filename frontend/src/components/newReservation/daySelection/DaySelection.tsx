import { addMinutes, Interval, isBefore, parseISO, isEqual } from "date-fns";
import { useQuery } from "react-query";
import { useState } from "react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTimeSlots } from "../../../api/reservationApi";
import { IntervalString } from "../../../shared/types";
import Loading from "../../Loading";
import { NewReservationViewEnum } from "../../../utils/enums/newReservationViewEnum";
import { numberMonthEnum } from "../../../utils/enums/numberMonthEnum";
import styles from "../../../styles/user/newReservation/daySelection/daySelection.module.css";
import { useNewReservationContext } from "../../../hooks/NewReservationContext";

type tableArray = {
    available: boolean;
    date: number;
    intervalsConnected: Interval[];
    morningCount?: number;
    afternoonCount?: number;
};

const DaySelection = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const { bookedDate, bookedService, setAvilableIntervals, setBookedDate, setView } = useNewReservationContext();

    const timeSlots = useQuery(["timeSlotsObject", [bookedService?.id || null, year, month]], getTimeSlots, {
        useErrorBoundary: true,
    });

    const calculateTimeSlots = (availableTimeSlots: IntervalString[] | null, minutesNeeded: number | undefined) => {
        const slotsToShow = [] as Interval[];
        let morningCount = 0;
        let afternoonCount = 0;
        if (availableTimeSlots && minutesNeeded) {
            availableTimeSlots.forEach((timeSlot) => {
                const maxEnd = parseISO(timeSlot.end);
                let start = parseISO(timeSlot.start);
                let end = addMinutes(start, minutesNeeded);

                while (isBefore(end, maxEnd) || isEqual(end, maxEnd)) {
                    slotsToShow.push({ start, end });
                    if (start.getHours() < 12) {
                        morningCount++;
                    } else {
                        afternoonCount++;
                    }
                    start = addMinutes(start, parseInt(process.env.REACT_APP_BOOKING_EVERY_NEAREST_MINUTES || "15"));
                    end = addMinutes(end, parseInt(process.env.REACT_APP_BOOKING_EVERY_NEAREST_MINUTES || "15"));
                }
            });
        }
        return { slotsToShow, morningCount, afternoonCount };
    };

    const generateTableArray = (data: any) => {
        const tableArray = [[], [], [], [], [], []] as tableArray[][];
        const monthStartDay = new Date(year, month - 1, 1).getDay();
        const startMonIsOne = monthStartDay === 0 ? 7 : monthStartDay;

        // empty cells falling into not current month
        for (let i = 0; i < startMonIsOne - 1; i++) {
            tableArray[0][i] = { available: false, date: 0, intervalsConnected: [] };
        }

        // the rest of the table
        for (let i = startMonIsOne - 1; i < 42; i++) {
            if (data.data[`${i - startMonIsOne + 2}`]) {
                const { slotsToShow, morningCount, afternoonCount } = calculateTimeSlots(
                    data.data[`${i - startMonIsOne + 2}`],
                    data.data.serviceRequiredTime
                );

                tableArray[i / 7 - ((i / 7) % 1)][i % 7] = {
                    available: data.data[`${i - startMonIsOne + 2}`].length !== 0,
                    date: i - startMonIsOne + 2,
                    intervalsConnected: slotsToShow,
                    morningCount,
                    afternoonCount,
                };
                // cells for not days in current month
            } else {
                tableArray[i / 7 - ((i / 7) % 1)][i % 7] = {
                    available: false,
                    date: 0,
                    intervalsConnected: [],
                };
            }
        }
        return tableArray;
    };

    const handleClick = (day: number, availableIntervals: Interval[]) => {
        setBookedDate(new Date(year, month - 1, day));
        setAvilableIntervals(availableIntervals);
        setView(NewReservationViewEnum.Times);
    };

    const generateTableBody = (tableArray: tableArray[][]) => {
        let keyRow = 0;
        let keyCell = 0;
        return tableArray.map((row) => {
            return (
                <tr key={keyRow++}>
                    {row.map((cell) => {
                        if (keyRow === 5 && !tableArray[5][0].available) {
                            return undefined;
                        }
                        return (
                            <td
                                data-tooltip={`morning: ${cell.morningCount} slots
                                afternoon: ${cell.afternoonCount} slots`}
                                onClick={
                                    cell.available
                                        ? () => {
                                              handleClick(cell.date, cell.intervalsConnected);
                                          }
                                        : undefined
                                }
                                key={keyCell++}
                                className={
                                    bookedDate?.getDate() === cell.date &&
                                    (bookedDate?.getMonth() || -2) + 1 === month &&
                                    bookedDate?.getFullYear() === year
                                        ? styles.selected
                                        : cell.available
                                        ? styles.available
                                        : styles.unavailable
                                }
                            >
                                {cell.date !== 0 ? `${cell.date}` : ""}
                            </td>
                        );
                    })}
                </tr>
            );
        });
    };

    const nextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear((year) => year + 1);
        } else {
            setMonth((month) => month + 1);
        }
    };

    const previousMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear((year) => year - 1);
        } else {
            setMonth((month) => month - 1);
        }
    };

    if (timeSlots.data) {
        return (
            <div>
                <div className={styles.selectionToolbar}>
                    <button
                        className={
                            new Date().getMonth() + 1 >= month && new Date().getFullYear() === year
                                ? styles.buttonPreviousDisabled
                                : styles.buttonPrevious
                        }
                        disabled={new Date().getMonth() + 1 >= month && new Date().getFullYear() === year}
                        onClick={previousMonth}
                    >
                        <FontAwesomeIcon size="sm" icon={faChevronLeft} />
                    </button>
                    <div className={styles.heading}>
                        <p>{`${numberMonthEnum[month]} ${year}`}</p>
                    </div>
                    <button onClick={nextMonth} className={styles.buttonNext}>
                        <FontAwesomeIcon size="sm" icon={faChevronRight} />
                    </button>
                </div>
                <table className={styles.daySelectionTable}>
                    <thead>
                        <tr>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            <th>Sat</th>
                            <th>Sun</th>
                        </tr>
                    </thead>
                    <tbody>{generateTableBody(generateTableArray(timeSlots.data))}</tbody>
                </table>
            </div>
        );
    }

    return <Loading />;
};

export default DaySelection;
