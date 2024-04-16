import React, { Suspense, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import useRentModal from "../../hooks/useRentModal";
import Modal from "./Modal";
import Heading from "../Heading";
import { categoriesArray } from "../navbar/Categories";
import ImageUpload from "../inputs/ImageUpload";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect from "../inputs/CountrySelect";
import Counter from "../inputs/Counter";
import Input from "../inputs/Input"
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useTokenStore from "../../hooks/storeToken";

const STEPS = {
  CATEGORY: 0,
  LOCATION: 1,
  INFO: 2,
  IMAGES: 3,
  DESCRIPTION: 4,
  PRICE: 5,
};

const RentModal = () => {
  const rentModal = useRentModal();
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      category: "",
      location: null,
      guestCapacity: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 0,
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const location = watch("location");
  const guestCapacity = watch("guestCapacity");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");

  const Map = useMemo(
    () => React.lazy(() => import("../Map")),
    [location]
  );
  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldValidate: true,
      // check if the input value is valid
      shouldDirty: true,
      // check if the input value is dirty (changed from default value)
      shouldTouch: true,
      // check if the input has been touched (focused and leaved)
    });
  };
  
  const onBack = (value) => {
    setStep((value) => value - 1);
  };

  const onNext = (value) => {
    setStep((value) => value + 1);
  };

  const { token } = useTokenStore();

  const onSubmit = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }
    console.log(data)
    const formDB = new FormData();
    formDB.append('title', data.title);
    formDB.append('description', data.description);
    formDB.append('category', data.category);
    formDB.append('roomCount', data.roomCount);
    formDB.append('bathroomCount', data.bathroomCount);
    formDB.append('guestCapacity', data.guestCapacity);
    formDB.append('location', data.location.value);
    formDB.append('price', data.price);
    formDB.append('image', data.imageSrc);
    // for (const value of formDB.entries()) {
    //   console.log(value[0], value[1]);
    // }

    setIsLoading(true);
    axios.post('http://localhost:8080/api/place', formDB, {
      headers: {
        Authorization: 'Bearer ' + token
      },
    })
      .then(() => {
        toast.success('Your place has been added');
        navigate('/') // redirect to the home page
        reset()
        setStep(STEPS.CATEGORY)
        rentModal.onClose()
      })
      .catch(() => {
        toast.error('Something went wrong')
      })
      .finally(() => {
        setIsLoading(false)
      })
    // console.log(data)
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place"
        subtitle="Pick a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categoriesArray.map((item) => (
          <div key={item.label} className="col-span-1 font-semibold">
            <CategoryInput
              onClick={(category) =>
                setCustomValue("category", category)
              }
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8 max-h-[65vh]">
        <Heading
          title="Where is your place located?"
          subtitle="Help guests find you"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <Map center={location?.lating} />
        </Suspense>
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="Share some basics about your place"
          subtitle="What amenities do you have?" 
        />
        <Counter 
          title="Guests"
          subtitle="How many guests do you allow?"
          value={guestCapacity}
          onChange={(value) => setCustomValue('guestCapacity', value)}
        />
        <hr/>
        <Counter 
          title="Rooms"
          subtitle="How many rooms do you have?"
          value={roomCount}
          onChange={(value) => setCustomValue('roomCount', value)}
        />
        <hr/>
        <Counter 
          title="Bathrooms"
          subtitle="How many bathrooms do you bathroom?"
          value={bathroomCount}
          onChange={(value) => setCustomValue('bathroomCount', value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8 h-[65vh]">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like"
        />
        <ImageUpload value={imageSrc} onChange={(value) => setCustomValue('imageSrc', value)}/>
      </div>
    )
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr/>
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)} 
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title="Add your home"
      body={bodyContent}
    />
  );
};

export default RentModal;
