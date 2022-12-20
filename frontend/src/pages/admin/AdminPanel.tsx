import AdminNavbar from "../../components/adminPanel/AdminNavbar";
import { AdminViewEnum } from "../../shared/utils/enums/AdminViewEnum";
import ErrorBoundary from "../../components/ErrorBoundary";
import ReservationsView from "../../components/adminPanel/reservations/ReservationsView";
import RestrictionsView from "../../components/adminPanel/restrictions/RestrictionsView";
import styles from "../../styles/admin/adminPage.module.css";
import { useAdminPanelContext } from "../../hooks/useAdminPanelContext";

const AdminPanel = () => {
    const { adminView } = useAdminPanelContext();

    const content = () => {
        switch (adminView) {
            case AdminViewEnum.Reservations:
                return <ReservationsView />;
            case AdminViewEnum.Restrictions:
                return <RestrictionsView />;
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
                <div className={styles.contentContainer}>
                    <ErrorBoundary>{content()}</ErrorBoundary>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;
