import { isBefore, lastDayOfMonth, startOfToday } from "date-fns";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import {
    createBusinessClosedRestriction,
    deleteBusinessClosedRestriction,
    getMonthBusinessClosedRestrictions,
} from "../../../api/adminApi";
import styles from "../../../styles/admin/calendar.module.css";
import Loading from "../../Loading";
import { numberMonthEnum } from "../../../shared/utils/enums/numberMonthEnum";
import { queryClient } from "../../../shared/utils/helpers/functions";
import { Restriction, TableArrayBusinessClosed } from "../../../shared/types";

const BusinessClosed = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const businessClosed = useQuery(["businessClosedRestrictions", [year, month]], getMonthBusinessClosedRestrictions, {
        useErrorBoundary: true,
    });

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

    const createResctrictionMutation = useMutation({
        mutationFn: createBusinessClosedRestriction,
        onSuccess: (data: Restriction) => {
            queryClient.setQueryData(
                ["businessClosedRestrictions", [year, month]],
                (oldData: Restriction[] | null | undefined) => (oldData ? [...oldData, data] : [])
            );
        },
    });

    const deleteRestrictionMutation = useMutation({
        mutationFn: deleteBusinessClosedRestriction,
        onSuccess: (data: string, variables: number) => {
            queryClient.setQueryData(
                ["businessClosedRestrictions", [year, month]],
                (oldData: Restriction[] | null | undefined) =>
                    oldData ? [...oldData.filter((restriction) => restriction.id !== variables)] : []
            );
        },
    });

    const handleClick = (
        restrictionId: number | null | undefined,
        isClosed: boolean,
        date: number,
        month: number,
        year: number
    ) => {
        if (isClosed && restrictionId) {
            deleteRestrictionMutation.mutate(restrictionId);
        } else {
            createResctrictionMutation.mutate(`${year}-${month}-${date}`);
        }
    };

    const generateTableArray = (data: Restriction[]) => {
        const tableArray = [[], [], [], [], [], []] as TableArrayBusinessClosed[][];
        const monthStartDay = new Date(year, month - 1, 1).getDay();
        const startMonIsOne = monthStartDay === 0 ? 7 : monthStartDay;
        const monthEndDate = lastDayOfMonth(new Date(year, month - 1, 1)).getDate();

        // empty cells falling into not current month
        for (let i = 0; i < startMonIsOne - 1; i++) {
            tableArray[0][i] = { isClosed: false, date: 0, isInPastOrNextMonth: true };
        }

        // the rest of the table
        for (let i = startMonIsOne - 1; i < 42; i++) {
            const row = i / 7 - ((i / 7) % 1);
            const column = i % 7;
            const tableDate = i - startMonIsOne + 2;
            // check if some resctriction on given date
            const foundRestriction = data
                ? data.find((restriction) => {
                      const date = new Date(restriction.date + "T00:00:00.000Z");
                      return (
                          date.toString() !== "Invalid Date" &&
                          year === date.getFullYear() &&
                          month === date.getMonth() + 1 &&
                          tableDate === date.getDate()
                      );
                  })
                : null;

            tableArray[row][column] = {
                restrictionId: foundRestriction ? foundRestriction.id : null,
                isClosed: tableDate <= monthEndDate ? !!foundRestriction : false,
                date: tableDate <= monthEndDate ? tableDate : 0,
                isInPastOrNextMonth:
                    tableDate <= monthEndDate
                        ? isBefore(
                              new Date(`${year}-${month}-${tableDate < 10 ? 0 : ""}${tableDate}T00:00:00.000Z`),
                              startOfToday()
                          )
                        : true,
            };
        }
        return tableArray;
    };

    const generateTableBody = (tableArray: TableArrayBusinessClosed[][]) => {
        let keyRow = 0;
        let keyCell = 0;
        return tableArray.map((row) => {
            return (
                <tr key={keyRow++}>
                    {row.map((cell) => {
                        if (keyRow === 5 && tableArray[5][0].date === 0) {
                            return undefined;
                        }
                        return (
                            <td
                                onClick={
                                    !cell.isInPastOrNextMonth
                                        ? () => handleClick(cell.restrictionId, cell.isClosed, cell.date, month, year)
                                        : undefined
                                }
                                key={keyCell++}
                                className={`${
                                    cell.isInPastOrNextMonth
                                        ? styles.unavailable
                                        : cell.isClosed
                                        ? styles.selected
                                        : styles.availableToSelect
                                } ${!cell.isInPastOrNextMonth ? styles.selectable : ""}`}
                            >
                                {cell.date !== 0 ? `${cell.date}` : ""}
                            </td>
                        );
                    })}
                </tr>
            );
        });
    };

    if (businessClosed.data) {
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
                    <tbody>{generateTableBody(generateTableArray(businessClosed.data))}</tbody>
                </table>
            </>
        );
    }

    return <Loading />;
};
export default BusinessClosed;
