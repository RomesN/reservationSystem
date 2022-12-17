import React, { useContext } from "react";
import { useState } from "react";
import { Props } from "../shared/types";
import { AdminViewEnum } from "../utils/enums/AdminViewEnum";

type AdminPanelContextType = {
    adminView: AdminViewEnum;
    setAdminView: React.Dispatch<AdminViewEnum>;
};

export const AdminPanelContext = React.createContext({} as AdminPanelContextType);

export function useAdminPanelContext() {
    return useContext(AdminPanelContext);
}

export const AdminPanelContextProvider = ({ children }: Props) => {
    const [adminView, setAdminView] = useState(AdminViewEnum.Reservations);

    return (
        <AdminPanelContext.Provider
            value={{
                adminView,
                setAdminView,
            }}
        >
            {children}
        </AdminPanelContext.Provider>
    );
};
