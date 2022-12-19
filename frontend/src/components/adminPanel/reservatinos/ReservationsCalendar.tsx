import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useQuery } from "react-query";
import { getMonthReservations } from "../../../api/adminApi";
import { numberMonthEnum } from "../../../utils/enums/numberMonthEnum";
import Loading from "../../Loading";
import { Reservation, TableArrayExistingReservations } from "../../../shared/types";
import styles from "../../../styles/admin/reservations/reservationCalendar.module.css";

type ReservationsCalendarType = {
    setDayDetailReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
    setSelectedReservationsDay: React.Dispatch<React.SetStateAction<Date | null>>;
    setIsDetailOn: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReservationsCalendar = ({
    setDayDetailReservations,
    setSelectedReservationsDay,
    setIsDetailOn,
}: ReservationsCalendarType) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const reservationsInfo = useQuery(["reservationsInfoObject", [year, month]], getMonthReservations, {
        useErrorBoundary: true,
    });

    const generateTableArray = (data: any) => {
        const tableArray = [[], [], [], [], [], []] as TableArrayExistingReservations[][];
        const monthStartDay = new Date(year, month - 1, 1).getDay();
        const startMonIsOne = monthStartDay === 0 ? 7 : monthStartDay;

        // empty cells falling into not current month
        for (let i = 0; i < startMonIsOne - 1; i++) {
            tableArray[0][i] = { available: false, date: 0, reservations: [] };
        }

        // the rest of the table
        for (let i = startMonIsOne - 1; i < 42; i++) {
            if (data.data[`${i - startMonIsOne + 2}`]) {
                tableArray[i / 7 - ((i / 7) % 1)][i % 7] = {
                    available: data.data[`${i - startMonIsOne + 2}`].length !== 0,
                    date: i - startMonIsOne + 2,
                    reservations: data.data[`${i - startMonIsOne + 2}`],
                };
                // cells for not days in current month
            } else {
                tableArray[i / 7 - ((i / 7) % 1)][i % 7] = {
                    available: false,
                    date: 0,
                    reservations: [],
                };
            }
        }
        return tableArray;
    };

    const handleClick = (day: number, reservations: Reservation[]) => {
        setSelectedReservationsDay(new Date(year, month - 1, day));
        setDayDetailReservations(reservations);
        setIsDetailOn(true);
    };

    const generateTableBody = (tableArray: TableArrayExistingReservations[][]) => {
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
                                data-tooltip={`number of reservations: ${cell.reservations.length}`}
                                onClick={
                                    cell.available
                                        ? () => {
                                              handleClick(cell.date, cell.reservations);
                                          }
                                        : undefined
                                }
                                key={keyCell++}
                                className={cell.available ? styles.available : styles.unavailable}
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

    if (reservationsInfo.data) {
        return (
            <div className={styles.contentContaienr}>
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
                    <tbody>{generateTableBody(generateTableArray(reservationsInfo.data))}</tbody>
                </table>
            </div>
        );
    }

    return <Loading />;
};

export default ReservationsCalendar;
