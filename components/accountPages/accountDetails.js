import Image from "next/image";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import graphqlClient from "../../apollo-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const AccountDetails = ({ backAction }) => {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordDone, setForgotPasswordDone] = useState(false);

  const [currentEmail, setCurrentEmail] = useState("");

  const back = () => {
    setForgotPassword(false);
  };

  const client = graphqlClient;

  const RESETPASSWORD = gql`
    mutation MyMutation($username: String!) {
      sendPasswordResetEmail(input: { username: $username }) {
        success
        user {
          email
        }
      }
    }
  `;

  const [resetPassword, { rpdata, rploading, rperror }] = useMutation(
    RESETPASSWORD,
    {
      client: client,
    }
  );

  const router = useRouter();

  const logout = () => {
    router.push("/login");
  };

  useEffect(() => {
    setCurrentEmail(localStorage.getItem("employeremail"));
  }, []);

  return (
    <div className="bg-erniedarkcream h-full flex flex-col overflow-y-auto gap-6 pb-6">
      {" "}
      {forgotPasswordDone && (
        <div className="flex min-h-screen flex-col bg-erniecream">
          <div className="w-screen h-screen flex flex-col bg-erniedarkcream">
            <div className="p-6">
              <p className="font-circular text-erniegreen text-center">
                We&apos;ve sent you a password reset email.
              </p>
            </div>
            <div className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer mx-6">
              <p
                className="font-circe text-erniegreen font-[900] text-xl text-center"
                style={{ fontFamily: "var(--font-circerounded)" }}
                onClick={(e) => {
                  setForgotPassword(false);
                  setForgotPasswordDone(false);
                  logout();
                }}
              >
                Continue to login
              </p>
            </div>
          </div>
        </div>
      )}
      {!forgotPassword && !forgotPasswordDone ? (
        <div className="px-6 lg:px-10 flex flex-col gap-6">
          <div
            className="py-2 lg:pt-10 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
            onClick={backAction}
          >
            <div className="h-3 w-3 lg:w-4 lg:h-4 relative">
              <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
            </div>
            <p className="font-circular font-[500] text-center text-sm text-erniegreen lg:text-base">
              Back
            </p>
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-10">
            <div className="flex flex-col gap-6">
              <div className="p-6 bg-erniecream rounded-xl flex flex-col gap-2">
                <p className="font-circe font-[900] text-xl text-erniegreen uppercase">
                  Your Login Details
                </p>
                <img src="/divider.png" className="w-full"></img>
                <div className="flex flex-col gap-4 lg:mt-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="emailaddress"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Email Address*
                    </label>
                    <input
                      type="text"
                      name="emailaddress"
                      onChange={(e) => {}}
                      value={currentEmail}
                      disabled
                      required
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg disabled:opacity-50"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="password"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Password*
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={"erniepassword"}
                      disabled
                      onChange={(e) => {}}
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg disabled:opacity-50"
                    ></input>
                  </div>
                </div>
              </div>
              <div
                className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => {
                  setForgotPassword(true);
                }}
              >
                <p className="font-circe text-erniegreen font-[900]  text-center">
                  Reset Password
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="flex flex-col flex-grow rounded-lg bg-erniecream p-6 gap-2">
                <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                  Your Details
                </p>
                <img src="/divider.png" className="w-full"></img>
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:mt-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="businessname"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Name of Company *
                    </label>
                    <input
                      type="text"
                      name="businessname"
                      onChange={(e) => {
                        setRBusinessName(e.currentTarget.value);
                      }}
                      disabled
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px] disabled:opacity-50"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="poifirstname"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Point of Contact First Time *
                    </label>
                    <input
                      type="text"
                      name="poifirstname"
                      disabled
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]  disabled:opacity-50"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="address"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      disabled
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px] disabled:opacity-50"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="postcode"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Postcode *
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      disabled
                      onChange={(e) => {
                        setPostcode(e.currentTarget.value);
                        checkPostcode(e.currentTarget.value);
                      }}
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px] disabled:opacity-50"
                    ></input>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contactnumber"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Contact Number *
                    </label>
                    <input
                      type="text"
                      name="contactnumber"
                      disabled
                      onChange={(e) => {}}
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px] disabled:opacity-50"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="emailaddress"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Email Address
                    </label>
                    <input
                      type="text"
                      name="emailaddress"
                      disabled
                      onChange={(e) => {
                        setREmailAddress(e.currentTarget.value);
                      }}
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg  disabled:opacity-50"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="password"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      disabled
                      onChange={(e) => {
                        setRPassword(e.currentTarget.value);
                      }}
                      className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg disabled:opacity-50"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="numberofstaff"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Number of Staff *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="nosoptions"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          1-20
                        </label>
                        <input
                          type="radio"
                          name="nosoptions"
                          disabled
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 disabled:opacity-50"
                          value={"1-20"}
                          checked={true}
                        ></input>
                      </div>
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="nosoptions"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none "
                        >
                          21-50
                        </label>
                        <input
                          type="radio"
                          name="nosoptions"
                          disabled
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10  disabled:opacity-50"
                          value={"21-50"}
                        ></input>
                      </div>
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="nosoptions"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          51-100
                        </label>
                        <input
                          type="radio"
                          name="nosoptions"
                          disabled
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10  disabled:opacity-50"
                          value={"51-100"}
                        ></input>
                      </div>
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="nosoptions"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          100+
                        </label>
                        <input
                          type="radio"
                          name="nosoptions"
                          disabled
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 disabled:opacity-50"
                          value={"100+"}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="numberofstaff"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Do you have a coffee machine on site?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="coffeemachine"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          Yes
                        </label>
                        <input
                          type="radio"
                          name="coffeemachine"
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10  disabled:opacity-50"
                          value={"Yes"}
                          disabled
                          checked={true}
                        ></input>
                      </div>
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="coffeemachine"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          No
                        </label>
                        <input
                          type="radio"
                          name="coffeemachine"
                          disabled
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 disabled:opacity-50"
                          value={"No"}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="numberofstaff"
                      className="font-circular text-erniegreen text-sm font-[500]"
                    >
                      Do you have work from home days?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="wfhdays"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          Yes
                        </label>
                        <input
                          type="radio"
                          name="wfhdays"
                          disabled
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 disabled:opacity-50"
                          value={"Yes"}
                          checked={true}
                        ></input>
                      </div>
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="wfhdays"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          No
                        </label>
                        <input
                          type="radio"
                          name="wfhdays"
                          disabled
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 disabled:opacity-50"
                          value={"No"}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => {}}
              >
                <p className="font-circe text-erniegreen font-[900]  text-center">
                  Edit Details
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {" "}
          <div className="flex min-h-screen flex-col bg-erniecream">
            <div className="w-screen h-screen flex flex-col bg-erniedarkcream">
              <div
                className="py-2 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer mx-6"
                onClick={back}
              >
                <div className="h-3 w-3 relative">
                  <Image
                    src="/left-arrow.svg"
                    fill={true}
                    className="h-6"
                  ></Image>
                </div>
                <p className="font-circular font-[500] text-center text-sm text-erniegreen">
                  Back
                </p>
              </div>
              <div className="p-6">
                <div className="flex flex-col flex-grow rounded-lg bg-erniecream p-6 gap-2">
                  <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                    Forgot Password
                  </p>
                  <img src="/divider.png" className="w-full"></img>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="emailaddress"
                        className="font-circular text-erniegreen text-sm font-[500]"
                      >
                        Email Address *
                      </label>
                      <input
                        type="text"
                        name="emailaddress"
                        onChange={(e) => {
                          setForgotPasswordEmail(e.currentTarget.value);
                        }}
                        required
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer mx-6"
                onClick={(e) => {
                  e.preventDefault();
                  resetPassword({
                    variables: { username: forgotPasswordEmail },
                  })
                    .catch((error) => {
                      console.log(error);

                      setForgotPasswordDone(true);
                    })
                    .then((data) => {
                      setForgotPasswordDone(true);
                    });
                }}
              >
                <p className="font-circe text-erniegreen font-[900] text-xl text-center">
                  Reset Password
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
