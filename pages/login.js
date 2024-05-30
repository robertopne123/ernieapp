import Image from "next/image";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import graphqlClient from "@/apollo-client";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@/components/alert";

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

  const [testingMode, setTestingMode] = useState(true);

  const [loginLoading, setLoginLoading] = useState(false);

  const [loginType, setLoginType] = useState(0);

  const [registerComplete, setRegisterComplete] = useState(false);

  const [postcode, setPostcode] = useState("");
  const [showPCWarning, setShowPCWarning] = useState(false);
  const [showPCRegex, setShowPCRegex] = useState(false);

  const [pushCalled, setPushCalled] = useState(false);

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
            company {
              ... on Client {
                id
                title
                clientInformation {
                  pointOfContactEmail
                }
              }
            }
          }
        }
      }
    }
  `;

  const CREATECLIENT = gql`
    mutation CreateClient(
      $title: String!
      $email: String!
      $postcode: String!
    ) {
      createClient(
        input: { title: $title, email: $email, postcode: $postcode }
      ) {
        client {
          id
          title
          databaseId
          clientInformation {
            deliveryCompanyPostcode
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
    ) {
      createUser(
        input: { username: $username, email: $email, password: $password }
      ) {
        user {
          databaseId
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

  useEffect(() => {
    console.log(loginLoading);
  }, [loginLoading]);

  const registerUser = (email, password, postcode, businessName) => {
    createClient({
      variables: {
        title: businessName,
        email: email,
        postcode: postcode,
      },
    }).then((data) => {
      createUser({
        variables: {
          username: email,
          email: email,
          password: password,
        },
      }).then((data) => {
        setRegisterComplete(true);
      });
    });
  };

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
  if (error) {
    return `Submission error! ${error.message}`;
  }
  if (data) {
    console.log("Login");
    console.log(data);

    localStorage.setItem("authtoken", data?.login?.authToken);
    localStorage.setItem("refreshtoken", data?.login?.refreshToken);
    localStorage.setItem("role", data?.login?.user.roles.nodes[0].name);
    localStorage.setItem("customer", JSON.stringify(data?.login?.customer));
    localStorage.setItem("woo-session", data?.login?.customer?.sessionToken);
    localStorage.setItem(
      "employeruser",
      data?.login?.user.userCompanyField.parentUser
    );
    localStorage.setItem(
      "first-time-user",
      data?.login?.user.userCompanyField.usedApp == null ? true : false
    );
    localStorage.setItem(
      "employeremail",
      data?.login?.user.userCompanyField.company.clientInformation
        .pointOfContactEmail
    );

    localStorage.setItem(
      "companyname",
      data?.login?.user.userCompanyField.company.title
    );

    console.log(data);

    if (!loginLoading) {
      setLoginLoading(false);
    }

    router.push(
      "/dashboard" +
        "?" +
        createQueryString("id", data?.login.user?.id) +
        "&" +
        createQueryString("cid", data?.login?.customer?.databaseId) +
        "&" +
        createQueryString("fn", data?.login?.user?.firstName) +
        "&" +
        createQueryString("email", data?.login?.user?.email)
    );

    setPushCalled(true);
  }

  function isz1orz2(postcode) {
    let z1z2postcodes = [
      "W1",
      "W2",
      "W6",
      "W8",
      "W9",
      "W10",
      "W11",
      "W12",
      "W14",
      "NW1",
      "NW3",
      "NW5",
      "NW6",
      "NW8",
      "WC1",
      "WC2",
      "EC1",
      "EC2",
      "EC3",
      "EC4",
      "SW1",
      "SW4",
      "SW5",
      "SW6",
      "SW7",
      "SW9",
      "SE1",
      "SE4",
      "SE5",
      "SE10",
      "SE11",
      "SE14",
      "SE15",
      "SE16",
      "E1",
      "E2",
      "E3",
      "E8",
      "E9",
      "E14",
      "N1",
      "N4",
      "N5",
      "N7",
      "N15",
      "N19",
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
    <div>
      {registerComplete && <Alert message={"Hi"}></Alert>}
      {loginLoading && (
        <div className="flex min-h-screen bg-ernieteal relative">
          <div className="liquidernie w-24 h-24 mx-auto my-auto relative flex flex-row"></div>
        </div>
      )}
      {!loginLoading && (
        <div
          className={`flex min-h-screen flex-col items-center justify-between bg-erniecream ${circularstd.variable} font-sans ${circerounded.variable} font-sans`}
        >
          <div className="lg:flex hidden text-erniegreen px-4">
            <p>Please use a mobile phone to view this page</p>
          </div>
          {loginType == 0 && (
            <div className="w-screen h-screen flex flex-col bg-erniecream">
              <div className="flex flex-col bg-ernieteal w-full p-4">
                <img
                  src="/Asset-1@2x2.png"
                  className="h-16 object-contain"
                ></img>
              </div>
              <div className="flex-grow">
                <img
                  src="/login.jpg"
                  className="w-full h-full object-cover object-top"
                ></img>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <p className="font-circe font-[900] text-5xl text-erniegreen uppercase leading-[50px]">
                  Sustainable Workplace Delivery Services
                </p>
                <img src="/divider.png" className="w-full"></img>
                <p className="font-circular font-[900] text-erniegreen">
                  Coffee / Hot Chocolate / Tea / Snacks / Drinkware
                </p>
                <div
                  className="bg-erniegold p-4 rounded-lg cursor-pointer"
                  onClick={() => setLoginType(1)}
                >
                  <p className="font-circe text-erniegreen font-[900] text-xl uppercase text-center">
                    Create Account
                  </p>
                </div>
                <div
                  className="bg-erniegold p-4 rounded-lg cursor-pointer"
                  onClick={() => setLoginType(2)}
                >
                  <p className="font-circe text-erniegreen font-[900] text-xl uppercase text-center">
                    Login
                  </p>
                </div>
              </div>
            </div>
          )}
          {loginType == 1 && (
            <div className="h-screen w-screen flex flex-col bg-erniecream">
              <div className="flex flex-col bg-ernieteal w-full p-4">
                <img
                  src="/Asset-1@2x2.png"
                  className="h-20 object-contain"
                ></img>
              </div>
              <div className="flex-grow p-6 bg-erniemint flex flex-col gap-4">
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
                        Point of Contact First Time *
                      </label>
                      <input
                        type="text"
                        name="poifirstname"
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
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
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
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
                        }}
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
                      ></input>
                    </div>
                    <div className="flex flex-col gap-2">
                      {showPCRegex && (
                        <label className="font-circular text-erniegreen text-sm">
                          Your postcode isn&apos;t valid. Please format it as
                          follows, SE17 1BA
                        </label>
                      )}
                      {showPCWarning && (
                        <label className="font-circular text-erniegreen text-sm">
                          We only deliver to London Zone 1 &amp; 2, and you seem
                          to be outside of our delivery zone. We may still be
                          able to deliver to you.
                        </label>
                      )}
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
                        onChange={(e) => {}}
                        className="bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] border-erniegreen rounded-lg outline-erniegold outline-[1px]"
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
                        onChange={(e) => {
                          setREmailAddress(e.currentTarget.value);
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
                  <p className="font-circular font-[500] text-erniecream text-sm">
                    Login here
                  </p>
                </div>
              </div>
            </div>
          )}
          {loginType == 2 && (
            <div className="h-screen w-screen flex flex-col bg-erniecream">
              <div className="flex flex-col bg-ernieteal w-full p-4">
                <img
                  src="/Asset-1@2x2.png"
                  className="h-20 object-contain"
                ></img>
              </div>
              <div className="flex-grow p-6 bg-erniemint flex flex-col gap-4">
                <div className="flex flex-col rounded-lg bg-erniecream p-6 gap-2">
                  <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                    Login
                  </p>
                  <img src="/divider.png" className="w-full"></img>
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
                </div>
                <div
                  className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    if (localStorage.getItem("authtoken") != null) {
                      localStorage.removeItem("authtoken");
                    }
                    login({
                      variables: { password: password, username: username },
                    });
                  }}
                >
                  <p className="font-circe text-erniegreen font-[900] text-xl text-center">
                    Login
                  </p>
                </div>
                <div
                  className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    if (localStorage.getItem("authtoken") != null) {
                      localStorage.removeItem("authtoken");
                    }
                    login({
                      variables: {
                        password: "App1Test2Login3!",
                        username: "apptestlogin",
                      },
                    });
                  }}
                >
                  <p className="font-circe text-erniegreen font-[900] text-xl text-center">
                    Test Login
                  </p>
                </div>
                <p className="font-circular font-[500] text-erniegreen text-sm text-center">
                  Forgot password?
                </p>
                <div className="flex flex-row gap-2 justify-center">
                  <p className="font-circular font-[500] text-erniegreen text-sm">
                    Don&apos;t have an account?
                  </p>
                  <p className="font-circular font-[500] text-erniecream text-sm">
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
