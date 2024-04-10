import { Range } from "react-date-range";
import Calendar from "../inputs/Calender";
import Button from "../Button";

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
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {price}</div>
        <div className="font-light text-neutral-600">/ night</div>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        onChange={(value) => onChangeDate(value.selection)}
        disabledDate={disabledDate}
      />
      <hr/>
      <div className="p-4">
        <Button disabled={disabled} label="Reverse" onClick={onSubmit}/>
      </div>
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>
          Total:
        </div>
        <div>
          $ {totalPrice}
        </div>
      </div>
    </div>
  );
};

export default ListingReservation;
