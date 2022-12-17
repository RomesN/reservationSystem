import { useNavigate } from "react-router-dom";
import { AdminViewEnum } from "../../utils/enums/AdminViewEnum";
import { logout } from "../../api/adminApi";
import styles from "../../styles/admin/navbar.module.css";
import { useAdminPanelContext } from "../../hooks/AdminPanelContext";

const AdminNavbar = () => {
    const { setAdminView } = useAdminPanelContext();
    const navigate = useNavigate();

    return (
        <>
            <ul className={styles.navbar}>
                <li
                    className={`${styles.hoverSpecialEffect} ${styles.item} ${styles.tertiaryColor}`}
                    onClick={async () => {
                        await logout();
                        navigate("/admin/login");
                    }}
                >
                    Logout
                </li>
                <li
                    className={`${styles.hoverSpecialEffect} ${styles.item} ${styles.secondaryColor}`}
                    onClick={() => setAdminView(AdminViewEnum.Reservations)}
                >
                    Reservations
                </li>
                <li
                    className={`${styles.hoverSpecialEffect} ${styles.item} ${styles.secondaryColor}`}
                    onClick={() => setAdminView(AdminViewEnum.Restrictions)}
                >
                    Restrictions
                </li>
            </ul>
        </>
    );
};

export default AdminNavbar;
