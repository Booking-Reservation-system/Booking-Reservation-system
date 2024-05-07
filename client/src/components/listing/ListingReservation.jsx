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

<<<<<<< Updated upstream
=======
  const { authToken, authName } = useAuth();
  const editPlaceModal = useEditPlaceModal();
  const navigate = useNavigate();
>>>>>>> Stashed changes
  const formatter =  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 3
  })

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden sticky top-[100px]">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">{formatter.format(price)}</div>
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
        <Button label="Reserve" onClick={onSubmit}/>
<<<<<<< Updated upstream
=======
        {creatorName === authName && authToken && (
          <div className="flex flex-row gap-4">
          <Button label="Delete" onClick={handleDelete}/>
          <Button label="Edit" onClick={editPlaceModal.onOpen}/>
        </div>
        )}
>>>>>>> Stashed changes
      </div>
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>
          Total:
        </div>
        <div>
          {formatter.format(totalPrice)}
        </div>
      </div>
    </div>
  );
};

export default ListingReservation;
