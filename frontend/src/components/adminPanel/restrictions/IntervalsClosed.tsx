import DateTimePicker from "react-datetime-picker";
import { faChevronLeft, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import AddIntervalPopup from "./AddIntervalPopup";
import { createIntervalClosedRestriction, getMonthIntervalsClosedRestrictions } from "../../../api/adminApi";
import { isBefore, isSameDay, isSameMonth } from "date-fns";
import IntervalClosedBox from "./IntervalClosedBox";
import Loading from "../../Loading";
import { numberMonthEnum } from "../../../shared/utils/enums/numberMonthEnum";
import { parse } from "date-fns/esm";
import { queryClient } from "../../../shared/utils/helpers/functions";
import { Restriction } from "../../../shared/types";
import styles from "../../../styles/admin/restrictions/intervalsClosed.module.css";

const IntervalClosed = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [isVisibleArray, setIsVisibleArray] = useState<number[] | null>(null);
    const [addPopupVisibility, setAddPopupVisibility] = useState(false);
    const [newStartTime, setNewStartTime] = useState(new Date());
    const [newEndTime, setNewEndTime] = useState(new Date());
    const [popupFormInvalidFormat, setPopupFormInvalidFormat] = useState(false);

    const popupCloseHandler = (isVisible: boolean) => {
        setAddPopupVisibility(isVisible);
    };

    const toolbarRef = useRef<null | HTMLDivElement>(null);
    const boxesRef = useRef<Array<HTMLDivElement | null>>([]);

    const intervalsClosed = useQuery(
        ["intervalsClosedRestrictions", [year, month]],
        getMonthIntervalsClosedRestrictions,
        {
            useErrorBoundary: true,
        }
    );

    const createResctrictionMutation = useMutation({
        mutationFn: createIntervalClosedRestriction,
        onSuccess: (data: Restriction) => {
            if (isSameMonth(parse(data.date || "", "yyyy-MM-dd", new Date()), new Date(year, month - 1, 15))) {
                queryClient.setQueryData(
                    ["intervalsClosedRestrictions", [year, month]],
                    (oldData: Restriction[] | null | undefined) => (oldData ? [...oldData, data] : [])
                );
            }
        },
    });

    function checkIfSomeElementIsOverlapping() {
        if (toolbarRef.current && boxesRef.current && isVisibleArray) {
            const toolbar = toolbarRef.current.getBoundingClientRect();
            boxesRef.current.forEach((element, i) => {
                if (element) {
                    const reservationBox = element.getBoundingClientRect();
                    if (toolbar.top - 50 > reservationBox.top) {
                        setIsVisibleArray((isVisiblePrev) => {
                            if (isVisiblePrev) {
                                const isVisibleCopy = [...isVisiblePrev];
                                isVisibleCopy[i] = 2;
                                return isVisibleCopy;
                            } else {
                                return null;
                            }
                        });
                    } else if (toolbar.top > reservationBox.top) {
                        setIsVisibleArray((isVisiblePrev) => {
                            if (isVisiblePrev) {
                                const isVisibleCopy = [...isVisiblePrev];
                                isVisibleCopy[i] = 1;
                                return isVisibleCopy;
                            } else {
                                return null;
                            }
                        });
                    } else {
                        setIsVisibleArray((isVisiblePrev) => {
                            if (isVisiblePrev) {
                                const isVisibleCopy = [...isVisiblePrev];
                                isVisibleCopy[i] = 0;
                                return isVisibleCopy;
                            } else {
                                return null;
                            }
                        });
                    }
                }
            });
        }
    }

    useEffect(() => {
        function watchScroll() {
            window.addEventListener("scroll", checkIfSomeElementIsOverlapping);
        }
        watchScroll();

        return () => {
            window.removeEventListener("scroll", checkIfSomeElementIsOverlapping);
        };
    });

    useEffect(() => {
        if (intervalsClosed.data) {
            setIsVisibleArray(new Array(intervalsClosed.data.length).fill(0));
        }
    }, [intervalsClosed.data]);

    useEffect(() => {
        setPopupFormInvalidFormat(false);
        setNewEndTime(new Date());
        setNewStartTime(new Date());
    }, [addPopupVisibility]);

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

    const handleNewStartTime = (value: Date) => {
        setNewStartTime(value);
        if (!isSameDay(value, newEndTime)) {
            setNewEndTime(value);
        }
    };

    const handleNewEndTime = (value: Date) => {
        setNewEndTime(value);
        if (!isSameDay(value, newStartTime)) {
            setNewStartTime(value);
        }
    };

    const handlePopupSubmit = () => {
        if (
            !isBefore(newStartTime, newEndTime) ||
            isBefore(newStartTime, new Date()) ||
            isBefore(newEndTime, new Date()) ||
            !isSameDay(newEndTime, newStartTime)
        ) {
            setPopupFormInvalidFormat(true);
        } else {
            setPopupFormInvalidFormat(false);
            createResctrictionMutation.mutate({
                startDate: newStartTime.toISOString(),
                endDate: newEndTime.toISOString(),
            });
            setAddPopupVisibility(false);
        }
    };

    return (
        <>
            <div className={styles.selectionToolbar} ref={toolbarRef}>
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
                <button
                    onClick={() => setAddPopupVisibility((previousValue) => !previousValue)}
                    className={styles.buttonAdd}
                >
                    <FontAwesomeIcon size="sm" icon={faPlus} /> Add
                </button>
                <button onClick={nextMonth} className={styles.buttonNext}>
                    <FontAwesomeIcon size="sm" icon={faChevronRight} />
                </button>
            </div>
            <div className={styles.intervalsClosedListContainer}>
                {intervalsClosed.data ? (
                    intervalsClosed.data.map((restriction, i) => (
                        <div
                            ref={(el: HTMLDivElement) => (boxesRef.current[i] = el)}
                            key={restriction.id}
                            className={`${
                                isVisibleArray && isVisibleArray[i] === 0
                                    ? styles.visibleBox
                                    : isVisibleArray && isVisibleArray[i] === 1
                                    ? styles.visibleTransitBox
                                    : styles.hiddenBox
                            }`}
                        >
                            <IntervalClosedBox restriction={restriction} year={year} month={month} />
                        </div>
                    ))
                ) : (
                    <Loading />
                )}
            </div>
            <AddIntervalPopup onClose={popupCloseHandler} showProp={addPopupVisibility} title="Add new interval">
                <div className={styles.popupFormContainer}>
                    <div className={styles.fromContainer}>
                        <p className={styles.labelPicker}>From</p>
                        <DateTimePicker
                            minDate={new Date()}
                            className={styles.pickerItself}
                            value={newStartTime}
                            onChange={handleNewStartTime}
                            clearIcon={null}
                            format="dd.MM.yy HH:mm"
                            locale="cs-CZ"
                        ></DateTimePicker>
                    </div>
                    <div className={styles.toContainer}>
                        <p className={styles.labelPicker}>To</p>
                        <DateTimePicker
                            minDate={new Date()}
                            className={styles.pickerItself}
                            value={newEndTime}
                            onChange={handleNewEndTime}
                            clearIcon={null}
                            format="dd.MM.yy HH:mm"
                            locale={process.env.REACT_APP_LOCALE}
                        ></DateTimePicker>
                    </div>
                    <div className={styles.submitButtonContainer}>
                        {popupFormInvalidFormat && (
                            <div className={styles.invalidInput}>
                                <p>make sure that start is before end on the same day</p>
                            </div>
                        )}
                        <button className={styles.submitButton} onClick={handlePopupSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </AddIntervalPopup>
        </>
    );
};

export default IntervalClosed;
