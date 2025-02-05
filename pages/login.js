import Image from "next/image";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import graphqlClient from "../apollo-client";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "../components/alert";

const inter = Inter({ subsets: ["latin"] });

const circularstd = localFont({
  src: [
    {
      path: "../public/fonts/CircularStd-Book.otf",
      weight: "400",
    },
    {
      path: "../public/fonts/circular-std-medium-500.ttf",
      weight: "500",
    },
  ],
  variable: "--font-circularstd",
});

const circerounded = localFont({
  src: [
    {
      path: "../public/fonts/CirceRounded-Alt-Bold.otf",
      weight: "800",
    },
    {
      path: "../public/fonts/CirceRounded-Alt-ExtraBold.otf",
      weight: "900",
    },
  ],
  variable: "--font-circerounded",
});

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [rBusinessName, setRBusinessName] = useState("");
  const [rEmailAddress, setREmailAddress] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [rPFirstName, setRPFirstName] = useState("");
  const [rPAddress, setRPAddress] = useState("");
  const [rPostcode, setRPostcode] = useState("");
  const [rCNumber, setRCNumber] = useState("");
  const [rNoOfStaff, setRNoOfStaff] = useState("1-20");
  const [rMachine, setRMachine] = useState("Yes");
  const [rWFH, setRWFH] = useState("Yes");

  const [testingMode, setTestingMode] = useState(true);

  const [loginLoading, setLoginLoading] = useState(false);

  const [loginType, setLoginType] = useState(0);

  const [registerPage, setRegisterPage] = useState(0);

  const [registerComplete, setRegisterComplete] = useState(false);

  const [postcode, setPostcode] = useState("");
  const [showPCWarning, setShowPCWarning] = useState(false);
  const [showPCRegex, setShowPCRegex] = useState(false);

  const [pushCalled, setPushCalled] = useState(false);

  const [onChanging, setOnChanging] = useState(false);

  const [registerError, setRegisterError] = useState("");

  const [forgotPassword, setForgotPassword] = useState(false);

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(false);

  const [forgotPasswordDone, setForgotPasswordDone] = useState(false);
  const [sendingForgotPW, setSendingForgotPW] = useState(false);

  const [testPlatform, setTestPlatform] = useState("ios");

  const [justRegistered, setJustRegistered] = useState(false);

  // safePush is used to avoid route pushing errors when users click multiple times or when the network is slow:  "Error: Abort fetching component for route"
  const safePush = (path) => {
    if (onChanging) {
      return;
    }
    setOnChanging(true);
    router.push(path);
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (idkey, id) => {
      const params = new URLSearchParams(searchParams);
      params.set(idkey, id);

      return params.toString();
    },
    [searchParams]
  );

  const client = graphqlClient;
  const LOGIN = gql`
    mutation MyMutation($password: String!, $username: String!) {
      login(
        input: {
          provider: PASSWORD
          credentials: { password: $password, username: $username }
        }
      ) {
        authToken
        refreshToken
        wooSessionToken
        sessionToken
        customer {
          sessionToken
          databaseId
          billing {
            address1
            address2
            city
            company
            country
            email
            firstName
            lastName
            phone
            postcode
            state
          }
          shipping {
            address1
            address2
            city
            company
            country
            email
            firstName
            lastName
            phone
            postcode
            state
          }
        }
        user {
          email
          id
          firstName
          auth {
            authToken
            wooSessionToken
            refreshToken
            userSecret
          }
          roles {
            nodes {
              name
            }
          }
          userCompanyField {
            parentUser
            usedApp
            company
          }
          avatar {
            url
          }
        }
      }
    }
  `;

  const CREATECLIENT = gql`
    mutation MyMutation(
      $address: String!
      $coffeeMachine: Boolean!
      $contactNumber: String!
      $email: String!
      $noOfStaff: String
      $poiFirstName: String!
      $poiEmail: String!
      $postcode: String!
      $wfh: Boolean!
      $title: String!
      $bags: Int!
      $carbon: Int!
      $coffee: Int!
      $m25: Int!
      $phones: Int!
      $trees: Int!
    ) {
      createClient(
        input: {
          address: $address
          coffeeMachine: $coffeeMachine
          contactNumber: $contactNumber
          email: $email
          noOfStaff: $noOfStaff
          poiFirstName: $poiFirstName
          poiEmail: $poiEmail
          postcode: $postcode
          wfh: $wfh
          title: $title
          bags: $bags
          carbon: $carbon
          coffee: $coffee
          m25: $m25
          phones: $phones
          trees: $trees
          status: PUBLISH
        }
      ) {
        client {
          clientId
          clientInformation {
            coffeeMachineOnSite
            deliveryCompanyAddress
            pointOfContactFirstName
            pointOfContactEmail
            numberOfStaff
            regCompanyAddress
            workFromHomeDays
          }
        }
      }
    }
  `;

  const CREATEUSER = gql`
    mutation CreateUser(
      $username: String!
      $email: String!
      $password: String!
      $roles: [String]!
      $firstTimeUser: String!
      $company: String!
      $firstName: String!
    ) {
      createUser(
        input: {
          username: $username
          email: $email
          password: $password
          roles: $roles
          firstTimeUser: $firstTimeUser
          company: $company
          firstName: $firstName
        }
      ) {
        user {
          databaseId
          userCompanyField {
            usedApp
            company
          }
        }
      }
    }
  `;

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

  const [login, { data, loading, error }] = useMutation(LOGIN, {
    client: client,
  });

  const [createClient, { ccdata, ccloading, ccerror }] = useMutation(
    CREATECLIENT,
    {
      client: client,
    }
  );

  const [createUser, { cudata, culoading, cuerror }] = useMutation(CREATEUSER, {
    client: client,
  });

  const [resetPassword, { rpdata, rploading, rperror }] = useMutation(
    RESETPASSWORD,
    {
      client: client,
    }
  );

  const [prevUser, setPrevUser] = useState(null);

  useEffect(() => {
    let prevU = localStorage.getItem("prevUser");
    let prevP = localStorage.getItem("prevPass");

    if (prevU != null && prevP != null) {
      setPrevUser({ u: prevU, p: prevP });
    }
  }, []);

  useEffect(() => {
    console.log(loginLoading);
  }, [loginLoading]);

  const registerUser = (email, password, postcode, businessName) => {
    if (localStorage.getItem("authtoken") != null) {
      localStorage.removeItem("authtoken");
    }
    login({
      variables: {
        password: "App1Test2Login3!",
        username: "apptestlogin",
      },
    }).then((data) => {
      console.log("Login");
      console.log(data);

      localStorage.setItem("authtoken", data?.data?.login?.authToken);
      localStorage.setItem("refreshtoken", data?.data?.login?.refreshToken);
      localStorage.setItem("role", data?.data?.login?.user.roles.nodes[0].name);

      console.log(data?.data?.login?.user.roles.nodes[0].name);

      localStorage.setItem(
        "customer",
        JSON.stringify(data?.data?.login?.customer)
      );
      localStorage.setItem(
        "woo-session",
        data?.data?.login?.customer?.sessionToken
      );
      localStorage.setItem(
        "employeruser",
        data?.data?.login?.user.userCompanyField.parentUser
      );

      console.log(data?.data?.login?.user.userCompanyField.parentUser);
      localStorage.setItem(
        "first-time-user",
        data?.data?.login?.user.userCompanyField.usedApp == null ? true : false
      );
      localStorage.setItem("employeremail", data?.data?.login?.user.email);

      localStorage.setItem(
        "companyname",
        data?.data?.login?.user.userCompanyField.company.title
      );

      localStorage.setItem("avatar", data?.data?.login?.user.avatar.url);

      console.log(data);

      createUser({
        variables: {
          username: email,
          email: email,
          password: password,
          roles: "company_admin",
          firstTimeUser: "false",
          company: businessName,
          firstName: rPFirstName,
        },
      })
        .then((data) => {
          console.log(data);

          setJustRegistered(true);

          createClient({
            variables: {
              address: rPAddress,
              coffeeMachine: rMachine == "Yes" ? true : false,
              contactNumber: rCNumber,
              email: rEmailAddress,
              title: rBusinessName,
              noOfStaff: rNoOfStaff,
              poiFirstName: rPFirstName,
              poiEmail: email,
              postcode: rPostcode,
              wfh: rWFH == "Yes" ? true : false,
              bags: 0,
              carbon: 0,
              coffee: 0,
              m25: 0,
              phones: 0,
              trees: 0,
            },
          }).then((data) => {
            console.log(data);

            console.log("complete");

            setRegisterComplete(true);

            loginUser(email, password, true, false, false);

            if (!loginLoading) {
              setLoginLoading(false);
              setLoginType(2);
            }
          });
        })
        .catch((error) => {
          if (error.message == "Sorry, that username already exists!") {
            setRegisterError("Sorry, that email already exists");
            setLoginLoading(false);
          } else if (
            error.message == "Cannot create a user with an empty login name."
          ) {
            setRegisterError("Please enter your desired email address");
          } else {
            setRegisterError(error.message);
          }

          setRBusinessName("");
          setRCNumber("");
          setREmailAddress("");
          setRMachine("Yes");
          setRNoOfStaff("1-20");
          setRPAddress("");
          setRPFirstName("");
          setRPassword("");
          setRPostcode("");
          setRWFH("Yes");
        });
    });
    // createClient({
    //   variables: {
    //     title: businessName,
    //     email: email,
    //     postcode: postcode,
    //   },
    // }).then((data) => {
    //   createUser({
    //     variables: {
    //       username: email,
    //       email: email,
    //       password: password,
    //     },
    //   }).then((data) => {
    //     setRegisterComplete(true);
    //   });
    // });
  };

  const [incorrectPassword, setIncorrectPassword] = useState(false);

  const loginUser = (un, pw, jr, cfh, gs) => {
    if (localStorage.getItem("authtoken") != null) {
      localStorage.removeItem("authtoken");
    }
    login({
      variables: {
        password: pw,
        username: un,
      },
    })
      .then((data) => {
        if (!loginLoading) {
          setLoginLoading(false);
        }

        console.log("Login");
        console.log(data);

        localStorage.setItem("cfh", cfh);
        localStorage.setItem("groundswell", gs);

        localStorage.setItem("authtoken", data?.data?.login?.authToken);
        localStorage.setItem("refreshtoken", data?.data?.login?.refreshToken);

        console.log(data?.data?.login?.user.roles.nodes[0].name);

        if (!cfh) {
          localStorage.setItem(
            "role",
            data?.data?.login?.user.roles.nodes[0].name
          );

          localStorage.setItem("firstName", data?.data?.login?.user?.firstName);

          localStorage.setItem(
            "customer",
            JSON.stringify(data?.data?.login?.customer)
          );
          localStorage.setItem(
            "woo-session",
            data?.data?.login?.customer?.sessionToken
          );
          localStorage.setItem(
            "employeruser",
            data?.data?.login?.customer?.databaseId //NEEDS CHANGING IF EMPLOYEES ADDED
          );
          console.log(data?.data?.login?.customer?.databaseId);
          localStorage.setItem(
            "first-time-user",
            data?.data?.login?.user.userCompanyField.usedApp == null
              ? true
              : false
          );
          localStorage.setItem("employeremail", data?.data?.login?.user?.email);

          localStorage.setItem(
            "companyname",
            data?.data?.login?.user.userCompanyField.company
          );
        }

        if (!gs) {
          localStorage.setItem(
            "role",
            data?.data?.login?.user.roles.nodes[0].name
          );

          localStorage.setItem("firstName", data?.data?.login?.user?.firstName);

          localStorage.setItem(
            "customer",
            JSON.stringify(data?.data?.login?.customer)
          );
          localStorage.setItem(
            "woo-session",
            data?.data?.login?.customer?.sessionToken
          );
          localStorage.setItem(
            "employeruser",
            data?.data?.login?.customer?.databaseId //NEEDS CHANGING IF EMPLOYEES ADDED
          );
          console.log(data?.data?.login?.customer?.databaseId);
          localStorage.setItem(
            "first-time-user",
            data?.data?.login?.user.userCompanyField.usedApp == null
              ? true
              : false
          );
          localStorage.setItem("employeremail", data?.data?.login?.user?.email);

          localStorage.setItem(
            "companyname",
            data?.data?.login?.user.userCompanyField.company
          );
        }

        localStorage.setItem("avatar", data?.data?.login?.user.avatar.url);

        console.log(data);

        setIncorrectPassword(false);

        // safePush(
        //   "/dashboard" +
        //     "?" +
        //     createQueryString("id", data?.login.user?.id) +
        //     "&" +
        //     createQueryString("cid", data?.login?.customer?.databaseId) +
        //     "&" +
        //     createQueryString("fn", data?.login?.user?.firstName) +
        //     "&" +
        //     createQueryString("email", data?.login?.user?.email)
        // );

        if (!cfh) {
          localStorage.setItem("prevUser", un);
          localStorage.setItem("prevPass", pw);
        }

        if (!gs) {
          localStorage.setItem("prevUser", un);
          localStorage.setItem("prevPass", pw);
        }

        console.log(data?.data?.login?.customer?.databaseId);

        localStorage.setItem(
          "employeruser",
          data?.data?.login?.customer?.databaseId //NEEDS CHANGING IF EMPLOYEES ADDED
        );

        safePush(
          "/dashboard" +
            "?" +
            createQueryString("id", data?.data?.login.user?.id) +
            "&" +
            createQueryString("cid", data?.data?.login?.customer?.databaseId) +
            "&" +
            createQueryString("fn", data?.data?.login?.user?.firstName) +
            "&" +
            createQueryString("email", data?.data?.login?.user?.email) +
            "&" +
            createQueryString("new", jr)
        );
      })
      .catch((error) => {
        console.log(error.message);

        setIncorrectPassword(true);
        setLoginLoading(false);
      });
  };

  if (data) {
    ("use server");
  }

  if (loading) {
    console.log("Loading");
    if (!loginLoading) {
      setLoginLoading(true);
    }
    return (
      <div className="flex min-h-screen bg-ernieteal relative">
        <div className="liquidernie w-24 h-24 mx-auto my-auto relative flex flex-row"></div>
      </div>
    );
  }

  const backAction = () => {
    setForgotPassword(false);
  };

  function isz1orz2(postcode) {
    let z1z2postcodes = [
      "W1",
      "W1C",
      "WC1",
      "WC2",
      "EC1",
      "EC2",
      "EC3",
      "EC4",
      "NW1",
      "NW3",
      "NW5",
      "NW6",
      "NW8",
      "SW1",
      "SW3",
      "SW4",
      "SW5",
      "SW6",
      "SW7",
      "SW8",
      "SW9",
      "SE1",
      "SE4",
      "SE5",
      "SE8",
      "SE10",
      "SE11",
      "SE14",
      "SE15",
      "SE16",
      "SE17",
      "E1",
      "E1W",
      "E2",
      "E3",
      "E5",
      "E8",
      "E9",
      "E14",
      "N1",
      "N4",
      "N5",
      "N7",
      "N16",
      "N19",
      "W2",
      "W6",
      "W8",
      "W9",
      "W10",
      "W11",
      "W12",
      "W14",
      "SE1P",
      "EC50",
      "WC99",
      "E98",
    ];

    let postcodeParts = postcode.split(" ");
    let postcodeStarter = postcodeParts[0];

    let postcodeInDeliveryZone = false;

    for (let i = 0; i < z1z2postcodes.length; i++) {
      console.log(postcodeStarter, " ", z1z2postcodes);

      if (postcodeStarter == z1z2postcodes[i]) {
        postcodeInDeliveryZone = true;
        return postcodeInDeliveryZone;
      }
    }

    return postcodeInDeliveryZone;
  }

  const checkPostcode = (postcode) => {
    if (
      postcode.match(
        /^([A-Z][A-HJ-Y]?[0-9][A-Z0-9]? ?[0-9][A-Z]{2}|GIR ?0A{2})$/gim
      )
    ) {
      setShowPCRegex(false);

      if (isz1orz2(postcode)) {
        setShowPCWarning(false);
      } else {
        setShowPCWarning(true);
      }
    } else {
      setShowPCRegex(true);
      setShowPCWarning(false);
    }
  };

  return (
    <div
      className={`${
        testPlatform == "ios" ? "pt-[59px] pb-[34px] lg:pt-0 lg:pb-0" : ""
      } h-screen bg-ernieteal`}
    >
      {registerComplete && <Alert message={"Register Complete"}></Alert>}
      {registerError != "" && <Alert message={registerError}></Alert>}
      {incorrectPassword && <Alert message={"Incorrect Password"}></Alert>}
      {loginLoading && (
        <div className="flex min-h-screen bg-ernieteal relative">
          <div className="liquidernie w-24 h-24 mx-auto my-auto relative flex flex-row"></div>
        </div>
      )}
      {forgotPassword && (
        <div
          className={`flex flex-col bg-erniecream h-full ${
            forgotPasswordDone && "hidden lg:flex"
          } `}
        >
          <div className="w-screen h-screen flex flex-col bg-erniedarkcream  lg:flex-row">
            <div className="flex flex-col justify-center bg-ernieteal w-full p-4  lg:w-1/2 lg:min-h-screen p-4 lg:order-2 lg:gap-10 lg:bg-erniemint">
              <img src="/Asset-1@2x2.png" className="h-16 object-contain"></img>
              <div className="lg:flex flex-col gap-2 hidden ">
                <div
                  className="py-2 lg:pt-10 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer mx-6 lg:mx-20 lg:max-w-[80%] lg:mx-auto"
                  onClick={backAction}
                >
                  <div className="h-3 w-3 lg:w-4 lg:h-4 relative">
                    <Image
                      src="/left-arrow.svg"
                      fill={true}
                      className="h-6"
                    ></Image>
                  </div>
                  <p className="font-circular font-[500] text-center text-sm text-erniegreen lg:text-base">
                    Back
                  </p>
                </div>
                <div className="p-6 lg:max-w-[80%] lg:mx-auto ">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col flex-grow rounded-lg bg-erniecream p-6 gap-2">
                      <p className="font-circe font-[900] text-xl uppercase">
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
                    <div
                      className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                      onClick={(e) => {
                        setSendingForgotPW(true);

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
                            setSendingForgotPW(false);
                          });
                      }}
                    >
                      {sendingForgotPW && (
                        <svg
                          className={`animate-spin -ml-1 mr-3 h-5 w-5 text-erniegreen `}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      <p className="font-circe text-erniegreen font-[900] text-xl text-center">
                        Reset Password
                      </p>
                    </div>
                    {forgotPasswordDone && (
                      <p className="font-circular text-erniegreen text-center hidden lg:flex">
                        We&apos;ve sent you a password reset email.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-grow lg:w-1/2 lg:order-1 hidden lg:flex">
              <img
                src="/login.jpg"
                className="w-full h-full object-cover object-top lg:object-center"
              ></img>
            </div>
            <div
              className="py-2 lg:pt-10 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer mx-6 lg:mx-10 lg:hidden"
              onClick={backAction}
            >
              <div className="h-3 w-3 lg:w-4 lg:h-4 relative">
                <Image
                  src="/left-arrow.svg"
                  fill={true}
                  className="h-6"
                ></Image>
              </div>
              <p className="font-circular font-[500] text-center text-sm text-erniegreen lg:text-base">
                Back
              </p>
            </div>
            <div className="p-6 lg:p-10 lg:grid lg:grid-cols-2 lg:hidden h-full flex-grow">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col flex-grow rounded-lg bg-erniecream p-6 gap-2">
                  <p className="font-circe font-[900] text-xl uppercase">
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
                <div
                  className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
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
          </div>
        </div>
      )}
      {forgotPasswordDone && (
        <div
          className={`flex ${
            testPlatform == "ios" ? "max-h-ios" : "max-h-[88vh]"
          } flex-col bg-erniecream lg:hidden`}
        >
          <div className="w-screen h-screen flex flex-col bg-erniedarkcream">
            <div className="flex flex-col bg-ernieteal w-full p-4">
              <img src="/Asset-1@2x2.png" className="h-16 object-contain"></img>
            </div>
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
                }}
              >
                Continue to login
              </p>
            </div>
          </div>
        </div>
      )}
      {!loginLoading && !forgotPassword && (
        <div
          className={`flex ${
            testPlatform == "ios"
              ? "max-h-[calc(100vh - 34px - 59px)] lg:max-h-[100vh]"
              : "max-h-[88vh]"
          } flex-col h-full items-center justify-between bg-erniecream ${
            circularstd.variable
          } font-sans ${circerounded.variable} font-sans`}
        >
          {loginType == 0 && (
            <div className="w-screen h-auto flex flex-col lg:flex-row bg-erniecream">
              <div className="flex flex-col justify-center bg-ernieteal w-full lg:w-1/2 lg:min-h-screen p-4 lg:order-2 lg:gap-10">
                <img
                  src="/Asset-1@2x2.png"
                  className="h-16 object-contain"
                ></img>
                <div className="p-6 lg:max-w-[80%] lg:mx-auto lg:flex flex-col gap-4 hidden">
                  <p className="font-circe font-[900] text-bodylg text-erniegreen lg:text-erniecream uppercase  [@media(max-height:708px)]:leading-[1.8rem] [@media(min-height:900px)]:text-bodyxl lg:leading-[48px]">
                    Sustainable Workplace Delivery Services
                  </p>
                  <img src="/divider.png" className="w-full lg:hidden"></img>
                  <img
                    src="/divider_cream.png"
                    className="w-full hidden lg:flex"
                  ></img>
                  <p className="font-circular font-[900] text-erniegreen lg:text-erniecream">
                    Coffee / Hot Chocolate / Tea / Snacks / Drinkware
                  </p>
                  <div
                    className="bg-erniegold p-4 [@media(max-height:708px)]:p-2 rounded-lg cursor-pointer"
                    onClick={() => setLoginType(1)}
                  >
                    <p className="font-circe text-erniegreen font-[900] text-xl uppercase text-center">
                      Create Account
                    </p>
                  </div>
                  <div
                    className="bg-erniegold p-4 [@media(max-height:708px)]:p-2 rounded-lg cursor-pointer"
                    onClick={() => setLoginType(2)}
                  >
                    <p className="font-circe text-erniegreen font-[900] text-xl uppercase text-center">
                      Login
                    </p>
                  </div>
                  <div
                    className="bg-transparent px-2 pb-2  [@media(max-height:708px)]:p-2 rounded-lg cursor-pointer flex flex-row justify-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      loginUser(
                        "coffeefromhome",
                        "CFHErnie123!",
                        false,
                        true,
                        false
                      );
                    }}
                  >
                    <p className="font-circe text-erniecream font-[900] text-lg text-center uppercase">
                      Coffee For Home
                    </p>
                    <p className="font-circe text-erniecream font-[900] uppercase text-xl">
                      {">"}
                    </p>
                  </div>
                  <div
                    className="bg-transparent px-2 pb-2  [@media(max-height:708px)]:p-2 rounded-lg cursor-pointer flex flex-row justify-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      loginUser(
                        "coffeefromhome",
                        "CFHErnie123!",
                        false,
                        true,
                        true
                      );
                    }}
                  >
                    <p className="font-circe text-erniecream font-[900] text-lg text-center uppercase">
                      Groundswell
                    </p>
                    <p className="font-circe text-erniecream font-[900] uppercase text-xl">
                      {">"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-grow lg:w-1/2 lg:order-1">
                <img
                  src="/login.jpg"
                  className="w-full h-full object-cover object-top lg:object-center"
                ></img>
              </div>
              <div className="p-6 flex flex-col gap-4 lg:hidden">
                <p className="font-circe font-[900] text-bodylg text-erniegreen uppercase  [@media(max-height:708px)]:leading-[1.8rem] [@media(min-height:900px)]:text-bodyxl">
                  Sustainable Workplace Delivery Services
                </p>
                <img src="/divider.png" className="w-full"></img>
                <p className="font-circular font-[900] text-erniegreen">
                  Coffee / Hot Chocolate / Tea / Snacks / Drinkware
                </p>
                <div
                  className="bg-erniegold p-4 [@media(max-height:708px)]:p-2 rounded-lg cursor-pointer"
                  onClick={() => setLoginType(1)}
                >
                  <p className="font-circe text-erniegreen font-[900] text-xl uppercase text-center">
                    Create Account
                  </p>
                </div>
                <div
                  className="bg-erniegold p-4 [@media(max-height:708px)]:p-2 rounded-lg cursor-pointer"
                  onClick={() => setLoginType(2)}
                >
                  <p className="font-circe text-erniegreen font-[900] text-xl uppercase text-center">
                    Login
                  </p>
                </div>
                <div
                  className="bg-erniedarkcream px-2 pb-2 pt-3 [@media(max-height:708px)]:p-2 rounded-lg cursor-pointer flex flex-row justify-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    loginUser(
                      "coffeefromhome",
                      "CFHErnie123!",
                      false,
                      true,
                      false
                    );
                  }}
                >
                  <p className="font-circe text-erniegreen font-[900] text-lg text-center uppercase">
                    Coffee For Home
                  </p>
                  <p className="font-circe text-erniegreen font-[900] uppercase text-xl">
                    {">"}
                  </p>
                </div>
                <div
                  className="bg-erniedarkcream px-2 pb-2 pt-3 [@media(max-height:708px)]:p-2 rounded-lg cursor-pointer flex flex-row justify-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    loginUser(
                      "coffeefromhome",
                      "CFHErnie123!",
                      false,
                      true,
                      true
                    );
                  }}
                >
                  <p className="font-circe text-erniegreen font-[900] text-lg text-center uppercase">
                    Groundswell
                  </p>
                  <p className="font-circe text-erniegreen font-[900] uppercase text-xl">
                    {">"}
                  </p>
                </div>
              </div>
            </div>
          )}
          {loginType == 1 && (
            <div className="h-screen w-screen flex flex-col lg:flex-row bg-erniecream">
              <div className="flex flex-col justify-center bg-ernieteal w-full p-4  lg:w-1/2 lg:min-h-screen p-4 lg:order-2 lg:gap-10 lg:bg-erniemint">
                <img
                  src="/Asset-1@2x2.png"
                  className="h-16 object-contain"
                ></img>
                <div className="p-6 lg:max-w-[80%] lg:mx-auto ">
                  <div className="flex-col rounded-lg bg-erniecream p-6 gap-2 p-6 lg:flex flex-col gap-4 hidden">
                    <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                      Create An Account
                    </p>
                    <img src="/divider.png" className="w-full"></img>
                    <div className="grid gap-4">
                      {registerPage == 0 && (
                        <div className="gap-4 grid">
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
                              className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                            ></input>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="poifirstname"
                              className="font-circular text-erniegreen text-sm font-[500]"
                            >
                              Point of Contact First Name *
                            </label>
                            <input
                              type="text"
                              name="poifirstname"
                              onChange={(e) => {
                                setRPFirstName(e.currentTarget.value);
                              }}
                              className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                            ></input>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="address"
                              className="font-circular text-erniegreen text-sm font-[500]"
                            >
                              Delivery Address *
                            </label>
                            <input
                              type="text"
                              name="address"
                              className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                              onChange={(e) => {
                                setRPAddress(e.currentTarget.value);
                              }}
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
                              onChange={(e) => {
                                setPostcode(e.currentTarget.value);
                                checkPostcode(e.currentTarget.value);
                                setRPostcode(e.currentTarget.value);
                              }}
                              className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                            ></input>
                          </div>
                          {showPCRegex ||
                            (showPCWarning && (
                              <div className="flex flex-col gap-2">
                                {showPCRegex && (
                                  <label className="font-circular text-erniegreen text-sm">
                                    Your postcode isn&apos;t valid. Please
                                    format it as follows, SE17 1BA
                                  </label>
                                )}
                                {/* {showPCWarning && (
                                  <label className="font-circular text-erniegreen text-sm">
                                    We only deliver to London Zone 1 &amp; 2,
                                    and you seem to be outside of our delivery
                                    zone. We may still be able to deliver to
                                    you.
                                  </label>
                                )} */}
                              </div>
                            ))}
                        </div>
                      )}
                      {registerPage == 1 && (
                        <div className="grid gap-4">
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
                              onChange={(e) => {
                                setRCNumber(e.currentTarget.value);
                              }}
                              className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                            ></input>
                          </div>
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
                                setREmailAddress(e.currentTarget.value);
                              }}
                              required
                              className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg"
                            ></input>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="password"
                              className="font-circular text-erniegreen text-sm font-[500]"
                            >
                              Password *
                            </label>
                            <input
                              type="password"
                              name="password"
                              required
                              onChange={(e) => {
                                setRPassword(e.currentTarget.value);
                              }}
                              className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg"
                            ></input>
                          </div>
                        </div>
                      )}
                      {registerPage == 2 && (
                        <div className="grid gap-4">
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
                                  className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                                  value={"1-20"}
                                  checked={true}
                                  onChange={(e) => {
                                    setRNoOfStaff(e.currentTarget.value);
                                  }}
                                ></input>
                              </div>
                              <div className="flex flex-row gap-2 relative">
                                <label
                                  htmlFor="nosoptions"
                                  className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                                >
                                  21-50
                                </label>
                                <input
                                  type="radio"
                                  name="nosoptions"
                                  className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                                  value={"21-50"}
                                  onChange={(e) => {
                                    setRNoOfStaff(e.currentTarget.value);
                                  }}
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
                                  className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                                  value={"51-100"}
                                  onChange={(e) => {
                                    setRNoOfStaff(e.currentTarget.value);
                                  }}
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
                                  className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                                  value={"100+"}
                                  onChange={(e) => {
                                    setRNoOfStaff(e.currentTarget.value);
                                  }}
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
                                  className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                                  value={"Yes"}
                                  checked={true}
                                  onChange={(e) => {
                                    setRMachine(e.currentTarget.value);
                                  }}
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
                                  className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                                  value={"No"}
                                  onChange={(e) => {
                                    setRMachine(e.currentTarget.value);
                                  }}
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
                                  className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                                  value={"Yes"}
                                  checked={true}
                                  onChange={(e) => {
                                    setRWFH(e.currentTarget.value);
                                  }}
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
                                  className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                                  value={"No"}
                                  onChange={(e) => {
                                    setRWFH(e.currentTarget.value);
                                  }}
                                ></input>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-row justify-end gap-4">
                        {registerPage != 0 && (
                          <div
                            className="bg-erniegold rounded-lg py-2 px-4 cursor-pointer"
                            onClick={(e) => {
                              setRegisterPage(registerPage - 1);
                            }}
                          >
                            <p className="font-circe text-erniegreen font-[900]">
                              Previous
                            </p>
                          </div>
                        )}
                        {registerPage != 2 && (
                          <div
                            className="bg-erniegold rounded-lg py-2 px-4 cursor-pointer"
                            onClick={(e) => {
                              setRegisterPage(registerPage + 1);
                            }}
                          >
                            <p className="font-circe text-erniegreen font-[900]">
                              Next
                            </p>
                          </div>
                        )}
                        {registerPage == 2 && (
                          <div
                            className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              registerUser(
                                rEmailAddress,
                                rPassword,
                                postcode,
                                rBusinessName
                              );
                            }}
                          >
                            <p className="font-circe text-erniegreen font-[900] text-center">
                              Create Account
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 justify-center">
                      <p className="font-circular font-[500] text-erniegreen text-sm">
                        Already have an account?
                      </p>
                      <p
                        className="font-circular font-[500] text-ernieteal text-sm cursor-pointer"
                        onClick={() => {
                          setLoginType(2);
                        }}
                      >
                        Login here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-grow lg:w-1/2 lg:order-1 hidden lg:flex">
                <img
                  src="/login.jpg"
                  className="w-full h-full object-cover object-top lg:object-center"
                ></img>
              </div>
              <div className="flex-grow p-6 bg-erniemint flex flex-col gap-4  lg:hidden">
                <div className="flex flex-col flex-grow rounded-lg bg-erniecream p-6 gap-2">
                  <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                    Create An Account
                  </p>
                  <img src="/divider.png" className="w-full"></img>
                  <div className="flex flex-col gap-4">
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
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                      ></input>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="poifirstname"
                        className="font-circular text-erniegreen text-sm font-[500]"
                      >
                        Point of Contact First Name *
                      </label>
                      <input
                        type="text"
                        name="poifirstname"
                        onChange={(e) => {
                          setRPFirstName(e.currentTarget.value);
                        }}
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                      ></input>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="address"
                        className="font-circular text-erniegreen text-sm font-[500]"
                      >
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                        onChange={(e) => {
                          setRPAddress(e.currentTarget.value);
                        }}
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
                        onChange={(e) => {
                          setPostcode(e.currentTarget.value);
                          checkPostcode(e.currentTarget.value);
                          setRPostcode(e.currentTarget.value);
                        }}
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                      ></input>
                    </div>
                    {showPCRegex ||
                      (showPCWarning && (
                        <div className="flex flex-col gap-2 hidden">
                          {showPCRegex && (
                            <label className="font-circular text-erniegreen text-sm">
                              Your postcode isn&apos;t valid. Please format it
                              as follows, SE17 1BA
                            </label>
                          )}
                          {/* {showPCWarning && (
                            <label className="font-circular text-erniegreen text-sm">
                              We only deliver to London Zone 1 &amp; 2, and you
                              seem to be outside of our delivery zone. We may
                              still be able to deliver to you.
                            </label>
                          )} */}
                        </div>
                      ))}
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
                        onChange={(e) => {
                          setRCNumber(e.currentTarget.value);
                        }}
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                      ></input>
                    </div>
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
                          setREmailAddress(e.currentTarget.value);
                        }}
                        required
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg"
                      ></input>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="password"
                        className="font-circular text-erniegreen text-sm font-[500]"
                      >
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        required
                        onChange={(e) => {
                          setRPassword(e.currentTarget.value);
                        }}
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg"
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
                            className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                            value={"1-20"}
                            checked={true}
                            onChange={(e) => {
                              setRNoOfStaff(e.currentTarget.value);
                            }}
                          ></input>
                        </div>
                        <div className="flex flex-row gap-2 relative">
                          <label
                            htmlFor="nosoptions"
                            className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                          >
                            21-50
                          </label>
                          <input
                            type="radio"
                            name="nosoptions"
                            className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                            value={"21-50"}
                            onChange={(e) => {
                              setRNoOfStaff(e.currentTarget.value);
                            }}
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
                            className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                            value={"51-100"}
                            onChange={(e) => {
                              setRNoOfStaff(e.currentTarget.value);
                            }}
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
                            className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                            value={"100+"}
                            onChange={(e) => {
                              setRNoOfStaff(e.currentTarget.value);
                            }}
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
                            className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                            value={"Yes"}
                            checked={true}
                            onChange={(e) => {
                              setRMachine(e.currentTarget.value);
                            }}
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
                            className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                            value={"No"}
                            onChange={(e) => {
                              setRMachine(e.currentTarget.value);
                            }}
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
                            className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                            value={"Yes"}
                            checked={true}
                            onChange={(e) => {
                              setRWFH(e.currentTarget.value);
                            }}
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
                            className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10"
                            value={"No"}
                            onChange={(e) => {
                              setRWFH(e.currentTarget.value);
                            }}
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    registerUser(
                      rEmailAddress,
                      rPassword,
                      postcode,
                      rBusinessName
                    );
                  }}
                >
                  <p className="font-circe text-erniegreen font-[900] text-xl text-center">
                    Create Account
                  </p>
                </div>
                <div className="flex flex-row gap-2 justify-center">
                  <p className="font-circular font-[500] text-erniegreen text-sm">
                    Already have an account?
                  </p>
                  <p
                    className="font-circular font-[500] text-erniecream text-sm cursor-pointer"
                    onClick={() => {
                      setLoginType(2);
                    }}
                  >
                    Login here
                  </p>
                </div>
              </div>
            </div>
          )}
          {loginType == 2 && (
            <div className="h-screen w-screen flex flex-col lg:flex-row bg-erniecream">
              <div className="flex-grow lg:w-1/2 lg:order-1 hidden lg:flex lg:order-1">
                <img
                  src="/login.jpg"
                  className="w-full h-full object-cover object-top lg:object-center"
                ></img>
              </div>
              <div className="flex flex-col bg-ernieteal lg:bg-erniemint justify-center w-full p-4 lg:w-1/2 lg:min-h-screen lg:gap-10 lg:order-2">
                <img
                  src="/Asset-1@2x2.png"
                  className="h-16 object-contain"
                ></img>
                <div className="flex-grow lg:flex-none p-6 bg-erniemint lg:flex flex-col gap-4 hidden lg:max-w-[80%] lg:mx-auto">
                  <div className="flex flex-col rounded-lg bg-erniecream p-6 gap-2">
                    <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                      Login
                    </p>
                    <img src="/divider.png" className="w-full"></img>
                    {console.log(prevUser)}
                    {prevUser == null ? (
                      <div className="flex flex-col gap-4">
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
                            onChange={(e) => {
                              setUsername(e.currentTarget.value);
                            }}
                            className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg"
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
                            onChange={(e) => {
                              setPassword(e.currentTarget.value);
                            }}
                            className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg"
                          ></input>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col pt-4">
                        <div className="flex border-[1px] border-erniegreen p-4 rounded-xl flex-row justify-between items-center">
                          <div className="flex flex-col">
                            <p className="font-circular text-erniegreen font-[500] mb-2">
                              Previously logged in as...
                            </p>
                            <p className="font-circe text-erniegreen font-[900] uppercase text-2xl">
                              {localStorage.getItem("firstName")}
                            </p>
                            <p className="font-circular text-erniegreen font-[500] opacity-50">
                              {prevUser.u}
                            </p>
                          </div>
                          <p className="font-circe text-erniegreen font-[900] uppercase text-4xl">
                            {">"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer font-circe text-erniegreen font-[900] text-xl text-center"
                    onClick={(e) => {
                      e.preventDefault();

                      if (prevUser == null) {
                        loginUser(username, password, false, false, false);
                      } else {
                        let pUser = prevUser.u;
                        let pPass = prevUser.p;

                        loginUser(pUser, pPass, false, false, false);

                        localStorage.setItem("prevUser", pUser);
                        localStorage.setItem("prevPass", pPass);
                      }
                    }}
                  >
                    {prevUser == null
                      ? "Login"
                      : `Login as ${localStorage.getItem("firstName")}`}
                  </button>
                  {prevUser != null && (
                    <button
                      className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer font-circe text-erniegreen font-[900] text-xl text-center"
                      onClick={(e) => {
                        localStorage.removeItem("prevUser");
                        localStorage.removeItem("prevPass");
                        setPrevUser(null);
                      }}
                    >
                      Login with a different user
                    </button>
                  )}
                  {/* <button
                  type="button"
                  className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer font-circe text-erniegreen font-[900] text-xl text-center"
                  onClick={(e) => {
                    e.preventDefault();
                    loginUser("apptestlogin", "App1Test2Login3!");
                  }}
                >
                  Test Login (has sub)
                </button>
                <button
                  type="button"
                  className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer font-circe text-erniegreen font-[900] text-xl text-center"
                  onClick={(e) => {
                    e.preventDefault();
                    loginUser("rob@dolcestudio.co", "Yksijavain1!");
                  }}
                >
                  Test Login (no sub)
                </button> */}
                  <p
                    className="font-circular font-[500] text-erniegreen text-sm text-center cursor-pointer"
                    onClick={(e) => {
                      setForgotPassword(true);
                    }}
                  >
                    Forgot password?
                  </p>
                  <div className="flex flex-row gap-2 justify-center">
                    <p className="font-circular font-[500] text-erniegreen text-sm">
                      Don&apos;t have an account?
                    </p>
                    <p
                      className="font-circular font-[500] text-erniecream text-sm cursor-pointer"
                      onClick={() => {
                        setLoginType(1);
                      }}
                    >
                      Register here
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-grow p-6 bg-erniemint flex flex-col gap-4 lg:hidden">
                <div className="flex flex-col rounded-lg bg-erniecream p-6 gap-2">
                  <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                    Login
                  </p>
                  <img src="/divider.png" className="w-full"></img>
                  {console.log(prevUser)}
                  {prevUser == null ? (
                    <div className="flex flex-col gap-4">
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
                          onChange={(e) => {
                            setUsername(e.currentTarget.value);
                          }}
                          className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg"
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
                          onChange={(e) => {
                            setPassword(e.currentTarget.value);
                          }}
                          className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen outline-erniegold outline-[1px] rounded-lg"
                        ></input>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col pt-4">
                      <div className="flex border-[1px] border-erniegreen p-4 rounded-xl flex-row justify-between items-center">
                        <div className="flex flex-col">
                          <p className="font-circular text-erniegreen font-[500] mb-2">
                            Previously logged in as...
                          </p>
                          <p className="font-circe text-erniegreen font-[900] uppercase text-2xl">
                            {localStorage.getItem("firstName")}
                          </p>
                          <p className="font-circular text-erniegreen font-[500] opacity-50">
                            {prevUser.u}
                          </p>
                        </div>
                        <p className="font-circe text-erniegreen font-[900] uppercase text-4xl">
                          {">"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer font-circe text-erniegreen font-[900] text-xl text-center"
                  onClick={(e) => {
                    e.preventDefault();

                    if (prevUser == null) {
                      loginUser(username, password, false, false, false);
                    } else {
                      let pUser = prevUser.u;
                      let pPass = prevUser.p;

                      loginUser(pUser, pPass, false, false, false);

                      localStorage.setItem("prevUser", pUser);
                      localStorage.setItem("prevPass", pPass);
                    }
                  }}
                >
                  {prevUser == null
                    ? "Login"
                    : `Login as ${localStorage.getItem("firstName")}`}
                </button>
                {prevUser != null && (
                  <button
                    className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer font-circe text-erniegreen font-[900] text-xl text-center"
                    onClick={(e) => {
                      localStorage.removeItem("prevUser");
                      localStorage.removeItem("prevPass");
                      setPrevUser(null);
                    }}
                  >
                    Login with a different user
                  </button>
                )}
                {/* <button
                  type="button"
                  className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer font-circe text-erniegreen font-[900] text-xl text-center"
                  onClick={(e) => {
                    e.preventDefault();
                    loginUser("apptestlogin", "App1Test2Login3!");
                  }}
                >
                  Test Login (has sub)
                </button>
                <button
                  type="button"
                  className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer font-circe text-erniegreen font-[900] text-xl text-center"
                  onClick={(e) => {
                    e.preventDefault();
                    loginUser("rob@dolcestudio.co", "Yksijavain1!");
                  }}
                >
                  Test Login (no sub)
                </button> */}
                <p
                  className="font-circular font-[500] text-erniegreen text-sm text-center cursor-pointer"
                  onClick={(e) => {
                    setForgotPassword(true);
                  }}
                >
                  Forgot password?
                </p>
                <div className="flex flex-row gap-2 justify-center">
                  <p className="font-circular font-[500] text-erniegreen text-sm">
                    Don&apos;t have an account?
                  </p>
                  <p
                    className="font-circular font-[500] text-erniecream text-sm cursor-pointer"
                    onClick={() => {
                      setLoginType(1);
                    }}
                  >
                    Register here
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
