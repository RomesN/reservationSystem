import TimePicker, { TimePickerValue } from "react-time-picker";
import { IntervalGeneralRestriction } from "../../../shared/types";
import styles from "../../../styles/admin/restrictions/generalRestrictionBox.module.css";

type GeneralResctrictionBoxType = {
    restriction: IntervalGeneralRestriction;
    index: number;
    setter: React.Dispatch<React.SetStateAction<IntervalGeneralRestriction[]>>;
    view: string;
};

const GeneralResctrictionBox = ({ restriction, index, setter, view }: GeneralResctrictionBoxType) => {
    const handleChangeStart = (value: TimePickerValue) => {
        setter((prevValue) => {
            const previousArray = [...prevValue];
            previousArray[index] = { ...previousArray[index], startTime: value ? value.toString() : "" };
            return previousArray;
        });
    };

    const handleChangeEnd = (value: TimePickerValue) => {
        setter((prevValue) => {
            const previousArray = [...prevValue];
            previousArray[index] = { ...previousArray[index], endTime: value ? value.toString() : "" };
            return previousArray;
        });
    };

    const handleChangeClosed = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.checked;
        if (value) {
            setter((prevValue) => {
                const previousArray = [...prevValue];
                previousArray[index] = { ...previousArray[index], endTime: "", startTime: "" };
                return previousArray;
            });
        } else {
            setter((prevValue) => {
                const previousArray = [...prevValue];
                previousArray[index] = {
                    ...previousArray[index],
                    endTime: view === "businessHours" ? "18:00" : "14:00",
                    startTime: view === "businessHours" ? "9:00" : "13:00",
                };
                return previousArray;
            });
        }
    };

    return (
        <div className={styles.rowDay}>
            <div className={styles.dayname}>
                <p>{restriction.weekday}</p>
            </div>
            <div className={styles.from}>
                <label>From</label>
                <TimePicker
                    disabled={!restriction.endTime && !restriction.startTime}
                    value={restriction.startTime}
                    onChange={handleChangeStart}
                    clearIcon={null}
                    className={styles.timePicker}
                    format="HH:mm"
                ></TimePicker>
            </div>
            <div className={styles.to}>
                <label>To</label>
                <TimePicker
                    disabled={!restriction.endTime && !restriction.startTime}
                    value={restriction.endTime}
                    onChange={(value) => handleChangeEnd(value)}
                    clearIcon={null}
                    className={styles.timePicker}
                    format="HH:mm"
                ></TimePicker>
            </div>
            <div className={styles.checkContainer}>
                <input
                    type="checkbox"
                    checked={!restriction.endTime && !restriction.startTime}
                    onChange={handleChangeClosed}
                />
                <label> {`${view === "businessHours" ? "Closed" : "None"}`}</label>
            </div>
        </div>
    );
};

export default GeneralResctrictionBox;
