import { Range } from "react-date-range";
import Calendar from "../inputs/Calender";

const ListingReservation = (props) => {
  const {
    price,
    totalPrice,
    onChangeDate,
    dateRange,
    onSubmit,
    disabled,
    disabledDate,
  } = props;
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden mt-[100px]">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ 200</div>
        <div className="font-light text-neutral-600">/ night</div>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        onChange={(value) => onChangeDate(value.selection)}
        disabledDate={disabledDate}
      />
    </div>
  );
};

export default ListingReservation;
