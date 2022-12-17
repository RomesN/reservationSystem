import { useState } from "react";
import AdminNavbar from "../../components/adminPanel/AdminNavbar";
import { AdminViewEnum } from "../../utils/enums/AdminViewEnum";
import ErrorBoundary from "../../components/ErrorBoundary";
import styles from "../../styles/admin/adminPage.module.css";

const AdminPanel = () => {
    const [adminView, setAdminView] = useState(AdminViewEnum.Reservations);

    return (
        <>
            <div>
                <div className={styles.navbarContainer}>
                    <ErrorBoundary>
                        <AdminNavbar setAdminView={setAdminView} />
                    </ErrorBoundary>
                </div>
                <div>
                    <ErrorBoundary>{}</ErrorBoundary>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;
