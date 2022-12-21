import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, parseISO } from "date-fns";
import { useMutation } from "react-query";
import Swal from "sweetalert2";
import { deleteIntervalClosedRestriction } from "../../../api/adminApi";
import { Restriction } from "../../../shared/types";
import { queryClient } from "../../../shared/utils/helpers/functions";
import styles from "../../../styles/admin/restrictions/intervalClosedBox.module.css";
import stylesSweetAlert from "../../../styles/general/sweetAlert.module.css";

type IntervalClosedBoxProps = {
    restriction: Restriction;
    year: number;
    month: number;
};

const IntervalClosedBox = ({ restriction, year, month }: IntervalClosedBoxProps) => {
    const deleteRestrictionMutation = useMutation({
        mutationFn: deleteIntervalClosedRestriction,
        onSuccess: (data: string, variables: number) => {
            queryClient.setQueryData(
                ["intervalsClosedRestrictions", [year, month]],
                (oldData: Restriction[] | null | undefined) =>
                    oldData ? [...oldData.filter((restriction) => restriction.id !== variables)] : []
            );
            Swal.fire({
                icon: "success",
                text: `Interval was deleted.`,
                iconColor: "#6d9886",
                customClass: {
                    popup: stylesSweetAlert.popup,
                    confirmButton: stylesSweetAlert.primaryButton,
                    title: stylesSweetAlert.title,
                    icon: stylesSweetAlert.infoIcon,
                    actions: stylesSweetAlert.actionsContainer,
                },
            });
        },
    });

    const handleDelete = () => {
        Swal.fire({
            icon: "info",
            title: "The interval will be deleted and booking will be possible. Are you sure that you want to continue?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
            customClass: {
                popup: stylesSweetAlert.popup,
                confirmButton: stylesSweetAlert.primaryButton,
                title: stylesSweetAlert.title,
                icon: stylesSweetAlert.infoIcon,
                denyButton: stylesSweetAlert.denyButton,
                actions: stylesSweetAlert.actionsContainer,
            },
        }).then(async (result) => {
            if (result.isConfirmed && restriction.id) {
                deleteRestrictionMutation.mutate(restriction.id);
            } else if (result.isDenied) {
                Swal.fire({
                    icon: "info",
                    text: `The interval was not deleted.`,
                    customClass: {
                        popup: stylesSweetAlert.popup,
                        confirmButton: stylesSweetAlert.primaryButton,
                        title: stylesSweetAlert.title,
                        icon: stylesSweetAlert.infoIcon,
                        actions: stylesSweetAlert.actionsContainer,
                    },
                });
            }
        });
    };

    return (
        <div className={`${styles.restrictionBox}`}>
            <div className={styles.columnOne}>
                <div className={styles.infoLine}>
                    <p>
                        <span className={styles.highlighted}>Date: </span>
                        {`${format(parseISO(restriction.date || ""), "dd.MM.yyyy")}`}
                    </p>
                    <p>
                        <span className={styles.highlighted}>Start: </span>
                        {`${restriction.startTime?.substring(0, 5)}`}
                    </p>
                    <p>
                        <span className={styles.highlighted}>End: </span>
                        {`${restriction.endTime?.substring(0, 5)}`}
                    </p>
                </div>
            </div>
            <div className={styles.columnTwo}>
                <button className={styles.cancel} onClick={() => handleDelete()}>
                    <FontAwesomeIcon size="sm" icon={faXmark} />
                    {` Cancel`}
                </button>
            </div>
        </div>
    );
};

export default IntervalClosedBox;
