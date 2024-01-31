import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import toast from "react-hot-toast";
import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import Modal from "./Modal";

const LoginModal = () => {
const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = (data) => {
    setIsLoading(true);
    axios.post("", data)
        .then(() => {
            loginModal.onClose();
        })
        .catch((err) => {
            toast.error("Something went wrong");
        })
        .finally(() => {
            setIsLoading(false);
        });
  }

  const bodyContent = (
    <div className="flex flex-col gap-4">
        <Heading title="Welcome to our App" subtitle="Login an account"/>
        <Input id="email" label="Email" type="type" disabled={isLoading} register={register} errors={errors} required/>
        <Input id="password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} required/>
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
        <hr/>
        <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => {}}/>
        <Button outline label="Continue with Github" icon={AiFillGithub} onClick={() => {}}/>
        <div className="text-neutral-500 text-center justify-center mt-4 font-light flex flex-row gap-2"> 
            <p>First time using this App?</p>
            <span className="text-neutral-800 cursor-pointer hover:underline">
                    Create an account
            </span>
        </div>
    </div>
  )

  return (
    <Modal 
        disabled={isLoading}
        isOpen={loginModal.isOpen}
        onClose={loginModal.onClose}
        title="Login"
        onSubmit={handleSubmit(submitHandler)}
        actionLabel="Continue"
        body={bodyContent}
        footer={footerContent}
    />
  )
};

export default LoginModal;
