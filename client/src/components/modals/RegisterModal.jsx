import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";

const RegisterModal = () => {
  const loginModal = useLoginModal()
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    // sent a request to the server that will create a new user
    // then onClose() the modal
    axios
      .post("http://localhost:8080/api/auth/signup", data)
      .then((res) => {
        registerModal.onClose();
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.data[0].msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };


  const emailValidation = {
    checkEmailPattern: (value) => {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);

      // mysite.ourearth.com [@ is not present]
      // mysite@.com.my [ tld (Top Level domain) can not start with dot "." ]
      // @you.me.net [ No character before @ ]
      // mysite123@gmail.b [ ".b" is not a valid tld ]
      // mysite@.org.org [ tld can not start with dot "." ]
      // .mysite@mysite.org [ an email should not be start with "." ]
      // mysite()*@gmail.com [ here the regular expression only allows character, digit, underscore, and dash ]
      // mysite..1234@yahoo.com [double dots are not allowed]
    },
  };

  const passwordValidation = {
    checkPasswordPattern: (value) => {
      return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value); // "Password must contain at least 8 characters, one letter and one number"
    },
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen()
  }, [loginModal, registerModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to our App" subtitle="Create an account" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validate={emailValidation}
      />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validate={passwordValidation}
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {}}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onCLick={() => {}}
      />
      <div className="text-neutral-500 text-center mt-4 font-light justify-center flex flex-row gap-2">
        <div>Already have an account?</div>
        <div
          className="text-neutral-800 cursor-pointer hover:underline"
          onClick={onToggle}
        >
          Log in
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
