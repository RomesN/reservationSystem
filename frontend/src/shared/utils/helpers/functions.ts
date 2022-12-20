import { IntervalGeneralRestriction } from "../../types";

const timesArrayConverter = (timesArray: IntervalGeneralRestriction[]) => {
    return timesArray.map((restriction) => ({
        weekday: restriction.weekday,
        startTime: restriction.startTime
            ? new Date(
                  1970,
                  0,
                  1,
                  parseInt(restriction.startTime.substring(0, 2)),
                  parseInt(restriction.startTime.substring(3)),
                  0
              )
            : null,
        endTime: restriction.endTime
            ? new Date(
                  1970,
                  0,
                  1,
                  parseInt(restriction.endTime.substring(0, 2)),
                  parseInt(restriction.endTime.substring(3)),
                  0
              )
            : null,
    }));
};

export { timesArrayConverter };
