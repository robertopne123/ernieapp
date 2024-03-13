import Image from "next/image";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import graphqlClient from "@/apollo-client";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

  const [testingMode, setTestingMode] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);

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

  const [login, { data, loading, error }] = useMutation(LOGIN, {
    client: client,
  });

  if (loading) {
    console.log("Loading");
    if (!loginLoading) {
      setLoginLoading(true);
    }
    return (
      <div className="flex min-h-screen bg-erniecream">
        <div className="bg-erniedarkcream w-24 h-24 mx-auto my-auto ernieloading flex flex-row before:content-[''] before:w-[100%] before:h-24 before:bg-ernieteal"></div>
      </div>
    );
  }
  if (error) {
    return `Submission error! ${error.message}`;
  }
  if (data) {
    if (loginLoading) {
      setLoginLoading(false);
    }
    console.log("Login");
    console.log(data);

    localStorage.setItem("authtoken", data?.login?.authToken);
    localStorage.setItem("role", data?.login?.user.roles.nodes[0].name);
    localStorage.setItem("customer", JSON.stringify(data?.login?.customer));
    localStorage.setItem("woo-session", data?.login?.customer?.sessionToken);
    localStorage.setItem(
      "employeruser",
      data?.login?.user.userCompanyField.parentUser
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
  }

  return (
    <div>
      {loginLoading && (
        <div className="flex min-h-screen bg-erniecream">
          <div className="bg-erniedarkcream w-24 h-24 mx-auto my-auto ernieloading flex flex-row before:content-[''] before:w-[100%] before:h-24 before:bg-ernieteal"></div>
        </div>
      )}
      {!loginLoading && (
        <div
          className={`flex min-h-screen flex-col items-center justify-between bg-erniecream ${circularstd.variable} font-sans ${circerounded.variable} font-sans`}
        >
          <div className="lg:flex hidden text-erniegreen px-4">
            <p>Please use a mobile phone to view this page</p>
          </div>
          <div className="lg:hidden flex flex-col text-erniegreen relative w-full h-screen">
            <div className="bg-loginscreen h-[45%] w-full bg-cover bg-[bottom_center] p-4 flex flex-col justify-end gap-4"></div>
            <div className="flex flex-col gap-8 px-8 pb-[66px] flex-grow justify-end">
              <p className="font-circe text-erniegreen font-[900] uppercase text-center text-3xl">
                Login to continue
              </p>
              <form
                name="loginform"
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log(username);
                  console.log(password);
                  if (localStorage.getItem("authtoken") != null) {
                    localStorage.removeItem("authtoken");
                  }
                  login({
                    variables: { password: password, username: username },
                  });
                }}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="emailaddress"
                    className="font-circular text-erniegreen text-lg font-[500]"
                  >
                    Email Address
                  </label>
                  <input
                    type="text"
                    name="emailaddress"
                    onChange={(e) => {
                      setUsername(e.currentTarget.value);
                    }}
                    className="bg-ernieteal h-12 font-circular font-[500] px-4 text-erniecream outline-none"
                  ></input>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="font-circular text-erniegreen text-lg font-[500]"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={(e) => {
                      setPassword(e.currentTarget.value);
                    }}
                    className="bg-ernieteal h-12 font-circular font-[500] px-4 text-erniecream outline-none"
                  ></input>
                </div>
                <button
                  type="submit"
                  className="bg-erniegold h-12 w-full font-circe font-[900] uppercase text-2xl pt-1"
                >
                  Login
                </button>
              </form>
              {testingMode && (
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
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
                    className="bg-erniegold h-12 w-full font-circe font-[900] uppercase text-xl pt-1"
                  >
                    Quick Login (ADMIN)
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      if (localStorage.getItem("authtoken") != null) {
                        localStorage.removeItem("authtoken");
                      }
                      login({
                        variables: {
                          password: "Yksijavain1!",
                          username: "quirk.studio_test",
                        },
                      });
                    }}
                    className="bg-erniegold h-12 w-full font-circe font-[900] uppercase text-xl pt-1"
                  >
                    Quick Login (EMPLOYEE)
                  </button>
                </div>
              )}
              <p className="text-center font-circular font-[500] text-lg">
                Don&apos;t have an account?{" "}
                <span className="text-ernieteal cursor-pointer">
                  Enquire now
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
