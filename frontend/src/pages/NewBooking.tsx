import { useState } from "react";
import BookingToolbar from "../components/BookingToolbar";
import Services from "../components/Services";
import { NewBookingView } from "../utils/enums/newBookingViewEnum";

const NewBooking = () => {
    const [view, setView] = useState<string>(NewBookingView.Services);

    const content = () => {
        switch (view) {
            case NewBookingView.Services:
                return <Services />;
            case NewBookingView.Calendar:
                return;
            case NewBookingView.Times:
                return;
            case NewBookingView.Form:
                return;
        }
    };

    return (
        <>
            <BookingToolbar view={view} setView={setView} />
            {content()}
        </>
    );
};

export default NewBooking;
