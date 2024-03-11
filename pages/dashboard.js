import Image from "next/image";
import { Inter, Oi } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import Products from "@/components/products";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";
import createApolloClient from "@/apollo-client";
import GET_CATEGORIES from "../components/queries/products/GET_CATEGORIES";
import graphqlClient from "@/apollo-client";
import Impact from "@/components/impact";
import ErnieImpact from "@/components/summarySections/ernieimpact";
import Summary from "@/components/summary";
import Accounts from "@/components/accounts";
import { motion } from "framer-motion";
import Alert from "@/components/alert";
import cloneDeep from "lodash.clonedeep";

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

export default function Dashboard({ data, categories, products, orders }) {
  const searchParams = useSearchParams();

  const fn = searchParams.get("fn");
  const customerId = searchParams.get("cid");
  const email = searchParams.get("email");

  const [activeTab, setTab] = useState(0);

  const [dataObject, setData] = useState(null);
  const [cartObject, setCart] = useState(null);

  const [employees, setEmployees] = useState(null);

  const [role, setRole] = useState(0); //ADMIN - 0, EMPLOYEE - 1

  const [customer, setCustomer] = useState(null);

  const [sessionToken, setSessionToken] = useState(null);

  const [cName, setCompanyName] = useState("");

  const [employerEmail, setEmployerEmail] = useState("");

  const [employerUserID, setEmployerUserID] = useState(0);

  const [companyID, setCompanyID] = useState(0);

  const [impactCertificateURL, setImpactCertificateURL] = useState("");

  const loadData = (cid, code, employer) => {
    const client = graphqlClient;

    let token = localStorage.getItem("refresh");
    let role = localStorage.getItem("role");
    let customerData = JSON.parse(localStorage.getItem("customer"));
    let wooSession = localStorage.getItem("woo-session");
    let companyName = localStorage.getItem("companyname");
    let employerEmail = localStorage.getItem("employeremail");
    let employerUser = localStorage.getItem("employeruser");

    setCustomer(customerData);
    setSessionToken(wooSession);

    setCompanyName(companyName);

    setEmployerEmail(employerEmail);

    setEmployerUserID(employerUser);

    console.log(customer);

    switch (role) {
      case "company_admin":
        setRole(0);
        break;
      case "company_employee":
        setRole(1);
        break;
    }

    let tempDataObject = null;

    client
      .query({
        query: gql`
          query MyQuery2($email: String, $company: String, $employerUser: Int) {
            productTags {
              nodes {
                name
                tagCategoryImages {
                  displayOrder
                  tagImage {
                    sourceUrl
                  }
                }
              }
            }
            customer(customerId: $employerUser) {
              subscriptions {
                nextPaymentDate
              }
            }
            products(first: 100) {
              nodes {
                id
                databaseId
                image {
                  sourceUrl
                }
                description(format: RAW)
                name
                ... on SimpleProduct {
                  id
                  name
                  price
                  chocolateBarsExtraInfo {
                    calories
                    dietType
                    ingredients
                    type
                  }
                  coffeeExtraInfo {
                    flavours
                    origin
                    roast
                    type
                    varietal
                  }
                  hotChocolateExtraInfo {
                    dietType
                    ingredients
                    origin
                    type
                  }
                  productDisplayStyle {
                    badgeImage {
                      sourceUrl
                    }
                    bgImage {
                      sourceUrl
                    }
                    secondaryImage {
                      sourceUrl
                    }
                    titleStyle
                  }
                  productTags {
                    nodes {
                      name
                      tagCategoryImages {
                        displayOrder
                        tagImage {
                          sourceUrl
                        }
                      }
                    }
                  }
                }
              }
            }
            clients(where: { title: $company }) {
              nodes {
                databaseId
                title
                clientInformation {
                  activeState
                  coffeeMachineOnSite
                  coffeePoints
                  companyRegistrationNumber
                  deliveryCompanyAddress
                  deliveryCompanyPostcode
                  deliveryFrequency
                  fieldGroupName
                  howDidYouHearAboutUs
                  impactCertificate {
                    sourceUrl
                  }
                  invoicingContactEmail
                  invoicingContactFirstName
                  invoicingContactLastName
                  invoicingContactNumber
                  invoicingContactRole
                  numberOfStaff
                  otherComments
                  pointOfContactEmail
                  pointOfContactFirstName
                  pointOfContactLastName
                  pointOfContactNumber
                  pointOfContactRole
                  regCompanyAddress
                  registeredCompanyPostcode
                  show
                  startDate
                  subscriptionId
                  subsidy
                  workFromHomeDays
                }
                impactFigures {
                  bags
                  carbon
                  coffee
                  m25
                  phones
                  trees
                }
              }
            }
            orders(first: 10000, where: { customerId: $employerUser }) {
              nodes {
                id
                lineItems {
                  nodes {
                    quantity
                    product {
                      node {
                        name
                        terms {
                          nodes {
                            ... on ProductTag {
                              id
                              name
                            }
                          }
                        }
                      }
                    }
                  }
                }
                customer {
                  databaseId
                  email
                }
                date
                orderNumber
                status
              }
            }
            coupons(where: { code: $email }) {
              nodes {
                code
                amount
                discountType
                usageLimitPerUser
                usageCount
                id
              }
            }
            employeeLists(where: { name: $email }) {
              nodes {
                employeeListFields {
                  companyEmail
                  employeeEmail
                  employeeName
                }
              }
            }
          }
        `,
        variables: {
          email: code,
          employerEmail: employer,
          company: companyName,
          employerEmailID: employer,
          employerUser: parseInt(employerUserID),
        },
      })
      .then((data) => {
        setData(data);
        console.log(data);
        tempDataObject = data;

        setCompanyID(data.data.clients.nodes[0].databaseId);

        console.log(data.data.clients.nodes[0].databaseId);

        // for (let i = 0; i < data.data.orders.nodes.length; i++) {
        //   // console.log(data.data.orders.nodes[i]);
        //   for (
        //     let j = 0;
        //     j < data.data.orders.nodes[i].subscriptions.length;
        //     j++
        //   ) {
        //     console.log(
        //       data.data.orders.nodes[i].subscription[j].nextPaymentDate
        //     );
        //   }
        // }

        client
          .mutate({
            mutation: gql`
              mutation GetPDF($dataset: ID!, $templateId: ID!) {
                getPDF(input: { dataset: $dataset, templateId: $templateId }) {
                  url
                }
              }
            `,
            variables: {
              dataset: data.data.clients.nodes[0].databaseId,
              templateId: 2,
            },
          })
          .then((data) => {
            console.log(data);

            setImpactCertificateURL(data.data.getPDF.url);
          });
      });

    client
      .query({
        query: gql`
          query GetCart {
            cart {
              contents {
                itemCount
                nodes {
                  product {
                    node {
                      name
                      sku
                      databaseId
                      ... on SimpleProduct {
                        price
                      }
                      terms {
                        nodes {
                          name
                        }
                      }
                    }
                  }
                  quantity
                }
              }
              subtotal
              total
              shippingTotal
              appliedCoupons {
                code
              }
            }
          }
        `,
      })
      .then((data) => {
        console.log(data);
        setCart([]);
        //setCart(data);

        let couponExists = false;

        console.log(tempDataObject);

        for (let i = 0; i < data.data.cart.appliedCoupons?.length; i++) {
          if (
            data.data.cart.appliedCoupons[i].code !=
            tempDataObject.data.coupons.nodes[0].code
          ) {
            client
              .mutate({
                mutation: gql`
                  mutation ApplySubsidy($subsidycode: String!) {
                    applyCoupon(input: { code: $subsidycode }) {
                      cart {
                        contents {
                          itemCount
                          nodes {
                            product {
                              node {
                                name
                                sku
                                databaseId
                                ... on SimpleProduct {
                                  price
                                }
                                terms {
                                  nodes {
                                    name
                                  }
                                }
                              }
                            }
                            quantity
                          }
                        }
                        subtotal
                        total
                        shippingTotal
                        appliedCoupons {
                          code
                        }
                      }
                    }
                  }
                `,
                variables: {
                  subsidycode: data.data.coupons.nodes[0].code,
                },
              })
              .then((data) => {
                console.log("COUPON CART");
                console.log(data);
              });
          }
        }
      });
  };

  useEffect(() => {
    loadData(customerId, email, employerEmail);
  }, []);

  useEffect(() => {
    if (dataObject != null) {
      let eNameObjs = Object.values(
        JSON?.parse(
          dataObject.data.employeeLists.nodes[0]?.employeeListFields
            .employeeName
        )
      );

      console.log(eNameObjs);

      let eEmailObjs = Object.values(
        JSON?.parse(
          dataObject.data.employeeLists.nodes[0]?.employeeListFields
            .employeeEmail
        )
      );

      let employeeObjs = [];

      for (let i = 0; i < eNameObjs.length; i++) {
        let eObj;

        eObj = {
          name: eNameObjs[i],
          email: eEmailObjs[i],
        };

        console.log(eObj);

        employeeObjs.push(eObj);
      }

      console.log(employeeObjs);

      setEmployees(employeeObjs);
    }
  }, [dataObject]);

  const getUserNumberOrders = () => {
    let total = 0;

    for (let i = 0; i < dataObject?.data.orders.nodes.length; i++) {
      console.log(dataObject?.data.orders.nodes[i].status);
      total++;
    }

    return total;
  };

  const getUserTotalOrderQty = () => {
    let total = 0;

    for (let i = 0; i < dataObject?.data.orders.nodes.length; i++) {
      for (
        let j = 0;
        j < dataObject?.data.orders.nodes[i].lineItems.nodes.length;
        j++
      ) {
        total += dataObject?.data.orders.nodes[i].lineItems.nodes[j].quantity;
      }
    }

    return total;
  };

  const getTotalOrderQty = () => {
    let total = 0;

    for (let i = 0; i < dataObject?.data.orders.nodes.length; i++) {
      for (
        let j = 0;
        j < dataObject?.data.orders.nodes[i].lineItems.nodes.length;
        j++
      ) {
        total += dataObject?.data.orders.nodes[i].lineItems.nodes[j].quantity;
      }
    }

    return total;
  };

  const getLoggedInUserOrders = (orders) => {
    let userOrders = [];

    for (let i = 0; i < orders.length; i++) {
      if (orders[i].customer?.email == email) {
        userOrders.push(orders[i]);
      }
    }

    return userOrders;
  };

  const getSubscriptionPaymentDate = () => {
    let date;

    for (let i = 0; i < dataObject?.data.customer.subscriptions.length; i++) {
      if (dataObject?.data.customer.subscriptions[i].nextPaymentDate != null) {
        date = dataObject?.data.customer.subscriptions[i].nextPaymentDate;
      }
    }

    let removedTime = date.split(" ")[0];
    let dateParts = removedTime.split("-");
    let ddmmyyyy = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];

    return ddmmyyyy;
  };

  const tabs = [
    { name: "Home", index: 0, icon: "/home.svg" },
    { name: "Products", index: 1, icon: "/mug-hot-alt.svg" },
    { name: "Impact", index: 2, icon: "/world.svg" },
    { name: "Account", index: 4, icon: "/circle-user.svg" },
  ];

  const restrictedtabs = [
    { name: "Home", index: 0, icon: "/home.svg" },
    { name: "Order", index: 1, icon: "/box-circle-check.svg" },
    { name: "Impact", index: 2, icon: "/world.svg" },
    { name: "Account", index: 4, icon: "/circle-user.svg" },
  ];

  const goToTab = (tabID) => setTab(tabID);

  const [impactDefaultTab, setImpactDefaultTab] = useState(0);

  const [basket, setBasket] = useState([]);

  const addToBasket = (item) => {
    let tempBasket = basket;

    tempBasket.push(item);

    setBasket(tempBasket);
  };

  const [subsidyValue, setSubsidyValue] = useState(0);
  const [subsidyType, setSubsidyType] = useState(0);
  const [subsidyChanged, setSubsidyChanged] = useState(false);

  const saveChanges = (val, type) => {
    const client = graphqlClient;

    console.log(type);

    client
      .mutate({
        mutation: gql`
          mutation changeSubsidy(
            $id: ID!
            $amount: Float
            $discountType: DiscountTypeEnum
          ) {
            updateCoupon(
              input: { id: $id, amount: $amount, discountType: $discountType }
            ) {
              coupon {
                amount
                discountType
              }
            }
          }
        `,
        variables: {
          id: dataObject?.data.coupons.nodes[0].id,
          amount: val,
          discountType: type == "FIXED_CART" ? "FIXED_CART" : "PERCENT",
        },
      })
      .then((data) => {
        console.log(data.data.updateCoupon.coupon.amount);

        let tempDataObject = cloneDeep(dataObject);

        tempDataObject.data.coupons.nodes[0].amount =
          data.data.updateCoupon.coupon.amount;
        tempDataObject.data.coupons.nodes[0].discountType =
          data.data.updateCoupon.coupon.discountType;

        setData(tempDataObject);
      });
  };

  return (
    <main
      className={`flex max-h-screen flex-col items-center justify-between bg-erniecream ${circularstd.variable} font-sans ${circerounded.variable} font-sans`}
    >
      <div className="lg:flex hidden text-erniegreen px-4">
        <p>Please use a mobile phone to view this page</p>
      </div>
      {dataObject != null && (
        <div className="lg:hidden flex flex-col text-erniegreen relative w-full h-screen">
          <div className="h-[88vh] w-full">
            {activeTab == 0 && (
              <Summary
                quantity={getTotalOrderQty()}
                userQuantity={getUserNumberOrders()}
                userTotalQuantity={getUserTotalOrderQty()}
                firstName={fn}
                setTab={setTab}
                setImpactDefaultTab={setImpactDefaultTab}
                role={role}
                companyName={cName}
              />
            )}
            {activeTab == 1 && (
              <Products
                productCategories={dataObject.data.productTags.nodes}
                products={dataObject.data.products.nodes}
                subsidy={dataObject.data.coupons.nodes[0]}
                customer={customer}
                role={role}
                setBasket={setBasket}
                basket={basket}
                sessionToken={sessionToken}
                cart={cartObject}
                employerUser={employerUserID}
              />
            )}
            {activeTab == 2 && (
              <Impact
                userQuantity={getUserNumberOrders()}
                userTotalQuantity={getUserTotalOrderQty()}
                quantity={getTotalOrderQty()}
                defaultTab={impactDefaultTab}
                role={role}
                impactCertificateURL={impactCertificateURL}
                // companyName={company}
              />
            )}
            {activeTab == 4 && (
              <Accounts
                userQuantity={getUserTotalOrderQty()}
                orders={getLoggedInUserOrders(dataObject.data.orders.nodes)}
                subsidy={dataObject.data.coupons.nodes[0]?.amount}
                subsidyType={dataObject.data.coupons.nodes[0]?.discountType}
                usageLimit={dataObject.data.coupons.nodes[0]?.usageLimitPerUser}
                nextDelivery={getSubscriptionPaymentDate()}
                employees={employees}
                saveChanges={saveChanges}
              />
            )}
          </div>
          <div className="bg-ernieteal h-[12vh] w-screen grid grid-cols-4 justify-between items-center">
            {role == 0 &&
              tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`flex-grow h-full flex flex-col gap-2 justify-center ${
                    tab.index == activeTab ? "bg-erniemint" : ""
                  } `}
                  onClick={(e) => {
                    setTab(tab.index);
                    console.log(tab.index, activeTab);
                  }}
                >
                  <div className="w-8 h-8 mx-auto relative">
                    <Image src={tab.icon} fill={true}></Image>
                  </div>
                  <p className="text-erniecream text-sm text-center">
                    {tab.name}
                  </p>
                </div>
              ))}
            {role == 1 &&
              restrictedtabs.map((tab, index) => (
                <div
                  key={index}
                  className={`flex-grow h-full flex flex-col gap-2 justify-center ${
                    tab.index == activeTab ? "bg-erniemint" : ""
                  } `}
                  onClick={(e) => {
                    setTab(tab.index);
                  }}
                >
                  <div className="w-8 h-8 mx-auto relative">
                    <Image src={tab.icon} fill={true}></Image>
                  </div>
                  <p className="text-erniecream text-sm text-center">
                    {tab.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
      {dataObject == null && (
        <div className="lg:hidden flex flex-col gap-6 justify-center text-erniegreen relative w-full h-screen">
          <motion.svg
            width="80"
            height="80"
            className="w-[100px] h-[100px] mx-auto"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_i_304_3)">
              <motion.path
                d="M79.5204 40.6C78.9204 40 78.9204 40 78.4204 39.4C77.8204 38.8 77.6204 39 77.0204 38.5C76.4204 37.9 76.6204 37.8 76.0204 37.2C75.4204 36.6 75.2204 36.8 74.7204 36.2C74.1204 35.6 74.2204 35.5 73.7204 34.9C73.3204 34.5 72.8204 34.3 72.4204 34.3C72.0204 34.3 71.3204 34.4 70.9204 34.7C70.3204 35.3 70.5204 35.5 69.9204 36C69.3204 36.6 69.1204 36.4 68.5204 36.9C67.9204 37.5 68.4204 37.9 67.8204 38.5C67.2204 39.1 67.2204 39.1 66.6204 39.6C66.0204 40.2 65.9204 40 65.3204 40.6H65.5204C65.5204 40.9 65.1204 40.8 65.1204 41.1C65.1204 41.7 65.5204 42.3 65.4204 42.8C65.3204 43.4 65.2204 43.9 65.1204 44.5C65.0204 45 64.6204 45.5 64.5204 46.1C64.4204 46.6 64.1204 47.1 63.9204 47.7C63.7204 48.2 63.8204 48.8 63.6204 49.4C63.4204 49.9 62.7204 50.2 62.5204 50.7C62.3204 51.2 62.1204 51.7 61.8204 52.2C61.5204 52.7 61.3204 53.2 61.0204 53.6C60.7204 54.1 60.4204 54.5 60.1204 55C59.8204 55.4 59.6204 56 59.2204 56.4C58.8204 56.8 58.3204 57.1 57.9204 57.5C57.5204 57.9 57.1204 58.2 56.7204 58.6C56.3204 59 55.8204 59.2 55.4204 59.5C55.0204 59.8 54.5204 60.1 54.1204 60.4C53.7204 60.7 53.4204 61.2 52.9204 61.5C52.4204 61.8 51.9204 61.9 51.4204 62.1C50.9204 62.3 50.5204 62.7 50.0204 62.9C49.5204 63.1 49.0204 63.3 48.5204 63.5C48.0204 63.7 47.6204 64.1 47.1204 64.2C46.6204 64.3 46.1204 64.6 45.6204 64.7C45.1204 64.8 44.5204 64.9 44.0204 64.9C43.5204 65 42.9204 65.1 42.4204 65.2C41.9204 65.2 41.3204 65 40.8204 65C40.3204 65 39.7204 65.1 39.2204 65.1C38.7204 65.1 38.1204 65.3 37.6204 65.2C37.1204 65.2 36.6204 64.6 36.1204 64.5C35.6204 64.4 35.0204 64.4 34.5204 64.3C34.0204 64.2 33.5204 63.9 33.0204 63.7C32.5204 63.6 31.9204 63.7 31.4204 63.5C30.9204 63.3 30.5204 62.8 30.0204 62.6C29.5204 62.4 28.8204 62.7 28.3204 62.5C27.8204 62.3 27.5204 61.8 27.0204 61.5C26.5204 61.2 26.1204 60.9 25.7204 60.6C25.3204 60.3 24.6204 60.3 24.2204 59.9C23.8204 59.6 23.4204 59.1 23.0204 58.8C22.6204 58.5 22.1204 58.1 21.8204 57.8C21.4204 57.4 21.2204 56.9 20.9204 56.5C20.5204 56.1 20.2204 55.7 19.9204 55.2C19.6204 54.8 19.3204 54.4 19.0204 53.9C18.7204 53.5 18.2204 53.2 17.9204 52.7C17.6204 52.2 17.6204 51.6 17.3204 51.2C17.1204 50.7 16.6204 50.3 16.4204 49.8C16.2204 49.3 16.3204 48.7 16.1204 48.2C15.9204 47.7 15.6204 47.2 15.5204 46.7C15.4204 46.2 15.1204 45.7 15.0204 45.2C14.9204 44.7 15.0204 44.1 14.9204 43.6C14.8204 43.1 15.1204 42.5 15.0204 42C15.0204 41.5 14.7204 41 14.7204 40.4C14.7204 39.9 14.8204 39.3 14.8204 38.8C14.8204 38.3 14.7204 37.7 14.7204 37.2C14.7204 36.7 15.1204 36.2 15.2204 35.7C15.3204 35.2 15.1204 34.6 15.2204 34.1C15.3204 33.6 15.4204 33.1 15.6204 32.5C15.7204 32 16.0204 31.5 16.2204 31C16.4204 30.5 16.6204 30 16.8204 29.5C17.0204 29 17.2204 28.5 17.4204 28C17.6204 27.5 18.0204 27.1 18.3204 26.7C18.6204 26.2 18.5204 25.6 18.8204 25.1C19.1204 24.7 19.5204 24.3 19.8204 23.9C20.1204 23.5 20.6204 23.2 20.9204 22.8C21.3204 22.4 21.5204 21.9 21.9204 21.6C22.3204 21.2 22.6204 20.8 23.0204 20.4C23.4204 20 24.0204 19.9 24.5204 19.6C24.9204 19.3 25.2204 18.8 25.7204 18.5C26.2204 18.2 26.6204 17.9 27.1204 17.6C27.6204 17.3 28.1204 17 28.5204 16.8C29.0204 16.6 29.4204 16.2 29.9204 16C30.4204 15.8 31.1204 16.1 31.6204 15.9C32.1204 15.7 32.5204 15.1 33.0204 15C33.5204 14.9 34.1204 14.8 34.6204 14.7C35.1204 14.6 35.7204 14.4 36.2204 14.3C36.7204 14.2 37.3204 14.2 37.8204 14.2C38.3204 14.2 38.9204 14.5 39.5204 14.5C40.0204 14.5 40.6204 14 41.1204 14C41.6204 14 42.2204 14.1 42.7204 14.2C43.2204 14.3 43.7204 14.6 44.3204 14.7C44.8204 14.8 45.3204 15.1 45.8204 15.3C46.3204 15.4 46.9204 15.3 47.4204 15.5C47.9204 15.7 48.4204 16.1 48.9204 16.2C49.4204 16.4 50.1204 16.2 50.6204 16.4C51.1204 16.6 51.7204 17.2 52.2204 17.5C51.9204 18.2 51.4204 18 50.8204 18.5C50.2204 19.1 50.0204 18.9 49.4204 19.4C48.8204 20 48.9204 20 48.3204 20.6C47.7204 21.2 47.7204 21.2 47.2204 21.8C46.6204 22.4 46.6204 22.3 46.0204 22.9C45.4204 23.5 45.7204 23.7 45.1204 24.3C44.5204 24.9 44.5204 24.9 44.0204 25.5C43.4204 26.1 43.4204 26 42.8204 26.6C42.2204 27.2 42.0204 27 41.4204 27.5C40.8204 28.1 41.0204 28.3 40.5204 28.9C39.9204 29.5 39.8204 29.4 39.2204 29.9C38.6204 30.5 38.7204 30.6 38.2204 31.2C37.6204 31.8 37.4204 31.5 36.8204 32.1C36.2204 32.7 36.4204 32.9 35.9204 33.5C35.3204 34.1 35.1204 33.9 34.5204 34.5C34.1204 34.9 33.7204 35.3 33.4204 35.8C33.1204 36.3 32.9204 36.8 32.7204 37.3C32.5204 37.8 32.5204 38.4 32.4204 38.9C32.3204 39.4 32.3204 40 32.4204 40.5C32.5204 41 32.8204 41.5 32.9204 42C33.1204 42.5 33.3204 43 33.6204 43.4C33.9204 43.8 34.1204 44.4 34.5204 44.7C34.9204 45.1 35.5204 45.2 35.9204 45.4C36.4204 45.7 36.7204 46.3 37.2204 46.4C37.7204 46.6 38.3204 46.6 38.8204 46.7C39.3204 46.8 39.9204 46.9 40.4204 46.9C40.9204 46.8 41.4204 46.4 41.9204 46.2C42.4204 46 43.0204 46 43.5204 45.8C43.9204 45.5 44.3204 45.1 44.7204 44.7C45.3204 44.1 45.3204 44.2 45.9204 43.6C46.5204 43 46.2204 42.7 46.7204 42.1C47.3204 41.5 47.3204 41.6 47.9204 41C48.5204 40.4 48.4204 40.4 49.0204 39.8C49.6204 39.2 49.8204 39.4 50.3204 38.8C50.9204 38.2 50.8204 38.2 51.4204 37.6C52.0204 37 52.2204 37.2 52.8204 36.7C53.4204 36.1 53.4204 36.2 54.0204 35.6C54.6204 35 54.4204 34.9 55.0204 34.3C55.6204 33.7 55.7204 33.8 56.3204 33.3C56.9204 32.7 56.9204 32.7 57.5204 32.2C58.1204 31.6 57.8204 31.3 58.3204 30.7C58.9204 30.1 59.0204 30.3 59.6204 29.7C60.2204 29.1 60.1204 29 60.7204 28.5C61.3204 27.9 61.5204 28.2 62.1204 27.6C62.7204 27 62.7204 27 63.2204 26.4C63.8204 25.8 63.5204 25.6 64.1204 25C64.7204 24.4 64.7204 24.4 65.2204 23.8C65.8204 23.2 66.1204 23.5 66.7204 23C67.3204 22.4 66.9204 22 67.5204 21.4C67.9204 21 68.6204 20.7 68.9204 20.2C69.2204 19.7 69.7204 19.2 69.9204 18.6C70.1204 18 70.1204 17.3 70.1204 16.7C70.1204 16.1 69.8204 15.4 69.6204 14.9C69.4204 14.3 69.0204 13.9 68.7204 13.3C68.4204 12.8 68.0204 12.3 67.6204 11.9C67.2204 11.5 67.2204 10.8 66.8204 10.4C66.4204 10 65.9204 9.8 65.5204 9.5C65.1204 9.2 64.7204 8.8 64.3204 8.5C63.9204 8.2 63.6204 7.7 63.1204 7.4C62.7204 7.1 62.3204 6.7 61.8204 6.4C61.4204 6.1 60.8204 6 60.4204 5.7C59.9204 5.4 59.3204 5.5 58.8204 5.3C58.3204 5 58.1204 4.3 57.6204 4.1C57.1204 3.9 56.5204 3.9 56.0204 3.7C55.5204 3.5 54.9204 3.6 54.4204 3.4C53.9204 3.2 53.6204 2.5 53.1204 2.4C52.7204 2 52.1204 2 51.6204 1.9C51.1204 1.7 50.7204 1.3 50.1204 1.2C49.6204 1 49.1204 1 48.6204 0.9C48.1204 0.8 47.5204 0.9 47.0204 0.8C46.5204 0.7 46.0204 0.6 45.4204 0.6C44.9204 0.5 44.4204 0.3 43.8204 0.3C43.3204 0.2 42.8204 0 42.2204 0C41.7204 0 41.1204 0 40.6204 0C40.1204 0 39.5204 0.3 39.0204 0.3C38.5204 0.3 37.9204 0.3 37.4204 0.4C36.9204 0.4 36.3204 0.2 35.8204 0.3C35.3204 0.4 34.7204 0.4 34.2204 0.5C33.7204 0.6 33.2204 1 32.7204 1.1C32.2204 1.2 31.6204 1 31.1204 1.1C30.6204 1.2 30.1204 1.4 29.6204 1.5C29.1204 1.6 28.6204 2 28.1204 2.2C27.6204 2.4 27.1204 2.4 26.6204 2.6C26.1204 2.8 25.6204 3.1 25.2204 3.3C24.7204 3.5 24.2204 3.6 23.7204 3.8C23.1204 3.8 22.6204 4 22.1204 4.3C21.6204 4.5 21.2204 4.9 20.8204 5.2C20.3204 5.5 19.8204 5.6 19.4204 5.9C18.9204 6.2 18.3204 6.2 17.9204 6.5C17.5204 6.8 17.1204 7.2 16.6204 7.5C16.2204 7.8 15.9204 8.3 15.5204 8.7C15.1204 9 14.7204 9.3 14.3204 9.7C13.9204 10 13.3204 10.2 12.9204 10.6C12.5204 11 12.0204 11.2 11.6204 11.6C11.2204 12 11.2204 12.7 10.8204 13C10.4204 13.4 10.1204 13.8 9.72036 14.2C9.42036 14.6 8.92041 14.9 8.52041 15.3C8.22041 15.7 7.92041 16.2 7.62041 16.6C7.32041 17 6.82041 17.3 6.52041 17.8C6.22041 18.2 6.22041 18.9 5.92041 19.3C5.62041 19.8 5.32041 20.2 5.12041 20.7C4.82041 21.2 4.32041 21.5 4.02041 21.9C3.82041 22.4 3.82041 23 3.62041 23.5C3.42041 24 3.42041 24.6 3.22041 25.1C3.02041 25.6 2.82041 26.1 2.62041 26.6C2.42041 27.1 2.22041 27.6 2.12041 28.1C1.92041 28.6 1.72041 29.1 1.62041 29.6C1.52041 30.1 0.920411 30.5 0.820411 31C0.720411 31.5 0.920411 32.1 0.820411 32.6C0.720411 33.1 0.620411 33.6 0.620411 34.2C0.520411 34.7 0.320411 35.2 0.320411 35.8C0.220411 36.3 0.320411 36.9 0.320411 37.4C0.320411 37.9 0.120411 38.5 0.020408 39C0.020408 39.5 0.220411 40.1 0.220411 40.6C0.220411 41.1 -0.079592 41.7 0.020408 42.2C0.020408 42.7 0.320411 43.2 0.420411 43.8C0.520411 44.3 0.520411 44.9 0.620411 45.4C0.720411 45.9 0.820411 46.5 0.920411 47C1.02041 47.5 0.920411 48.1 1.02041 48.6C1.12041 49.1 1.52041 49.6 1.62041 50.1C1.72041 50.6 2.22041 51 2.42041 51.5C2.62041 52 2.22041 52.7 2.42041 53.2C2.62041 53.7 3.22041 54 3.42041 54.5C3.62041 55 3.52041 55.6 3.72041 56.1C3.92041 56.6 4.32041 57 4.52041 57.5C4.72041 58 5.12041 58.4 5.42041 58.8C5.72041 59.3 5.92041 59.8 6.12041 60.2C6.42041 60.7 6.42041 61.3 6.72041 61.7C7.02041 62.1 7.42041 62.5 7.72041 62.9C8.02041 63.3 8.22041 63.8 8.52041 64.3C8.82041 64.7 9.52036 64.9 9.82036 65.3C10.1204 65.7 10.1204 66.4 10.5204 66.8C10.9204 67.2 11.4204 67.4 11.8204 67.8L12.0204 67.6C12.4204 68 12.7204 68.4 13.1204 68.8C13.5204 69.2 13.7204 69.8 14.1204 70.2C14.5204 70.6 15.0204 70.8 15.5204 71.1C15.9204 71.4 16.4204 71.7 16.9204 72C17.3204 72.3 17.7204 72.8 18.1204 73.1C18.6204 73.4 19.1204 73.6 19.5204 73.9C20.0204 74.2 20.6204 74.2 21.1204 74.5C21.6204 74.8 22.0204 75.1 22.5204 75.3C23.0204 75.5 23.5204 75.7 24.0204 75.9C24.5204 76.1 24.8204 76.8 25.3204 77C25.8204 77.2 26.4204 77 27.0204 77.2C27.5204 77.4 27.9204 77.9 28.5204 78C29.0204 78.2 29.7204 77.7 30.2204 77.8C30.7204 77.9 31.2204 78.2 31.7204 78.4C32.2204 78.5 32.7204 78.9 33.3204 79C33.8204 79.1 34.4204 79 35.0204 79C35.5204 79.1 36.1204 78.9 36.6204 79C37.1204 79 37.7204 79.2 38.2204 79.2C38.7204 79.2 39.3204 79.6 39.8204 79.6C40.3204 79.6 40.9204 79.1 41.4204 79C41.9204 79 42.5204 79 43.0204 79C43.5204 79 44.1204 78.8 44.6204 78.7C45.1204 78.6 45.7204 79 46.3204 78.9C46.8204 78.8 47.3204 78.2 47.8204 78.1C48.3204 78 48.9204 78.2 49.5204 78C50.0204 77.9 50.6204 77.8 51.1204 77.7C51.6204 77.5 52.2204 77.5 52.7204 77.4C53.2204 77.2 53.6204 76.8 54.2204 76.6C54.7204 76.4 55.2204 76.3 55.7204 76C56.2204 75.8 56.7204 75.6 57.2204 75.3C57.7204 75.1 58.1204 74.7 58.6204 74.4C59.1204 74.1 59.6204 73.9 60.0204 73.6C60.5204 73.3 61.0204 73.1 61.4204 72.8C61.9204 72.5 62.2204 72.1 62.7204 71.8C63.1204 71.5 63.5204 71.1 64.0204 70.8C64.4204 70.5 64.9204 70.2 65.3204 69.8C65.7204 69.4 66.0204 69 66.4204 68.6C66.8204 68.2 67.2204 67.9 67.6204 67.5C68.0204 67.1 68.5204 66.9 68.9204 66.5C69.3204 66.1 69.4204 65.5 69.7204 65.1C70.0204 64.7 70.7204 64.6 71.1204 64.1C71.4204 63.7 71.6204 63.1 71.9204 62.7C72.2204 62.3 72.5204 61.8 72.8204 61.4C73.1204 61 73.1204 60.3 73.3204 59.9C73.6204 59.4 74.4204 59.3 74.6204 58.8C74.9204 58.3 74.7204 57.6 74.9204 57.1C75.1204 56.6 75.8204 56.3 76.0204 55.9C76.2204 55.4 76.2204 54.8 76.4204 54.3C76.6204 53.8 76.7204 53.3 76.9204 52.8C77.1204 52.3 77.5204 51.9 77.7204 51.4C77.9204 50.9 77.8204 50.3 78.0204 49.8C78.1204 49.3 78.2204 48.8 78.3204 48.2C78.4204 47.7 78.9204 47.2 79.0204 46.7C79.1204 46.2 78.6204 45.6 78.7204 45C78.8204 44.5 78.9204 44 79.0204 43.4C79.1204 42.9 79.4204 42.4 79.4204 41.8C79.4204 41.7 79.1204 41.5 79.1204 41.4C79.1204 41 79.3204 41 79.3204 40.7C79.4204 40.8 79.5204 40.7 79.5204 40.6Z"
                fill="#E4E4C4"
                initial={{
                  opacity: 1,
                  pathLength: 0,
                }}
                animate={{
                  opacity: 1,
                  pathLength: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
              />
            </g>
            <defs>
              <filter
                id="filter0_i_304_3"
                x="0"
                y="0"
                width="79.5204"
                height="79.6"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="2" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.570785 0 0 0 0 0.570785 0 0 0 0 0.464998 0 0 0 1 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_304_3"
                />
              </filter>
            </defs>
          </motion.svg>

          <Image
            src="/loading.svg"
            alt="Ernie Loading Text"
            width={150}
            height={23}
            className="mx-auto"
          />
        </div>
      )}
    </main>
  );
}
