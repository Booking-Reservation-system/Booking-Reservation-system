import { DateRange, Range, RangeKeyDict } from "react-date-range";
import 'react-date-range/dist/styles.css'; // main style file   
import 'react-date-range/dist/theme/default.css'

const Calendar = (props) => {
    const { value, onChange, disabledDate } = props;

    return (
        <DateRange
            rangeColors={['#262626']}
            ranges={[value]}
            date={new Date()}
            onChange={onChange}
            direction="vertical"
            showDateDisplay={false}
            minDate={new Date()}
            disabledDates={disabledDate}
        />
    )
}

export default Calendar;