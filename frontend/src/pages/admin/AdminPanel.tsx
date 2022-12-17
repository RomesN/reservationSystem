import AdminNavbar from "../../components/adminPanel/AdminNavbar";
import { AdminViewEnum } from "../../utils/enums/AdminViewEnum";
import ErrorBoundary from "../../components/ErrorBoundary";
import ReservationsView from "../../components/adminPanel/ReservationsView";
import styles from "../../styles/admin/adminPage.module.css";
import { useAdminPanelContext } from "../../hooks/AdminPanelContext";

const AdminPanel = () => {
    const { adminView } = useAdminPanelContext();

    const content = () => {
        switch (adminView) {
            case AdminViewEnum.Reservations:
                return <ReservationsView />;
        }
    };

    return (
        <>
            <div>
                <div className={styles.navbarContainer}>
                    <ErrorBoundary>
                        <AdminNavbar />
                    </ErrorBoundary>
                </div>
                <div>
                    <ErrorBoundary>{content()}</ErrorBoundary>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;
