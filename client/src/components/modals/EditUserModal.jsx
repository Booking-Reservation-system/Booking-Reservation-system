import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../modals/Modal";
import Heading from "../Heading"
import Input from "../inputs/Input"
import useEditProfileModal from "../../hooks/useEditProfileModal";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";
const EditUserModal = () => {
  const editProfile = useEditProfileModal();
  const { authToken } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
    reset,
} = useForm({
    defaultValues: {
        email: "",
        name: "",
    },
});

const name = watch("name");
const email = watch("email");

const setCustomValue = (id, value) => {
    setValue(id, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
    });
}

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Change your information" subtitle="Input carefully!"/>
      <Input
        id="email"
        label="New email"
        value={email}
        onChange={(value) => setCustomValue("email", value)}
        errors={errors}
        required
        register={register}
      />
      <Input
        id="name"
        label="New name"
        value={name}
        onChange={(value) => setCustomValue("name", value)} 
        errors={errors}
        required
        register={register}
      />
    </div>
  );

  const onSubmit = async (data) => {
    console.log(data);
    try {
        const response = await axios.put(
            "http://localhost:8080/api/profile",
            data,
            {
                headers: {
                    Authorization: "Bearer " + authToken,
                }
            }
        )
        toast.success("Profile updated successfully");
        editProfile.onUserClose();
    } catch (error) {
        console.log(error);
        toast.error("Failed to update profile");
    }
  }

  return (
    <Modal 
        isOpen={editProfile.isUserEdit} 
        onClose={editProfile.onUserClose} 
        title="Edit user Information"
        actionLabel="Save Changes"
        body={bodyContent}
        onSubmit={handleSubmit(onSubmit)}
    />
  );
};

export default EditUserModal;
