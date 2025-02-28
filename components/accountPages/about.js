import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import graphqlClient from "../../apollo-client";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Browser } from "@capacitor/browser";

export default function About({ backAction }) {
  const router = useRouter();

  const [userID, setUserID] = useState(-1);
  const [deletionComplete, setDeletionComplete] = useState(false);

  const logout = () => {
    router.push("/login");
  };

  const deleteUser = () => {
    deleteCurrentUser({
      variables: { id: userID },
    })
      .catch((error) => {
        console.log(error);

        setDeletionComplete(false);
      })
      .then((data) => {
        setDeletionComplete(true);
      });
  };

  const client = graphqlClient;

  const DELETEUSER = gql`
    mutation DeleteUser($id: ID!) {
      deleteUser(input: { id: $id }) {
        deletedId
      }
    }
  `;

  const [deleteCurrentUser, { rpdata, rploading, rperror }] = useMutation(
    DELETEUSER,
    {
      client: client,
    }
  );

  useEffect(() => {
    setUserID(localStorage.getItem("employeruser"));
  }, []);

  const openCapacitorSite = async (link) => {
    await Browser.open({ url: link });
  };

  return (
    <div className="flex flex-col flex-grow gap-6 h-full bg-erniedarkcream px-6 lg:px-10 pb-6 overflow-scroll">
      {deletionComplete && (
        <div className="flex min-h-screen flex-col bg-erniecream">
          <div className="w-full h-screen flex flex-col bg-erniedarkcream">
            <div className="p-6">
              <p className="font-circular text-erniegreen text-center">
                Your account has been deleted.
              </p>
            </div>
            <div className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer mx-6">
              <p
                className="font-circe text-erniegreen font-[900] text-xl text-center"
                style={{ fontFamily: "var(--font-circerounded)" }}
                onClick={(e) => {
                  logout();
                }}
              >
                Continue to login
              </p>
            </div>
          </div>
        </div>
      )}
      {!deletionComplete && (
        <div>
          <div
            className="py-2 lg:pt-10 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer"
            onClick={backAction}
          >
            <div className="h-3 w-3 relative">
              <Image src="/left-arrow.svg" fill={true} className="h-6"></Image>
            </div>
            <p className="font-circular font-[500] text-center text-sm text-erniegreen">
              Back
            </p>
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 flex-grow mt-4 lg:mt-10">
            <div className="flex flex-col gap-6">
              <div className="rounded-xl bg-erniecream p-6">
                <p className="font-circe font-[900] text-xl text-erniegreen uppercase">
                  About
                </p>
                <img src="/divider.png" className="w-full"></img>
                <p className="font-circular text-sm text-erniegreen font-[500] mt-4">
                  Welcome to the Ernie London App
                </p>
                <p className="font-circular text-sm text-erniegreen font-[400] mt-2">
                  We deliver locally roasted, specialty coffee and office pantry
                  goodies via cargo bikes with zero reusable, recyclable
                  packaging exclusively in London.
                </p>
                <p className="font-circular text-sm text-erniegreen font-[500] mt-2">
                  Contact us:{" "}
                  <a
                    className="text-ernieteal"
                    href="mailto:hello@ernie.london"
                  >
                    hello@ernie.london
                  </a>
                </p>
                <p className="font-circular text-sm text-erniegreen italic mt-2">
                  <span className="font-[500]">App Version: </span>
                  {process.env.NEXT_PUBLIC_APP_VERSION}
                </p>
                <p className="font-circular text-sm text-erniegreen italic">
                  <span className="font-[500]">Build Number: </span>
                  {process.env.NEXT_PUBLIC_BUILD_NUMBER}
                </p>
                <p className="font-circular text-sm text-erniegreen font-[500] mt-2">
                  © 2024 Ernie London Ltd
                </p>
              </div>
              <div
                className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => {
                  logout();
                }}
              >
                <p className="font-circe text-erniegreen font-[900] text-xl text-center">
                  Log Out
                </p>
              </div>
              <div
                className="bg-erniegold px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => {
                  deleteUser();
                }}
              >
                <p className="font-circe text-erniegreen font-[900] text-xl text-center">
                  Delete Account
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="rounded-xl bg-erniecream p-6 flex flex-row gap-6">
                <img
                  src="/dolcelogo.png"
                  className="w-16 h-16 flex-grow rounded-lg aspect-square"
                ></img>
                <p className="font-circular text-erniegreen font-[500] text-sm">
                  The Ernie App is powered by 100% renewable energy, from sun,
                  wind and water power. Designed, developed and maintained by{" "}
                  <span
                    className="text-ernieteal"
                    onClick={(e) => {
                      openCapacitorSite("https://dolcestudio.co");
                    }}
                  >
                    Dolce Studio.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
