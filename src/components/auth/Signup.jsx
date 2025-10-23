"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaMobileAlt, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { loginSuccess } from "@/store/reducers/userSlice";
import FirebaseData from "@/utils/Firebase";
import "swiper/css/effect-fade";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import NewUser from "@/components/Common/NewUser";
import dynamic from "next/dynamic";
import { t } from "@/utils";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { handleFirebaseAuthError } from "@/utils";
import { fcmToken, sysConfigdata } from "@/store/reducers/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineMail } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerApi, updateFcmIdApi } from "@/api/apiRoutes";
import { errorCodeAccountHasBeenDeactivated } from "@/api/apiEndPoints";
import { MdLockOutline } from "react-icons/md";
import { currentAppLanguage } from "@/store/reducers/languageSlice";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [newUserScreen, setNewUserScreen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    email: "",
    profile: "",
    all_time_rank: "",
    all_time_score: "",
    coins: "",
    friends_code: "",
  });

  const dispatch = useDispatch();

  const [type, setType] = useState("password");

  const [type2, setType2] = useState("password");

  const [Icon, setIcon] = useState(<BsEyeSlash style={{color: '#918ea0'}}/>);

  const [Icon2, setIcon2] = useState(<BsEyeSlash style={{color: '#918ea0'}}/>);

  const [confPassword, setConfPassword] = useState("");

  const emailRef = useRef();

  const passwordRef = useRef();

  const router = useRouter();

  const { auth } = FirebaseData();

  const systemconfig = useSelector(sysConfigdata);
  
  const web_fcm_id = useSelector(fcmToken);

  const currAppLan = useSelector(currentAppLanguage);
  //signup
  const signup = async (email, password) => {
    let promise = await new Promise(function (resolve, reject) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          let resposne = userCredential.user;
          sendEmailVerification(resposne);
          toast.success(t("email_sent"));
          resolve(userCredential);
          auth.signOut();
        })
        .catch((error) => reject(error));
    });
    return promise;
  };

  //email signin
  const handleSignup = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (password === confPassword) {
      setLoading(true);
      signup(email, password)
        .then((response) => {
          setLoading(false);
          router.push("/");
        })
        .catch((err) => {
          toast.error(err.message);
          setLoading(false);
        });
    } else {
      toast.error(t("password_mismatch_warning"));
    }
  };

  //google sign in
  const signInWithGoogle = async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      const { user } = response;

      setProfile(user);
      setProfile((values) => ({
        ...values,
        auth_type: "gmail",
      }));

      const {
        uid: firebase_id,
        email,
        phoneNumber: phone,
        photoURL: image_url,
        displayName,
      } = user;

      const { isNewUser } = getAdditionalUserInfo(response);

      const payload = {
        firebase_id: firebase_id,
        type: "gmail",
        email: email,
        image_url: image_url,
        mobile: phone,
        web_fcm_id: web_fcm_id,
        web_language: currAppLan,
      };
      if (isNewUser) {
        payload.username = displayName;
      }
      const registerResponse = await registerApi(payload);
      web_fcm_id && updateFcmIdApi({ web_fcm_id: web_fcm_id });
      if (registerResponse.message === errorCodeAccountHasBeenDeactivated) {
        toast.error(t("ac_deactive"));
      } else {
        toast.success(t("successfully_login"));
        dispatch(loginSuccess(registerResponse));
      }

      if (isNewUser) {
        setNewUserScreen(true);
      } else {
        router.push("/category");
      }
      setLoading(false);
    } catch (error) {
      handleFirebaseAuthError(error.code);
      setLoading(false);
    }
  };

  // show password
  const handletoggle = () => {
    if (type === "password") {
      setIcon(<BsEye style={{color: '#918ea0'}}/>);
      setType("text");
    } else {
      setIcon(<BsEyeSlash style={{color: '#918ea0'}}/>);
      setType("password");
    }
  };
  // show confirm password
  const handletoggle2 = () => {
    if (type2 === "password") {
      setIcon2(<BsEye style={{color: '#918ea0'}}/>);
      setType2("text");
    } else {
      setIcon2(<BsEyeSlash style={{color: '#918ea0'}}/>);
      setType2("password");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      emailRef.current?.focus();
    }, 100);
  }, []);

  return (
    <Layout>
      <div className="container mt-20">
        {!newUserScreen ? (
          <div className="max-w-[600px] w-full m-auto mt-5 darkSecondaryColor rounded-[16px] dark:rounded-[32px]">
            <div className=" morphisam dark:rounded-[32px]">
              <div className="md:p-5 relative ">
                <h3 className="headline">{t("sign_up")}</h3>

                <div className="my-[30px] mx-auto">
                  <ul className="flex  items-center justify-between gap-5 cursor-pointer pl-0 max-575:flex-col">
                    {systemconfig.gmail_login === "1" && (
                      <li className="flex items-center w-full ">
                        <button
                          className="!shadow-none  border border-[var(--border)] flex gap-3 w-full font-medium text-text-color py-4 px-3 sm:px-7 justify-center items-center rounded-[16px]  dark:border-[#FFFFFF7A]"
                          onClick={signInWithGoogle}
                        >
                          <FcGoogle className="h-6 w-6" /> {t("login_with_google")}
                        </button>
                      </li>
                    )}
                    {systemconfig.phone_login === "1" && (
                      <li className="flex items-center w-full">
                        <button
                          className="!shadow-none flex gap-3 w-full font-medium text-text-color py-4 px-3 sm:px-7 justify-center items-center rounded-[16px] border border-[var(--border)] dark:border-[#FFFFFF7A]"
                          onClick={() => {
                            router.push("/auth/otp-verify");
                          }}
                        >
                          <FaMobileAlt className="h-6 w-6" /> {t("login_phone")}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
                {(systemconfig.phone_login === "1" ||
                  systemconfig.gmail_login === "1") &&
                  systemconfig.email_login === "1" && (
                    <div className=" mb-5 flex justify-between items-center">
                      <span className="h-px w-[27%] opacity-15 bg-black dark:bg-white max-575:hidden"></span>
                      <p className="mx-2 sm:mx-5 dark:text-[#adaab8]">
                        {t("or_continue_with_email")}
                      </p>
                      <span className="h-px w-[27%] opacity-15 bg-black dark:bg-white max-575:hidden "></span>
                    </div>
                  )}
                {systemconfig.email_login === "1" && (
                  <form onSubmit={(e) => handleSignup(e)}>
                    <div className="mb-8 relative inline-block w-full">
                      <Input
                        type="email"
                        placeholder={t("enter_email")}
                        className="darkSecondaryColor w-full rounded-[8px] bg-white h-16 pl-9 rtl:pr-10 sm:rtl:pr-14 ltr:sm:pl-14 text-[#212529] border border-gray-300"
                        required={true}
                        ref={emailRef}
                      />
                      <span className="absolute top-0 rtl:right-0 ltr:left-0 w-12 dark:w-16 h-16 flex justify-center items-center text-[#ddd]">
                        <HiOutlineMail style={{color: '#918ea0'}}/>
                      </span>
                    </div>

                    <div className="mb-8 relative inline-block w-full">
                      <Input
                        type={type}
                        placeholder={t("enter_password")}
                        className="darkSecondaryColor w-full rounded-[8px] bg-white h-16 pl-9 rtl:pr-10 sm:rtl:pr-14 ltr:sm:pl-14 text-[#212529] border border-gray-300 placeholder:truncate"
                        required={true}
                        ref={passwordRef}
                      />
                      <span className="absolute top-0 rtl:right-0 ltr:left-0 dark:w-16 w-12 h-16 flex justify-center items-center text-[#ddd]">
                        <MdLockOutline style={{color: '#918ea0'}}/>
                      </span>
                      <span
                        onClick={handletoggle}
                        className="password_icon absolute top-1/3 ltr:right-2 rtl:left-2 rtl:sm:left-4 ltr:sm:right-4"
                      >
                        {Icon}
                      </span>
                    </div>

                    <div className="mb-8 relative inline-block w-full">
                      <Input
                        type={type2}
                        placeholder={t("confirm_password")}
                        className="darkSecondaryColor w-full  rounded-[8px] bg-white h-16 pl-9 rtl:pr-10 sm:rtl:pr-14 ltr:sm:pl-14 text-[#212529] border border-gray-300 placeholder:truncate"
                        required={true}
                        onChange={(e) => setConfPassword(e.target.value)}
                      />
                      <span className="absolute top-0 rtl:right-0 ltr:left-0 dark:w-16 w-12 h-16 flex justify-center items-center text-[#ddd]">
                        <MdLockOutline style={{color: '#918ea0'}}/>
                      </span>
                      <span
                        onClick={handletoggle2}
                        className="password_icon absolute top-1/3 ltr:right-2 rtl:left-2 rtl:sm:left-4 ltr:sm:right-4"
                      >
                        {Icon2}
                      </span>
                    </div>

                    <div className="flex-center text-[#748494]">
                      <small className="flex items-center text-center gap-2">
                        <input
                          type="checkbox"
                          className="accent-black dark:accent-primary-color w-5 h-5"
                          name="agree"
                          id="agree"
                          required
                        />

                        <div className="dark:!text-[#d2d1d8]">
                          {t("user_agreement_msg")}&nbsp;
                          <Link
                            href={"/terms-conditions"}
                            className="underline"
                          >
                            {t("t_c")}
                          </Link>
                          &nbsp;&&nbsp;
                          <Link href={"/privacy-policy"} className="underline">
                            {t("privacy_policy")}
                          </Link>
                        </div>
                      </small>
                    </div>

                    <Button
                      variant="login"
                      size="login"
                      type="submit"
                      disabled={loading}
                    >
                      {loading
                        ? t("please_wait")
                        : `${t("create")} ${t("details")}`}
                    </Button>
                  </form>
                )}

                <p className="text-center dark:text-[#8b879a]">
                  {t("already_have_acc")}
                  <span>
                    <Link
                      href={"/auth/login"}
                      replace
                      className="text-text-color font-semibold dark:text-primary-color"
                    >
                      &nbsp;{t("login")}
                    </Link>
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <NewUser profile={profile} setProfile={setProfile} />
        )}
      </div>
    </Layout>
  );
};
export default withTranslation()(SignUp);
