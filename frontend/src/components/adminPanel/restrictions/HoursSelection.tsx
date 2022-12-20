import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Loading from "../../Loading";
import {
    ErrorResponse,
    IntervalGeneralRestriction,
    OkNullDataReservationResponse,
    Restriction,
} from "../../../shared/types";
import GeneralResctrictionBox from "./GeneralResctrictionBox";
import styles from "../../../styles/admin/restrictions/hoursSelection.module.css";
import stylesSweetAlert from "../../../styles/sweetAlert.module.css";

type HoursSelectionProps = {
    dataGetter: (
        setData: React.Dispatch<React.SetStateAction<Restriction[] | null>>,
        setIsError: React.Dispatch<React.SetStateAction<boolean | null>>
    ) => void;
    dataUpdater: (
        timesArray: IntervalGeneralRestriction[]
    ) => Promise<OkNullDataReservationResponse | AxiosError<ErrorResponse, any>>;
};

const HoursSelection = ({ dataGetter, dataUpdater }: HoursSelectionProps) => {
    const [data, setData] = useState<Restriction[] | null>(null);
    const [isError, setIsError] = useState<boolean | null>(null);
    const [timesArray, setTimesArray] = useState<IntervalGeneralRestriction[]>([]);

    useEffect(() => {
        dataGetter(setData, setIsError);
    }, [dataGetter]);

    useEffect(() => {
        if (data && data.length === 7) {
            data?.forEach((restriction, i) => {
                setTimesArray((prevData) => {
                    const previousArray = [...prevData];
                    previousArray[i] = {
                        weekday: restriction.weekday || "",
                        startTime: restriction.startTime || "",
                        endTime: restriction.endTime || "",
                    };
                    return previousArray;
                });
            });
        }
    }, [data, setTimesArray]);

    const handleSubmit = async (timesArray: IntervalGeneralRestriction[]) => {
        const result = await dataUpdater(timesArray);
        if (!axios.isAxiosError(result)) {
            Swal.fire({
                icon: "success",
                text: `Business hours were adjusted.`,
                iconColor: "#6d9886",
                customClass: {
                    popup: stylesSweetAlert.popup,
                    confirmButton: stylesSweetAlert.primaryButton,
                    title: stylesSweetAlert.title,
                    icon: stylesSweetAlert.infoIcon,
                    actions: stylesSweetAlert.actionsContainer,
                },
            });
        } else {
            Swal.fire({
                icon: "error",
                text: `Something went wrong.`,
                iconColor: "#6d9886",
                customClass: {
                    popup: stylesSweetAlert.popup,
                    confirmButton: stylesSweetAlert.primaryButton,
                    title: stylesSweetAlert.title,
                    icon: stylesSweetAlert.errorIcon,
                    actions: stylesSweetAlert.actionsContainer,
                },
            });
        }
    };

    if (data) {
        return (
            <>
                <div className={styles.mainContainer}>
                    {timesArray.map((restriction, i) => (
                        <GeneralResctrictionBox key={i} restriction={restriction} index={i} setter={setTimesArray} />
                    ))}
                    <button onClick={() => handleSubmit(timesArray)}>Save changes</button>
                </div>
            </>
        );
    } else if (isError) {
        throw new Error("Unexpected response");
    }

    return <Loading />;
};

export default HoursSelection;
