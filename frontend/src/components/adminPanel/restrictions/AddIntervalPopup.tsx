import { ReactNode, useEffect, useState } from "react";
import styles from "../../../styles/admin/restrictions/addPopup.module.css";

type AddIntervalPopupProps = {
    title: string;
    showProp: boolean;
    onClose: (show: boolean) => void;
    children: ReactNode;
};

const AddIntervalPopup = ({ title, showProp, onClose, children }: AddIntervalPopupProps) => {
    const [show, setShow] = useState(false);

    const closeHandler = () => {
        setShow(false);
        onClose(false);
    };

    useEffect(() => {
        setShow(showProp);
    }, [showProp]);

    return (
        <div className={`${styles.overlay} ${show ? styles.show : styles.hidden}`}>
            <div className={styles.popup}>
                <h2>{title}</h2>
                <span className={styles.close} onClick={closeHandler}>
                    &times;
                </span>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default AddIntervalPopup;
