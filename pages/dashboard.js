import Image from "next/image";
import { Inter, Oi } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";
import Products from "@/components/products";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";
import createApolloClient from "@/apollo-client";
import graphqlClient from "@/apollo-client";
import Impact from "@/components/impact";
import ErnieImpact from "@/components/homeComponents/ernieimpact";
import Home from "@/components/home";
import Accounts from "@/components/accounts";
import { motion } from "framer-motion";
import Alert from "@/components/alert";
import cloneDeep from "lodash.clonedeep";
import { Capacitor } from "@capacitor/core";
import { Tutorial } from "@/components/tutorial";
import { StaticTopBar } from "@/components/dashboardComponents/statictopbar";

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

  const [subscriptions, setSubscriptions] = useState([]);

  const [firstTimeUser, setFirstTimeUser] = useState(false);

  const [orderData, setOrders] = useState([]);

  const [hasSubscription, setHasSubscription] = useState(false);

  const [purchaseType, setPurchaseType] = useState(-1); //0 - ONE OFF, 1 - SUB

  const [purchasing, setPurchasing] = useState(false);

  const [newPurchase, setNewPurchase] = useState(false);

  const loadData = (cid, code, employer) => {
    const client = graphqlClient;

    let token = localStorage.getItem("refresh");
    let role = localStorage.getItem("role");
    let customerData = {};

    if (localStorage.getItem("customer") != undefined) {
      customerData = JSON?.parse(
        localStorage.getItem("customer") ? localStorage.getItem("customer") : {}
      );
    }

    let wooSession = localStorage.getItem("woo-session");
    let companyName = localStorage?.getItem("companyname");

    let eEmail = localStorage.getItem("employeremail");
    let ftu = localStorage.getItem("first-time-user");

    console.log(localStorage.getItem("employeremail"));
    let employerUser = localStorage.getItem("employeruser");

    setCustomer(customerData);
    setSessionToken(wooSession);

    setCompanyName(companyName);

    setEmployerEmail(eEmail);

    setEmployerUserID(employerUser);

    setFirstTimeUser(ftu);

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

    console.log(companyName);

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
                  brands {
                    nodes {
                      name
                      description
                      brandingImage {
                        image {
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
                createdVia
                lineItems {
                  nodes {
                    quantity
                    product {
                      node {
                        name
                        databaseId
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

        setOrders(data.data.orders.nodes);

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

        console.log(employerUser);

        client
          .mutate({
            mutation: gql`
              mutation GetSubscription($employerUser: ID!) {
                subscription(input: { id: $employerUser }) {
                  subscription {
                    databaseId
                    lineItems {
                      nodes {
                        databaseId
                        quantity
                        product {
                          node {
                            name
                            description(format: RAW)
                            databaseId
                            featuredImage {
                              node {
                                sourceUrl
                              }
                            }
                          }
                        }
                      }
                    }
                    billingPeriod
                    billingInterval
                    nextPaymentDate
                  }
                }
              }
            `,
            variables: {
              employerUser: employerUser,
            },
          })
          .then((data) => {
            setSubscriptions(data);

            console.log(data);

            if (data?.data?.subscription?.subscription != null) {
              setHasSubscription(true);
            }
          })
          .catch((error) => {
            console.log(error);

            setHasSubscription(false);
          });

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
    if (role == 0) {
      loadData(customerId, email, employerEmail);
    } else {
      loadData(customerId, employerEmail, employerEmail);
    }
  }, []);

  useEffect(() => {
    if (dataObject != null) {
      let eNameObjs = dataObject.data.employeeLists.nodes[0]?.employeeListFields
        .employeeEmail
        ? Object.values(
            JSON.parse(
              dataObject.data.employeeLists.nodes[0]?.employeeListFields
                .employeeName
            )
          )
        : "";

      console.log(eNameObjs);

      let eEmailObjs = dataObject.data.employeeLists.nodes[0]
        ?.employeeListFields.employeeEmail
        ? Object.values(
            JSON.parse(
              dataObject.data.employeeLists.nodes[0]?.employeeListFields
                .employeeEmail
            )
          )
        : "";

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

    let ddmmyyyy = "N/A";

    if (date) {
      let removedTime = date.split(" ")[0];
      let dateParts = removedTime.split("-");

      ddmmyyyy = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];
    }

    return ddmmyyyy;
  };

  const tabs = [
    { name: "Home", index: 0, icon: "/home.png" },
    { name: "Products", index: 1, icon: "/tea.png" },
    { name: "Impact", index: 2, icon: "/impact.png" },
    { name: "Account", index: 4, icon: "/account.png" },
  ];

  const restrictedtabs = [
    { name: "Home", index: 0, icon: "/home.svg" },
    { name: "Order", index: 1, icon: "/box-circle-check.svg" },
    { name: "Impact", index: 2, icon: "/world.svg" },
    { name: "Account", index: 4, icon: "/circle-user.svg" },
  ];

  const [testPlatform, setTestPlatform] = useState("");

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
  const [subsidyChanging, setSubsidyChanging] = useState(false);

  const [updateSubError, setUpdateSubError] = useState("");

  const updatePlanFrequency = (planDetails) => {
    const client = graphqlClient;

    client
      .mutate({
        mutation: gql`
          mutation MyMutation(
            $billingInterval: String!
            $billingPeriod: String!
            $id: ID!
          ) {
            changeSubscriptionFrequency(
              input: {
                billingInterval: $billingInterval
                billingPeriod: $billingPeriod
                id: $id
              }
            ) {
              subscription {
                databaseId
                lineItems {
                  nodes {
                    databaseId
                    quantity
                    product {
                      node {
                        name
                        description(format: RAW)
                        databaseId
                        featuredImage {
                          node {
                            sourceUrl
                          }
                        }
                      }
                    }
                  }
                }
                billingPeriod
                billingInterval
                nextPaymentDate
              }
            }
          }
        `,
        variables: {
          billingInterval: planDetails.billingInterval,
          billingPeriod: planDetails.billingPeriod,
          id: planDetails.databaseId,
        },
      })
      .then((data) => {
        let dataCopy = data.data.changeSubscriptionFrequency;

        let dataNew = { data: { subscription: dataCopy } };

        setSubscriptions(dataNew);
        console.log(dataNew);
      })
      .catch((error) => {
        setUpdateSubError(error);
      });
  };

  const updatePlan = (planDetails) => {
    let existingSubscriptionProducts = [
      ...subscriptions.data.subscription.subscription.lineItems.nodes,
    ];

    console.log(planDetails);
    console.log(existingSubscriptionProducts);

    let finalDetails = [...planDetails];

    //COMPARISON - FIRST SCAN
    let changes = [];

    let foundProduct = false;

    for (let i = 0; i < planDetails.length; i++) {
      foundProduct = false;
      for (let j = 0; j < existingSubscriptionProducts.length; j++) {
        if (
          planDetails[i].product.node.name ==
          existingSubscriptionProducts[j].product.node.name
        ) {
          console.log(
            "Comparing ",
            planDetails[i].product.node.name,
            " - ",
            existingSubscriptionProducts[j].product.node.name
          );
          foundProduct = true;
          if (
            planDetails[i].quantity != existingSubscriptionProducts[j].quantity
          ) {
            if (
              planDetails[i].quantity > existingSubscriptionProducts[j].quantity
            ) {
              changes.push({
                action: "qty",
                difference:
                  planDetails[i].quantity -
                  existingSubscriptionProducts[j].quantity,
                product: planDetails[i],
              });
            } else if (
              planDetails[i].quantity < existingSubscriptionProducts[j].quantity
            ) {
              changes.push({
                action: "qty",
                difference:
                  existingSubscriptionProducts[j].quantity -
                  planDetails[i].quantity,
                product: planDetails[i],
              });
            }
          }
        }
      }

      if (!foundProduct) {
        changes.push({
          action: "add",
          product: planDetails[i],
          difference: planDetails[i].quantity,
        });
      }
    }

    console.log(existingSubscriptionProducts);

    for (let i = 0; i < existingSubscriptionProducts.length; i++) {
      foundProduct = false;
      for (let j = 0; j < planDetails.length; j++) {
        if (
          existingSubscriptionProducts[i].product.node.name ==
          planDetails[j].product.node.name
        ) {
          console.log(
            "Comparing ",
            existingSubscriptionProducts[j].product.node.name,
            " - ",
            planDetails[i].product.node.name
          );
          foundProduct = true;
        }
      }

      if (!foundProduct) {
        changes.push({
          action: "remove",
          product: existingSubscriptionProducts[i],
        });
      }
    }

    console.log(changes);

    const client = graphqlClient;

    for (let i = 0; i < changes.length; i++) {
      if (changes[i].action == "add") {
        console.log();

        client
          .mutate({
            mutation: gql`
              mutation MyMutation2(
                $id: ID!
                $productId: ID!
                $productQuantity: Int!
              ) {
                addProductToSubscription(
                  input: {
                    id: $id
                    productId: $productId
                    productQuantity: $productQuantity
                  }
                ) {
                  subscription {
                    databaseId
                    lineItems {
                      nodes {
                        quantity
                        product {
                          node {
                            name
                            description
                            databaseId
                          }
                        }
                        databaseId
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              id: subscriptions.data.subscription.subscription.databaseId,
              productId: changes[i].product.product.node.databaseId + "",
              productQuantity: changes[i].difference,
            },
          })
          .then((data) => {
            setSubscriptions(data);
          })
          .catch((error) => {
            setUpdateSubError(error);
          });
      } else if (changes[i].action == "remove") {
        client
          .mutate({
            mutation: gql`
              mutation MyMutation2($id: ID!, $productId: ID!) {
                removeProductFromSubscription(
                  input: { id: $id, productId: $productId }
                ) {
                  subscription {
                    databaseId
                    lineItems {
                      nodes {
                        quantity
                        product {
                          node {
                            name
                            description
                            databaseId
                          }
                        }
                        databaseId
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              id: subscriptions.data.subscription.subscription.databaseId,
              productId: changes[i].product.product.node.databaseId + "",
            },
          })
          .catch((error) => {
            setUpdateSubError(error);
          });
      } else if (changes[i].action == "qty") {
        client
          .mutate({
            mutation: gql`
              mutation MyMutation2($id: ID!, $productId: ID!) {
                removeProductFromSubscription(
                  input: { id: $id, productId: $productId }
                ) {
                  subscription {
                    databaseId
                    lineItems {
                      nodes {
                        quantity
                        product {
                          node {
                            name
                            description
                            databaseId
                          }
                        }
                        databaseId
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              id: subscriptions.data.subscription.subscription.databaseId,
              productId: changes[i].product.product.node.databaseId + "",
            },
          })
          .then((data) => {
            console.log("Old QTY Removed");

            client
              .mutate({
                mutation: gql`
                  mutation MyMutation2(
                    $id: ID!
                    $productId: ID!
                    $productQuantity: Int!
                  ) {
                    addProductToSubscription(
                      input: {
                        id: $id
                        productId: $productId
                        productQuantity: $productQuantity
                      }
                    ) {
                      subscription {
                        databaseId
                        lineItems {
                          nodes {
                            quantity
                            product {
                              node {
                                name
                                databaseId
                                description
                              }
                            }
                            databaseId
                          }
                        }
                      }
                    }
                  }
                `,
                variables: {
                  id: subscriptions.data.subscription.subscription.databaseId,
                  productId: changes[i].product.product.node.databaseId + "",
                  productQuantity: changes[i].difference,
                },
              })
              .then((data) => {
                console.log("New QTY Added");
              });
          })
          .catch((error) => {
            setUpdateSubError(error.message + "");
          });
      }
    }
  };

  const updateOrder = (orderDetails) => {
    const client = graphqlClient;

    console.log(orderDetails.lineItems);

    for (let i = 0; i < orderDetails.lineItems.nodes.length; i++) {
      let productExists = false;

      for (
        let j = 0;
        j < dataObject.data.orders.nodes[0].lineItems.nodes.length;
        j++
      ) {
        if (
          orderDetails.lineItems.nodes[i].product.node.databaseId ==
          dataObject.data.orders.nodes[0].lineItems.nodes[j].product.node
            .databaseId
        ) {
          productExists = true;
        }
      }

      if (!productExists) {
        client
          .mutate({
            mutation: gql`
              mutation updateOrder(
                $orderId: Int!
                $productId: Int!
                $quantity: Int!
              ) {
                updateOrder(
                  input: {
                    orderId: $orderId
                    lineItems: { quantity: $quantity, productId: $productId }
                  }
                ) {
                  order {
                    id
                    lineItems {
                      nodes {
                        quantity
                        product {
                          node {
                            name
                            databaseId
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
              }
            `,
            variables: {
              orderId: parseInt(orderDetails.orderNumber),
              productId:
                orderDetails.lineItems.nodes[i].product.node.databaseId,
              quantity: orderDetails.lineItems.nodes[i].quantity,
            },
          })
          .then((data) => {
            console.log(data);

            // setOrders(data);
            let ordersCopy = [...orderData];

            for (let i = 0; i < ordersCopy.length; i++) {
              if (ordersCopy[i].orderNumber == orderDetails.orderNumber) {
                console.log(ordersCopy[i]);
                console.log(orderDetails);
                ordersCopy[i] = orderDetails;
              }
            }

            setOrders(ordersCopy);
          });
      }
    }
  };

  const saveChanges = (val, type) => {
    const client = graphqlClient;

    setSubsidyChanging(true);

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

        setSubsidyChanging(false);
      });
  };

  console.log(employerUserID);

  const completeTutorial = () => {
    setFirstTimeUser(false);
  };

  //Basket Functions

  const [subBasket, setSubBasket] = useState([]);
  const [oneOffBasket, setOneOffBasket] = useState([]);

  const addToSubBasket = (item) => {
    let subBasketCopy = [...subBasket];

    subBasketCopy.push(item);

    setSubBasket(subBasketCopy);
  };

  const addToOneOffBasket = (item) => {
    let oneOffBasketCopy = [...oneOffBasket];

    oneOffBasketCopy.push(item);

    setOneOffBasket(oneOffBasketCopy);
  };

  const clearOneOffBasket = () => {
    setOneOffBasket([]);
  };

  const clearSubBasket = () => {
    setSubBasket([]);
  };

  const updateSubBasket = (basketCopy) => {
    setSubBasket(basketCopy);
  };

  const updateOneOffBasket = (basketCopy) => {
    setOneOffBasket(basketCopy);
  };

  const [newSubFreq, setNewSubFreq] = useState("WEEKLY");

  const setNewSubFrequency = (freq) => {
    setNewSubFreq(freq);
  };

  const setPType = (type) => {
    setTab(1);
    setPurchasing(true);
    setPurchaseType(type);
    setNewPurchase(true);
  };

  return (
    <div>
      {dataObject != null && (
        <main
          className={`flex max-h-screen h-screen ${
            testPlatform == "ios" ? "pt-[59px] pb-[34px]" : ""
          } flex-col items-center justify-between bg-ernieteal ${
            circularstd.variable
          } font-sans ${circerounded.variable} font-sans`}
        >
          {/* {firstTimeUser && <Tutorial completeTutorial={completeTutorial} />} */}
          <div className="lg:flex hidden text-erniegreen px-4">
            <p>Please use a mobile phone to view this page</p>
          </div>
          <div className="lg:hidden flex flex-col text-erniegreen relative w-full flex-grow">
            <StaticTopBar
              addToSubBasket={addToSubBasket}
              addToOneOffBasket={addToOneOffBasket}
              updateSubBasket={updateSubBasket}
              updateOneOffBasket={updateOneOffBasket}
              clearSubBasket={clearSubBasket}
              clearOneOffBasket={clearOneOffBasket}
              setNewSubFrequency={setNewSubFrequency}
              newSubFreq={newSubFreq}
              subBasket={subBasket}
              oneOffBasket={oneOffBasket}
              purchaseType={purchaseType}
              hasSubscription={hasSubscription}
              customerId={employerUserID}
              setSubscriptions={setSubscriptions}
            />
            <div
              className={`${
                testPlatform == "ios" ? "max-h-ios" : "max-h-[88vh]"
              } h-auto flex-grow w-full`}
            >
              {activeTab == 0 && (
                <Home
                  quantity={getTotalOrderQty()}
                  userQuantity={getUserNumberOrders()}
                  userTotalQuantity={getUserTotalOrderQty()}
                  setTab={setTab}
                  setImpactDefaultTab={setImpactDefaultTab}
                  nextDelivery={getSubscriptionPaymentDate()}
                  role={role}
                  companyName={cName}
                  products={dataObject.data.products.nodes}
                  orders={orderData}
                  subscriptions={subscriptions}
                  updateOrder={updateOrder}
                  updateSubError={updateSubError}
                  updatePlan={updatePlan}
                  updatePlanFrequency={updatePlanFrequency}
                  employerUser={employerUserID}
                  hasSubscription={hasSubscription}
                  setPurchaseType={setPType}
                  purchaseType={purchaseType}
                  newPurchase={newPurchase}
                  setNewPurchase={setNewPurchase}
                  purchasing={purchasing}
                  setPurchasing={setPurchasing}
                  firstName={fn}
                />
              )}
              {activeTab == 1 && (
                <Products
                  productCategories={dataObject.data.productTags.nodes}
                  products={dataObject.data.products.nodes}
                  subsidy={
                    role == 0
                      ? dataObject.data.coupons.nodes[0]
                      : dataObject.data.clients.nodes[0].clientInformation
                          .subsidy
                  }
                  customer={customer}
                  role={role}
                  setBasket={setBasket}
                  basket={basket}
                  sessionToken={sessionToken}
                  cart={cartObject}
                  employerUser={employerUserID}
                  addToSubBasket={addToSubBasket}
                  addToOneOffBasket={addToOneOffBasket}
                  subBasket={subBasket}
                  oneOffBasket={oneOffBasket}
                  purchaseType={purchaseType}
                  purchasing={purchasing}
                  newPurchase={newPurchase}
                  setPurchaseType={setPurchaseType}
                  setPurchasing={setPurchasing}
                  setNewPurchase={setNewPurchase}
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
                  subsidy={dataObject.data.coupons.nodes[0]}
                  subsidyType={dataObject.data.coupons.nodes[0]?.discountType}
                  usageLimit={
                    dataObject.data.coupons.nodes[0]?.usageLimitPerUser
                  }
                  nextDelivery={getSubscriptionPaymentDate()}
                  employees={employees}
                  saveChanges={saveChanges}
                  subsidyChanging={subsidyChanging}
                  role={role}
                />
              )}
            </div>
            <div
              className={`bg-ernieteal w-screen grid grid-cols-4 justify-between items-center h-[12vh] min-h-[12vh] absolute bottom-0
            `}
            >
              {role == 0 &&
                tabs.map((tab, index) => (
                  <div
                    key={index}
                    className={`flex-grow h-full flex flex-col gap-2 justify-center ${
                      tab.index == activeTab ? "bg-erniemint" : ""
                    } `}
                    onClick={(e) => {
                      setTab(tab.index);
                      setNewPurchase(false);
                      console.log(tab.index, activeTab);
                    }}
                  >
                    <div className="w-8 h-8 mx-auto relative">
                      <Image src={tab.icon} fill={true}></Image>
                    </div>
                    <p className="text-erniecream text-sm font-circular text-center">
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
        </main>
      )}
      {dataObject == null && (
        <div className="flex min-h-screen bg-ernieteal relative">
          <div className="liquidernie w-24 h-24 mx-auto my-auto relative flex flex-row"></div>
        </div>
      )}
    </div>
  );
}
