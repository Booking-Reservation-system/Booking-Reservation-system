import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import { AiFillGithub } from "react-icons/ai";
import toast from "react-hot-toast";
import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import Modal from "./Modal";
import useTokenStore from "../../hooks/storeToken";
import { useGoogleLogin } from "@react-oauth/google";
// import { useGoogleOneTapLogin } from '@react-oauth/google';
import ROUTES from "../../constants/routes";

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

  // Đoạn này hơi loằng ngoằng với làm lag web, dùng tạm thì được :v
    const setTimeToken = () => {
      const basetime = Date.now();
      const intervalId = setInterval(() => {
          if (Date.now() - basetime >= 3600 * 1000) {
              clearInterval(intervalId); // Stop the interval
              setToken(null);
              toast.error("Session expired. Please log in again.");
          }
      }, 1000); // Check every second
  };

  const submitHandler = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", data);
      loginModal.onClose();
      const token = response.data.token;
      setToken(token);
      setTimeToken()
      toast.success("Logged in successfully");
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

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
    onSuccess: (credentialResponse) =>
      console.log(credentialResponse.access_token),
  });

  const GoogleLogin = async() => {
    setIsLoading(true);
    try {
      window.open("http://localhost:8080/auth/google", "_self");
      // const provider = new GoogleAuthProvider();
      //
      // const result = await signInWithPopup(auth, provider);
      //
      // console.log(result);
      // const userData = {
      //   email: result.user.email,
      //   password: result.user.uid,
      // }
      //
      // const response = await axios.post("http://localhost:8080/api/auth/login", userData);
      // setToken(response.data.token);
      // loginModal.onClose();
      // toast.success(response.data.message);
    } catch (error) {
      console.log(error)
    } 
    navigate(ROUTES.HOME);
  }

  const GitLogin = async() => {
    setIsLoading(true);
    try {
        window.open("http://localhost:8080/auth/github", "_self");
      // const provider = new FacebookAuthProvider();
      //
      // const result = await signInWithPopup(auth, provider);
      //
      // console.log(result);
      //
      // const userData = {
      //   email: result.user.email,
      //   password: result.user.uid,
      // }
      //
      // const response = await axios.post("http://localhost:8080/api/auth/login", userData);
      // setToken(response.data.token);
      // loginModal.onClose();
      // toast.success(response.data.message);
      // console.log('LOGGED USER', result.user);
    } catch (error) {
      console.log(error)
    } 
    navigate(ROUTES.HOME);
  }

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
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => login()}
      ></Button>

      <Button
        outline
        label="Continue with Github"
        icon={FaGithub}
        onClick={GitLogin}
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
