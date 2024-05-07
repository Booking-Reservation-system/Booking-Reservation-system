import { useNavigate } from "react-router-dom";  
import Calendar from "../inputs/Calender";
import Button from "../Button";

import useEditPlaceModal from "../../hooks/useEditPlaceModal";
import useRentModal from "../../hooks/useRentModal";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { toast } from "react-hot-toast";
import ROUTES from "../../constants/routes";

const ListingReservation = (props) => {
  const {
    price,
    totalPrice,
    onChangeDate,
    dateRange,
    onSubmit,
    disabled,
    disabledDate,
    placeId,
    creatorName
  } = props;

  const { authToken } = useAuth();
  const editPlaceModal = useEditPlaceModal();
  const rentModal = useRentModal();
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const formatter =  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 3
  })

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/place/${placeId}`, {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      });
      toast.success(response.data.message);
      navigate(ROUTES.HOME)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  const handleEdit = () => {
    editPlaceModal.onOpen()
  }

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
      <div className="p-4 flex flex-col gap-4">
        <Button label="Reserve" onClick={onSubmit}/>
        {creatorName === userName && authToken && (
          <div className="flex flex-row gap-4">
          <Button label="Delete" onClick={handleDelete}/>
          <Button label="Edit" onClick={handleEdit}/>
        </div>
        )}
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
