import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../modals/Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import useEditProfileModal from "../../hooks/useEditProfileModal";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";

const ChangePasswordModal = () => {
  const editProfile = useEditProfileModal();
  const { authToken } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const oldPassword = watch("oldPassword");
  const newPassword = watch("newPassword");

  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Change your password" subtitle="Input carefully!" />
      <Input
        id="oldPassword"
        label="Old password"
        value={oldPassword}
        showPassword={showPassword}
        setShowPassword={() => setShowPassword(!showPassword)}
        type={showPassword ? "text" : "password"}
        onChange={(value) => setCustomValue("oldPassword", value)}
        errors={errors}
        required
        register={register}
      />
      <Input
        id="newPassword"
        label="New password"
        showPassword={showPassword}
        setShowPassword={() => setShowPassword(!showPassword)}
        type={showPassword ? "text" : "password"}
        value={newPassword}
        onChange={(value) => setCustomValue("newPassword", value)}
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
        "http://localhost:8080/api/profile/change-password",
        data,
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      );
      toast.success("Profile updated successfully");
      editProfile.onChangePasswordClose();
    } catch (error) {
      console.log(error);
      toast.error("Fail to update password");
    }
  };

  return (
    <Modal
      isOpen={editProfile.isChangePassword}
      onClose={editProfile.onChangePasswordClose}
      title="Change password"
      actionLabel="Save Changes"
      body={bodyContent}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};

export default ChangePasswordModal;
