import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { numberMonthEnum } from "../../../shared/utils/enums/numberMonthEnum";
import Loading from "../../Loading";
import { Reservation, ReservationsInfoObject, TableArrayExistingReservations } from "../../../shared/types";
import styles from "../../../styles/admin/calendar.module.css";

type ReservationsCalendarType = {
    data: ReservationsInfoObject;
    year: number;
    month: number;
    setYear: React.Dispatch<React.SetStateAction<number>>;
    setMonth: React.Dispatch<React.SetStateAction<number>>;
    setDayDetailReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
    setSelectedReservationsDay: React.Dispatch<React.SetStateAction<Date | null>>;
    setIsDetailOn: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReservationsCalendar = ({
    data,
    year,
    month,
    setYear,
    setMonth,
    setDayDetailReservations,
    setSelectedReservationsDay,
    setIsDetailOn,
}: ReservationsCalendarType) => {
    const generateTableArray = (data: ReservationsInfoObject) => {
        const tableArray = [[], [], [], [], [], []] as TableArrayExistingReservations[][];
        const monthStartDay = new Date(year, month - 1, 1).getDay();
        const startMonIsOne = monthStartDay === 0 ? 7 : monthStartDay;

        // empty cells falling into not current month
        for (let i = 0; i < startMonIsOne - 1; i++) {
            tableArray[0][i] = { available: false, date: 0, reservations: [] };
        }

        // the rest of the table
        for (let i = startMonIsOne - 1; i < 42; i++) {
            if (data[`${i - startMonIsOne + 2}` as keyof ReservationsInfoObject]) {
                const reservations = data[`${i - startMonIsOne + 2}` as keyof ReservationsInfoObject];
                tableArray[i / 7 - ((i / 7) % 1)][i % 7] = {
                    available: Array.isArray(reservations) && reservations.length !== 0,
                    date: i - startMonIsOne + 2,
                    reservations: Array.isArray(reservations) ? reservations : [],
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

    if (data) {
        return (
            <>
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
                    <tbody>{generateTableBody(generateTableArray(data))}</tbody>
                </table>
            </>
        );
    }

    return <Loading />;
};

export default ReservationsCalendar;
