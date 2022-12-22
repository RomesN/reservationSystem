import DateTimePicker from "react-datetime-picker";
import { faChevronLeft, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { getMonthIntervalsClosedRestrictions } from "../../../api/adminApi";
import IntervalClosedBox from "./IntervalClosedBox";
import Loading from "../../Loading";
import { numberMonthEnum } from "../../../shared/utils/enums/numberMonthEnum";
import styles from "../../../styles/admin/restrictions/intervalsClosed.module.css";
import AddIntervalPopup from "./AddIntervalPopup";
import { isSameDay } from "date-fns";

const IntervalClosed = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [isVisibleArray, setIsVisibleArray] = useState<number[] | null>(null);
    const [addPopupVisibility, setAddPopupVisibility] = useState(false);
    const [newStartTime, setNewStartTime] = useState(new Date());
    const [newEndTime, setNewEndTime] = useState(new Date());

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
            setNewEndTime(new Date(value));
        }
    };

    const handleNewEndTime = (value: Date) => {
        setNewEndTime(value);
        if (!isSameDay(value, newStartTime)) {
            setNewStartTime(new Date(value));
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
                    <div className={styles.fromPickerContainer}>
                        <p>From</p>
                        <DateTimePicker
                            value={newStartTime}
                            onChange={handleNewStartTime}
                            clearIcon={null}
                            format="yy.MM.dd HH:mm"
                        ></DateTimePicker>
                    </div>
                    <div className={styles.toPickerContainer}>
                        <p>To</p>
                        <DateTimePicker
                            value={newEndTime}
                            onChange={handleNewEndTime}
                            clearIcon={null}
                            format="yy.MM.dd HH:mm"
                        ></DateTimePicker>
                    </div>
                    <div className={styles.submitButtonContainer}>
                        <button>Submit</button>
                    </div>
                </div>
            </AddIntervalPopup>
        </>
    );
};

export default IntervalClosed;
