import { Button } from "react-bootstrap";
import { useState } from "react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTimeSlots } from "../api/reservationApi";
import Loading from "./Loading";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";
import { numberMonthEnum } from "../utils/enums/numberMonthEnum";
import { IntervalString, okServiceResponseTimeSlots } from "../shared/types";
import styles from "../styles/daySelection.module.css";
import { useQuery } from "react-query";
import { useNewBookingContext } from "../hooks/NewBookingContext";

type tableArray = { available: boolean; date: number; intervalsConnected: IntervalString[] };

const DaySelection = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const { getBookedDate, getBookedService, setBookedDateState, setBookingView, setAvailableIntervalsState } =
        useNewBookingContext();

    const timeSlots = useQuery<okServiceResponseTimeSlots>(
        ["timeSlotsObject", [getBookedService()?.id || null, year, month]],
        getTimeSlots,
        {
            useErrorBoundary: true,
        }
    );

    const generateTableObject = (data: any) => {
        const tableObject = [[], [], [], [], [], []] as tableArray[][];
        const monthStartDay = new Date(year, month - 1, 1).getDay();
        const startMonIsOne = monthStartDay === 0 ? 7 : monthStartDay;

        for (let i = 0; i < startMonIsOne - 1; i++) {
            tableObject[0][i] = { available: false, date: 0, intervalsConnected: [] };
        }
        for (let i = startMonIsOne - 1; i < 42; i++) {
            if (data.data[`${i - startMonIsOne + 2}`]) {
                tableObject[i / 7 - ((i / 7) % 1)][i % 7] = {
                    available: data.data[`${i - startMonIsOne + 2}`].length !== 0,
                    date: i - startMonIsOne + 2,
                    intervalsConnected: data.data[`${i - startMonIsOne + 2}`],
                };
            } else {
                tableObject[i / 7 - ((i / 7) % 1)][i % 7] = {
                    available: false,
                    date: 0,
                    intervalsConnected: [],
                };
            }
        }
        return tableObject;
    };

    const handleClick = (day: number, availableIntervals: IntervalString[]) => {
        setBookedDateState(new Date(year, month - 1, day));
        setBookingView(NewBookingView.Times);
        setAvailableIntervalsState(availableIntervals);
    };

    const generateTableBody = (tableArray: tableArray[][]) => {
        let keyRow = 0;
        let keyCell = 0;
        return tableArray.map((row) => {
            return (
                <tr key={keyRow++}>
                    {row.map((cell) => {
                        if (keyRow === 5 && !tableArray[5][0].available) {
                            return;
                        }
                        return (
                            <td
                                onClick={
                                    cell.available
                                        ? () => {
                                              handleClick(cell.date, cell.intervalsConnected);
                                          }
                                        : undefined
                                }
                                key={keyCell++}
                                className={
                                    getBookedDate()?.getDate() === cell.date &&
                                    (getBookedDate()?.getMonth() || -2) + 1 === month &&
                                    getBookedDate()?.getFullYear() === year
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
            setMonth(() => {
                return 1;
            });
            setYear((year) => {
                return year + 1;
            });
        } else {
            setMonth((month) => {
                return month + 1;
            });
        }
    };

    const previousMonth = () => {
        if (month === 1) {
            setMonth(() => {
                return 12;
            });
            setYear((year) => {
                return year - 1;
            });
        } else {
            setMonth((month) => {
                return month - 1;
            });
        }
    };

    if (timeSlots.data) {
        return (
            <div>
                <div className={styles.selectionToolbar}>
                    <Button
                        className={styles.buttonPrevious}
                        disabled={new Date().getMonth() + 1 >= month && new Date().getFullYear() == year}
                        onClick={previousMonth}
                    >
                        <FontAwesomeIcon size="sm" icon={faChevronLeft} />
                    </Button>
                    <div className={styles.heading}>
                        <p>{`${numberMonthEnum[month]} ${year}`}</p>
                    </div>
                    <Button onClick={nextMonth} className={styles.buttonNext}>
                        <FontAwesomeIcon size="sm" icon={faChevronRight} />
                    </Button>
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
                    <tbody>{generateTableBody(generateTableObject(timeSlots.data))}</tbody>
                </table>
            </div>
        );
    }

    return <Loading />;
};

export default DaySelection;
