import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import useRentModal from "../../hooks/useRentModal";
import Modal from "./Modal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect from "../inputs/CountrySelect";

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

    const [step, setStep] = useState(STEPS.CATEGORY);

    const { 
        register, 
        handleSubmit, 
        setValue, 
        watch, 
        formState: { errors }, 
        reset 
    } = useForm({
        defaultValues: {
            category: "",
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: '',
            title: '',
            description: '',
        }
    });

    const watchCategory = watch("category");
    const setCustomValue = (id, value) => {
        setValue(id, value, {
            shouldValidate: true,
            // check if the input value is valid
            shouldDirty: true,
            // check if the input value is dirty (changed from default value)
            shouldTouch: true,
            // check if the input has been touched (focused and leaved)
        })
    }


    const onBack = (value) => {
        setStep((value) => value - 1)
    }

    const onNext = (value) => {
        setStep((value) => value + 1)
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return "Create"
        }
        return "Next"
    },[step])
   
    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }
        return "Back"
    }, [step])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title="Which of these best describes your place" subtitle="Pick a category"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1 font-semibold">
                        <CategoryInput onClick={(watchCategory) => {setCustomValue('category', watchCategory)}} selected={watchCategory === item.label} label={item.label} icon={item.icon}/>
                    </div>
                ))}
            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Where is your place located?" subtitle="Help guests find you"/>
                <CountrySelect value={location} onChange={(value) => setCustomValue('location', value)}/>
            </div>
        )
    }

    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={onNext}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title="Add your home"
            body={bodyContent}
        />
    )
}

export default RentModal;