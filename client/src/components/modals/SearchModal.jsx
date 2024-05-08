import React, { useCallback, useState, useMemo, Suspense } from "react";
import qs from "query-string";
import { formatISO, set } from "date-fns";
import { useNavigate } from "react-router-dom";

import Modal from "./Modal";
import Map from "../Map";
import useSearchModal from "../../hooks/useSearchModal";
import Heading from "../Heading";
import CountrySelect from "../inputs/CountrySelect";

const STEPS = {
  LOCATION: 0,
  DATE: 1,
  INFO: 2,
};

const SearchModal = () => {
  const searchModal = useSearchModal();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);

  const [location, setLocation] = useState();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(() => React.lazy(() => import("../Map")), [location]);

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback( async () => {
    if (step !== STEPS.INFO) {
        return onNext();
      }
  
      let currentQuery = {};
      if (params) {
        currentQuery = qs.parse(params.toString());
      }
      const updatedQuery = {
        ...currentQuery,
        locationValue: location?.value,
        guestCount,
        roomCount,
        bathroomCount,
      };
      if (dateRange.startDate) {
        updatedQuery.startDate = formatISO(dateRange.startDate);
      }
      if (dateRange.endDate) {
        updatedQuery.endDate = formatISO(dateRange.endDate);
      }
  
      const url = qs.stringify(
        {
          url: "/",
          query: updatedQuery,
        },
        { skipNull: true }
      );
  
      setStep(STEPS.LOCATION);
      searchModal.onClose();
  
      navigate(url);
  }, [step, location, guestCount, roomCount, bathroomCount, dateRange, params, onNext]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "Search";
    }
    return "Next";
  }, [step]);

  const secondaryAction = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }
    return "Back"
  }, [step])

  let bodyContent = (
    <div className="flex flex-col gap-8 max-h-[65vh]">
        <Heading
            title="Where you want to go?"
            subtitle="Find the perfect location!"
        />
        <CountrySelect
            value={location}
            onChange={(value) => {
                setLocation(value)
            }}
        />
        <hr/>
        <Suspense fallback={<div>Loading...</div>}>
          <Map center={location?.lating} />
        </Suspense>
    </div>
  )

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      title="Filter"
      actionLabel="Search"
      body={bodyContent}
    />
  );
};

export default SearchModal;
