import { useNavigate } from "react-router-dom";
import { AdminNavbarProps } from "../../shared/types";
import { AdminViewEnum } from "../../utils/enums/AdminViewEnum";
import { logout } from "../../api/adminApi";
import styles from "../../styles/admin/navbar.module.css";

const AdminNavbar = ({ setAdminView }: AdminNavbarProps) => {
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
            </ul>
        </>
    );
};

export default AdminNavbar;
