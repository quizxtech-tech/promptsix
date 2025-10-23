"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { loginSuccess } from "@/store/reducers/userSlice";
import FirebaseData from "@/utils/Firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import NewUser from "@/components/Common/NewUser.jsx";
import { t } from "@/utils";
import { withTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { handleFirebaseAuthError } from "@/utils";
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { fcmToken, sysConfigdata } from "@/store/reducers/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkUserExistsApi, registerApi, updateFcmIdApi } from "@/api/apiRoutes";
import {
  errorCodeAccountHasBeenDeactivated,
  errorCodeUserDoesNotExists,
} from "@/api/apiEndPoints";
import { currentAppLanguage } from "@/store/reducers/languageSlice";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const Login = () => {
  const [loading, setLoading] = useState(false);

  const [newUserScreen, setNewUserScreen] = useState(false);

  const [type, setType] = useState("password");

  const [Icon, setIcon] = useState(<BsEyeSlash style={{color: '#918ea0'}}/>);

  const { auth } = FirebaseData();

  const dispatch = useDispatch();

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

  const emailRef = useRef();

  const passwordRef = useRef();

  const router = useRouter();

  const web_fcm_id = useSelector(fcmToken);

  const currAppLan = useSelector(currentAppLanguage);
  


  const systemconfig = useSelector(sysConfigdata);
  // signin
  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  //email signin
  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      let userdata = await signin(email, password);
      
      let image_url = userdata.user.photoURL;
      setProfile(userdata.user);
      setProfile((values) => ({ ...values, auth_type: "email" }));
      if (userdata.user.emailVerified) {
        const checkUserResponse = await checkUserExistsApi({
          firebase_id: userdata.user.uid,
        });

        const registerResponse = await registerApi({
          firebase_id: userdata.user.uid,
          type: "email",
          username: userdata?.user?.displayName,
          email: email,
          image_url: image_url,
          web_fcm_id: web_fcm_id,
          web_language: currAppLan,
        });

        web_fcm_id && updateFcmIdApi({ web_fcm_id: web_fcm_id });
        if (registerResponse.message === errorCodeAccountHasBeenDeactivated) {
          toast.error(t("ac_deactive"));
        } else {
          dispatch(loginSuccess(registerResponse));
          if (checkUserResponse.message === errorCodeUserDoesNotExists) {
            setNewUserScreen(true);
          } else {
            setNewUserScreen(false);
            toast.success(t("successfully_login"));
            router.push("/category");
          }
        }
        setLoading(false);
      } else {
        toast.error(t("ver_email_first"));
        setLoading(false);
      }
    } catch (error) {
      handleFirebaseAuthError(error.code);
      setLoading(false);
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

  useEffect(() => {
    setTimeout(() => {
      emailRef.current?.focus();
    }, 100);
  }, []);


  return (
    <Layout>
      <div className=" relative m-auto flex justify-center items-center max-991:h-auto mt-20">
        {!newUserScreen ? (
          <div className="max-w-[600px] px-[15px] mx-auto w-full ">
            <div className="row rounded-xl bordercolor bg-white bg-opacity-6 relative dark:rounded-[32px]">
              <div className="w-full  border-solid relative">
                <div className="  p-11 max-767:px-3 bg-[var(--background-2)] rounded-xl darkSecondaryColor  dark:rounded-[32px]">
                  <h3 className="headline">{t("login")}</h3>

                  <div className="my-[30px] mx-auto">
                    <ul className="flex  items-center justify-between gap-5 cursor-pointer pl-0 max-575:flex-col">
                      {systemconfig.gmail_login === "1" && (
                        <li className="flex items-center w-full">
                          <button
                            className="!shadow-none flex gap-3 w-full font-medium text-text-color py-4 px-5 justify-center items-center rounded-[16px]  border border-[var(--border)] dark:border-[#FFFFFF7A]"
                            onClick={signInWithGoogle}
                          >
                            <FcGoogle className="h-6 w-6" /> {t("login_with_google")}
                          </button>
                        </li>
                      )}
                      {systemconfig.phone_login === "1" && (
                        <li className="flex items-center w-full">
                          <button
                            className="!shadow-none flex gap-3 w-full font-medium text-text-color py-4 px-7 justify-center items-center rounded-[16px] border border-[var(--border)] dark:border-[#FFFFFF7A]"
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
                        <p className="mx-5 dark:text-[#adaab8]">{t("or_continue_with_email")}</p>
                        <span className="h-px w-[27%] opacity-15 bg-black dark:bg-white max-575:hidden "></span>
                      </div>
                    )}

                  {systemconfig.email_login === "1" && (
                    <form onSubmit={(e) => handleSignin(e)}>
                      {/* Email Input */}
                      <div className="relative inline-block w-full">
                        <Input
                          id="email"
                          type="email"
                          placeholder={t("enter_email")}
                          className=" darkSecondaryColor w-full mb-8 rounded-[8px] bg-white h-16 rtl:pr-14 ltr:pl-14 text-[#212529] "
                          ref={emailRef}
                          defaultValue={process.env.NEXT_PUBLIC_VERCEL === "true" ? "losev53679@pacfut.com" : null}
                          required
                        />
                        <span className="absolute top-0 rtl:right-0 ltr:left-0 w-12 h-16 flex justify-center items-center text-[#ddd]">
                          <HiOutlineMail style={{color: '#918ea0'}} />
                        </span>
                      </div>

                      {/* Password Input */}
                      <div className=" relative inline-block w-full">
                        <Input
                          id="password"
                          type={type}
                          placeholder={t("enter_password")}
                          className="darkSecondaryColor w-full rounded-[8px] bg-white h-16 rtl:pr-14 ltr:pl-14 text-[#212529] border border-gray-300"
                          ref={passwordRef}
                          defaultValue={process.env.NEXT_PUBLIC_VERCEL === "true" ? "losev53679@pacfut.com" : null}
                          required
                        />
                        <span className="absolute top-0 rtl:right-0 ltr:left-0 w-12 h-16 flex justify-center items-center text-[#ddd]">
                        <MdLockOutline style={{color: '#918ea0'}}/>
                        </span>
                        <span
                          onClick={handletoggle}
                          className="absolute top-6 rtl:left-4 ltr:right-4 flex justify-center items-center cursor-pointer text-text-color"
                        >
                          {Icon}
                        </span>
                      </div>

                      {/* Forgot Password Link */}
                      <div className="text-right my-5">
                        <small>
                          <Link
                            href="/auth/reset-password"
                            className="text-sm text-text-color font-semibold underline"
                          >
                            {t("forgot_pass")}?
                          </Link>
                        </small>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        variant="login"
                        size="login"
                        className=" "
                        disabled={loading}
                      >
                        {loading ? t("please_wait") : t("login")}
                      </Button>
                    </form>
                  )}
                  {(systemconfig.email_login === "0" &&
                    systemconfig.gmail_login === "0" &&
                    systemconfig.phone_login === "1") ||
                  (systemconfig.email_login === "0" &&
                    systemconfig.gmail_login === "1" &&
                    systemconfig.phone_login === "0") ? (
                    ""
                  ) : (
                    <p className="text-center font-normal dark:text-gray-400">
                      {t("dont_have_acc")}&nbsp;
                      <span>
                        <Link
                          href="/auth/sign-up"
                          replace
                          className="text-text-color font-semibold dark:text-primary-color dark:text-bold underline"
                        >
                          {t("sign_up")}
                        </Link>
                      </span>
                    </p>
                  )}
                </div>
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

export default withTranslation()(Login);
