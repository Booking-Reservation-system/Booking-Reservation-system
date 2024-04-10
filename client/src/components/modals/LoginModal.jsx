import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import toast from "react-hot-toast";
import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import Modal from "./Modal";
import useTokenStore from "../../hooks/storeToken";
import { useGoogleLogin } from '@react-oauth/google';
// import { useGoogleOneTapLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginModal = () => {
  const navigate = useNavigate();
  const { token, setToken } = useTokenStore();
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

  useEffect(() => {
    if (token !== null) {
      const clearTokenAfterOneHour = () => {
        setToken(null);
        toast.error("Session expired. Please log in again.");
      };

      const timeoutId = setTimeout(clearTokenAfterOneHour, 3600000); // 1 hour

      return () => clearTimeout(timeoutId);
    }
  }, [token]);

  const submitHandler = (data) => {
    setIsLoading(true);
    axios
      .post("http://localhost:8080/api/auth/login", data)
      .then((res) => {
        loginModal.onClose();
        const token = res.data.token;
        setToken(token);
        toast.success("Logged in successfully");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
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
      return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value); // "Password must contain at least 8 characters, one letter and one number"
    },
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);


  
  const login = useGoogleLogin({
    onSuccess: credentialResponse => console.log(credentialResponse.access_token),
  });
  
 
  

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to our App" subtitle="Login an account" />
      <Input
        id="email"
        label="Email"
        type="type"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validate={emailValidation}
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
      {/* <Button outline label="Continue with Google" icon={FcGoogle}/> */}
      <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => login()}></Button>

      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => {}}
      />
      <div className="text-neutral-500 text-center justify-center mt-4 font-light flex flex-row gap-2">
        <p>First time using this App?</p>
        <span
          className="text-neutral-800 cursor-pointer hover:underline"
          onClick={onToggle}
        >
          Create an account
        </span>
      </div>
    </div>
  );

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
  );
};

export default LoginModal;
