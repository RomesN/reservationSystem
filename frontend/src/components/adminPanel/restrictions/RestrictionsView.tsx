import { faBusinessTime, faMugSaucer, faShopLock, faUserLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { getAllBusinesshours, updateBusinessHours } from "../../../api/adminApi";
import styles from "../../../styles/admin/restrictions/restrictionsView.module.css";
import HoursSelection from "./HoursSelection";

const RestrictionsView = () => {
    const [restrictionView, setRestrictionView] = useState("businessHours");

    const handleToolbarClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setRestrictionView(e.currentTarget.name);
    };

    const getContent = (restrictionView: string) => {
        switch (restrictionView) {
            case "businessHours":
                return <HoursSelection dataGetter={getAllBusinesshours} dataUpdater={updateBusinessHours} />;
            case "regularBreaks":
                return <HoursSelection dataGetter={getAllBusinesshours} dataUpdater={updateBusinessHours} />;
            case "businessClosed":
                return <></>;
            case "intervalsClosed":
                return <></>;
            default:
                throw new Error("Unexpected view.");
        }
    };

    return (
        <div className={styles.restrictionsViewContainer}>
            <div className={styles.restrictionsToolbar}>
                <button
                    className={`${
                        restrictionView === "businessHours" ? styles.toolbarItemHighlighted : styles.toolbarItem
                    }`}
                    onClick={handleToolbarClick}
                    name="businessHours"
                >
                    <FontAwesomeIcon size="sm" icon={faBusinessTime} /> Business hours
                </button>
                <button
                    className={`${
                        restrictionView === "regularBreaks" ? styles.toolbarItemHighlighted : styles.toolbarItem
                    }`}
                    onClick={handleToolbarClick}
                    name="regularBreaks"
                >
                    <FontAwesomeIcon size="sm" icon={faMugSaucer} /> Regular breaks
                </button>
                <button
                    className={`${
                        restrictionView === "businessClosed" ? styles.toolbarItemHighlighted : styles.toolbarItem
                    }`}
                    onClick={handleToolbarClick}
                    name="businessClosed"
                >
                    <FontAwesomeIcon size="sm" icon={faShopLock} /> Business closed
                </button>
                <button
                    className={`${
                        restrictionView === "intervalsClosed" ? styles.toolbarItemHighlighted : styles.toolbarItem
                    }`}
                    onClick={handleToolbarClick}
                    name="intervalsClosed"
                >
                    <FontAwesomeIcon size="sm" icon={faUserLock} /> Intervals closed
                </button>
            </div>
            <div className={styles.contentContainer}>{getContent(restrictionView)}</div>
        </div>
    );
};

export default RestrictionsView;
