import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { numberMonthEnum } from "../../../shared/utils/enums/numberMonthEnum";
import stylesCalendar from "../../../styles/admin/calendar.module.css";

const IntervalClosed = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

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

    return (
        <div className={stylesCalendar.selectionToolbar}>
            <button
                className={
                    new Date().getMonth() + 1 >= month && new Date().getFullYear() === year
                        ? stylesCalendar.buttonPreviousDisabled
                        : stylesCalendar.buttonPrevious
                }
                disabled={new Date().getMonth() + 1 >= month && new Date().getFullYear() === year}
                onClick={previousMonth}
            >
                <FontAwesomeIcon size="sm" icon={faChevronLeft} />
            </button>
            <div className={stylesCalendar.heading}>
                <p>{`${numberMonthEnum[month]} ${year}`}</p>
            </div>
            <button onClick={nextMonth} className={stylesCalendar.buttonNext}>
                <FontAwesomeIcon size="sm" icon={faChevronRight} />
            </button>
        </div>
    );
};

export default IntervalClosed;
