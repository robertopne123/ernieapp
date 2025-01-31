import { useEffect, useState } from "react";
import Image from "next/image";
import { gql } from "@apollo/client";
import CheckoutForm from "../shopPages/checkoutElements/checkoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import graphqlClient from "../../apollo-client";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { Info } from "./info";
import { Browser } from "@capacitor/browser";
import { CardCheckout } from "./cardCheckout";
// import convertToSubcurrency from "@/lib/convertToSubcurrency";

export const Basket = ({
  addToSubBasket,
  addToOneOffBasket,
  updateSubBasket,
  updateOneOffBasket,
  clearSubBasket,
  clearOneOffBasket,
  setNewSubFrequency,
  newSubFreq,
  subBasket,
  oneOffBasket,
  purchaseType,
  hasSubscription,
  customerId,
  setSubscriptions,
  setHasSubscription,
  subscriptions,
  managingSubscription,
  updatePlanFrequency,
  updatePlan,
  orderComplete,
  setOrderComplete,
  orderDetails,
  setOrderDetails,
  showingBasket,
  setShowingBasket,
  coupons,
  products,
  orderHistory,
  setOrderHistory,
  cfh,
}) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  const [showingCheckout, setShowingCheckout] = useState(false);

  useEffect(() => {
    console.log("complete");
  }, [orderComplete]);

  const [businessName, setBusinessName] = useState(
    cfh ? "" : localStorage.getItem("companyname")
  );
  const [sAddress, setSAddress] = useState(
    cfh ? "" : localStorage.getItem("address")
  );
  const [bAddress, setBAddress] = useState(
    cfh ? "" : localStorage.getItem("address")
  );
  const [sPostcode, setSPostcode] = useState(
    cfh ? "" : localStorage.getItem("postcode")
  );
  const [bPostcode, setBPostcode] = useState(
    cfh ? "" : localStorage.getItem("postcode")
  );
  const [contactNumber, setContactNumber] = useState(
    cfh ? "" : localStorage.getItem("number")
  );

  const [businessNameError, setBusinessNameError] = useState(false);
  const [sAddressError, setSAddressError] = useState(false);
  const [bAddressError, setBAddressError] = useState(false);
  const [sPostcodeError, setSPostcodeError] = useState(false);
  const [bPostcodeError, setBPostcodeError] = useState(false);
  const [contactNumberError, setContactNumberError] = useState(false);

  const [donationAmount, setDonationAmount] = useState(0.0);
  const [voucherAmount, setVoucherAmount] = useState(0.0);
  const [deliveryAmount, setDeliveryAmount] = useState(0.0);

  const [voucher, setVoucher] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherFound, setVoucherFound] = useState(false);
  const [voucherInvalid, setVoucherInvalid] = useState(false);
  const [voucherInvalidMsg, setVoucherInvalidMsg] = useState("");
  const [matchedProduct, setMatchedProduct] = useState(-1);
  const [mProducts, setMProducts] = useState([]);

  const router = useRouter();

  const decSubQuantity = (index) => {
    let subBasketCopy = [...subBasket];

    if (subBasketCopy[index].quantity > 1) {
      subBasketCopy[index].quantity = subBasketCopy[index].quantity - 1;
    } else if (subBasketCopy[index].quantity == 1) {
      subBasketCopy.splice(index, 1);
    }

    updateSubBasket(subBasketCopy);
  };

  const incSubQuantity = (index) => {
    let subBasketCopy = [...subBasket];

    subBasketCopy[index].quantity = subBasketCopy[index].quantity + 1;

    updateSubBasket(subBasketCopy);
  };

  const decOneOffQuantity = (index) => {
    let oneOffBasketCopy = [...oneOffBasket];

    if (oneOffBasketCopy[index].quantity > 1) {
      oneOffBasketCopy[index].quantity = oneOffBasketCopy[index].quantity - 1;
    } else if (oneOffBasketCopy[index].quantity == 1) {
      oneOffBasketCopy.splice(index, 1);
    }

    updateOneOffBasket(oneOffBasketCopy);
  };

  const incOneOffQuantity = (index) => {
    let oneOffBasketCopy = [...oneOffBasket];

    oneOffBasketCopy[index].quantity = oneOffBasketCopy[index].quantity + 1;

    updateOneOffBasket(oneOffBasketCopy);
  };

  const getSubSubtotal = () => {
    let subtotal = 0;

    for (let i = 0; i < subBasket.length; i++) {
      subtotal =
        subtotal +
        parseFloat(
          subBasket[i].product.type == "SIMPLE"
            ? subBasket[i].product.price.replace("£", "")
            : subBasket[i].selectedVariant?.price.replace("£", "")
        ) *
          subBasket[i].quantity;
    }

    return subtotal;
  };

  const getCurSubSubTotal = () => {
    let subtotal = 0;

    let arr = [];

    arr = subscriptions?.data?.subscription?.subscription?.lineItems?.nodes;

    console.log(arr);

    if (arr?.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        subtotal =
          subtotal +
          parseFloat(
            arr[i].product?.node.type == "SIMPLE"
              ? arr[i].product?.node.price.replace("£", "")
              : arr[i].variation?.node.price.replace("£", "")
          ) *
            arr[i].quantity;
      }
    }

    return subtotal;
  };

  const getOneOffSubtotal = () => {
    let subtotal = 0;

    for (let i = 0; i < oneOffBasket.length; i++) {
      subtotal =
        subtotal +
        (oneOffBasket[i].product.type == "SIMPLE"
          ? parseFloat(oneOffBasket[i].product.price.replace("£", "")) *
            oneOffBasket[i].quantity
          : parseFloat(
              oneOffBasket[i].selectedVariant
                ? oneOffBasket[i].selectedVariant?.price.replace("£", "")
                : oneOffBasket[i].variation?.price.replace("£", "")
            ) * oneOffBasket[i].quantity);
    }

    return subtotal;
  };

  const [subAdjBasket, setSubAdjBasket] = useState([]);

  const NEWORDER = gql`
    mutation newOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        orderId
        order {
          databaseId
          id
          total
          lineItems {
            nodes {
              databaseId
              quantity
              productId
            }
          }
          createdVia
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
  `;

  const ADDSUBSCRIPTION = gql`
    mutation MyMutation($input: CreateSubscriptionInput!) {
      createSubscription(input: $input) {
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
  `;

  const UPDATECLIENT = gql`
    mutation UpdateClient(
      $id: ID!
      $m25: Float!
      $phones: Int!
      $trees: Int!
      $coffee: Int!
      $bags: Int!
      $carbon: Float!
      $address: String!
      $coffeeMachine: Boolean!
      $contactNumber: String!
      $noOfStaff: String!
      $poiEmail: String!
      $poiFirstName: String!
      $postcode: String!
      $wfh: Boolean!
    ) {
      updateClient(
        input: {
          id: $id
          m25: $m25
          phones: $phones
          trees: $trees
          coffee: $coffee
          bags: $bags
          carbon: $carbon
          address: $address
          coffeeMachine: $coffeeMachine
          contactNumber: $contactNumber
          noOfStaff: $noOfStaff
          poiEmail: $poiEmail
          poiFirstName: $poiFirstName
          postcode: $postcode
          wfh: $wfh
        }
      ) {
        client {
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
    }
  `;

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
        }
      }
    }
  `;

  const REFRESH = gql`
    mutation refresh($refreshToken: String!) {
      refreshToken(input: { refreshToken: $refreshToken }) {
        authToken
        success
      }
    }
  `;

  const CHECKCOUPON = gql`
    mutation MyMutation($coupon: String!, $id: ID!) {
      checkCouponUsage(input: { coupon: $coupon, id: $id }) {
        usage
      }
    }
  `;

  const REFRESHORDERS = gql`
    query MyQuery2($customerId: Int!) {
      orders(
        first: 10000
        where: { customerId: $customerId, orderby: { field: DATE } }
      ) {
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
    }
  `;

  const [login, { data, loading, error }] = useMutation(LOGIN, {
    client: client,
  });

  const [refreshToken, { refreshData, refreshLoading, refreshError }] =
    useMutation(REFRESH, {
      client: client,
    });

  const [refreshOrderHistory, { oHData, oHLoading, oHError }] = useLazyQuery(
    REFRESHORDERS,
    { client: client }
  );

  const [checkCoupon, { cCData, cCLoading, cCError }] = useMutation(
    CHECKCOUPON,
    { client: client }
  );

  const loginUser = (un, pw, jr) => {
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

        localStorage.setItem("authtoken", data?.data?.login?.authToken);
        localStorage.setItem("refreshtoken", data?.data?.login?.refreshToken);
        localStorage.setItem(
          "role",
          data?.data?.login?.user.roles.nodes[0].name
        );
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
          data?.data?.login?.customer?.databaseId //NEEDS CHANGING IF EMPLOYEES ADDED
        );
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

        localStorage.setItem("firstName", data?.data?.login?.user?.firstName);

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

        localStorage.setItem("prevUser", un);
        localStorage.setItem("prevPass", pw);

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

  const [retryCount, setRetryCount] = useState(0);
  const [maxRetry, setRetryMax] = useState(5);

  const [checkout] = useMutation(NEWORDER, {
    client: graphqlClient,
  });

  const [addSubscription] = useMutation(ADDSUBSCRIPTION, {
    client: graphqlClient,
  });

  const [updateClient] = useMutation(UPDATECLIENT, {
    client: graphqlClient,
  });

  const [processingOrder, setProcessingOrder] = useState(false);
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  const [url, setUrl] = useState("");

  const [paymentIntentId, setPaymentIntentId] = useState(-1);

  console.log(oneOffBasket);

  function handleSubmit() {
    setProcessingOrder(true);

    console.log(contactNumber);

    if (businessName == "") {
      setBusinessNameError(true);
      setProcessingOrder(false);

      scrollToTop();

      return;
    } else {
      setBusinessNameError(false);
    }

    if (sAddress == "") {
      setSAddressError(true);
      setProcessingOrder(false);

      scrollToTop();

      return;
    } else {
      setSAddressError(false);
    }

    if (bAddress == "") {
      setBAddressError(true);
      setProcessingOrder(false);

      scrollToTop();

      return;
    } else {
      setBAddressError(false);
    }

    if (sPostcode == "") {
      setSPostcodeError(true);
      setProcessingOrder(false);

      scrollToTop();

      return;
    } else {
      setSPostcodeError(false);
    }

    if (bPostcode == "") {
      setBPostcodeError(true);
      setProcessingOrder(false);

      scrollToTop();

      return;
    } else {
      setBPostcodeError(false);
    }

    if (contactNumber == "") {
      setContactNumberError(true);
      setProcessingOrder(false);

      console.log("error");

      scrollToTop();

      return;
    } else {
      setContactNumberError(false);
    }

    let lineItems = [];

    let basket = [];

    if (purchaseType == 0) {
      basket = oneOffBasket;
    } else {
      basket = subBasket;
    }

    for (let i = 0; i < basket.length; i++) {
      console.log(basket[i]);

      if (mProducts.length > 0) {
        if (
          basket[i].product.databaseId ==
          mProducts[mProducts.length - 1]?.databaseId
        ) {
          if (basket[i].quantity > 1) {
            for (let j = 0; j < basket[i].quantity; j++) {
              if (basket[i].product.type == "SIMPLE") {
                lineItems.push({
                  name: basket[i].product.name,
                  productId: basket[i].product.databaseId,
                  quantity: basket[i].quantity,
                });
              } else {
                lineItems.push({
                  name: basket[i].product.name,
                  productId: basket[i].product.databaseId,
                  quantity: basket[i].quantity,
                  variationId: basket[i].selectedVariant?.databaseId,
                  metaData:
                    basket[i].selectedVariant?.name.split(" - ")[1].split(",")
                      .length == 1
                      ? [
                          {
                            key: "type",
                            value: basket[i].selectedVariant?.name
                              .split(" - ")[1]
                              .split(",")[0],
                          },
                        ]
                      : [
                          {
                            key: "size",
                            value: basket[i].selectedVariant?.name
                              .split(" - ")[1]
                              .split(",")[0],
                          },
                          {
                            key: "type",
                            value: basket[i].selectedVariant?.name
                              .split(" - ")[1]
                              .split(",")[1],
                          },
                        ],
                });
              }
            }
          }
        }
      }

      if (basket[i].product.type == "SIMPLE") {
        lineItems.push({
          name: basket[i].product.name,
          productId: basket[i].product.databaseId,
          quantity: basket[i].quantity,
        });
      } else {
        lineItems.push({
          name: basket[i].product.name,
          productId: basket[i].product.databaseId,
          quantity: basket[i].quantity,
          variationId: basket[i].selectedVariant?.databaseId,
          metaData:
            basket[i].selectedVariant?.name.split(" - ")[1].split(",").length ==
            1
              ? [
                  {
                    key: "type",
                    value: basket[i].selectedVariant?.name
                      .split(" - ")[1]
                      .split(",")[0],
                  },
                ]
              : [
                  {
                    key: "size",
                    value: basket[i].selectedVariant?.name
                      .split(" - ")[1]
                      .split(",")[0],
                  },
                  {
                    key: "type",
                    value: basket[i].selectedVariant?.name
                      .split(" - ")[1]
                      .split(",")[1],
                  },
                ],
        });
      }
    }

    if (addDonation) {
      lineItems.push({
        name: "Groundswell Donation",
        productId: 3723,
        quantity: parseInt(donationAmount),
      });
    }

    console.log(lineItems);

    console.log(purchaseType);

    let mId =
      purchaseType == 0
        ? parseFloat(getOneOffSubtotal().toFixed(2)) < 80.0
          ? "flat_rate"
          : "free_shipping"
        : managingSubscription
        ? parseFloat(getCurSubSubTotal().toFixed(2)) +
            parseFloat(getSubSubtotal().toFixed(2)) <
          80.0
          ? "flat_rate"
          : "free_shipping"
        : parseFloat(getSubSubtotal().toFixed(2)) < 80.0
        ? "flat_rate"
        : "free_shipping";

    let mTitle =
      purchaseType == 0
        ? parseFloat(getOneOffSubtotal().toFixed(2)) < 80.0
          ? "Flat Rate"
          : "Free Shipping"
        : managingSubscription
        ? parseFloat(getCurSubSubTotal().toFixed(2)) +
            parseFloat(getSubSubtotal().toFixed(2)) <
          80.0
          ? "Flat Rate"
          : "Free Shipping"
        : parseFloat(getSubSubtotal().toFixed(2)) < 80.0
        ? "Flat Rate"
        : "Free Shipping";

    let total =
      purchaseType == 0
        ? parseFloat(getOneOffSubtotal().toFixed(2)) < 80.0
          ? cfh == "5.25"
            ? "8.95"
            : "0.0"
          : "0.0"
        : managingSubscription
        ? parseFloat(getCurSubSubTotal().toFixed(2)) +
            parseFloat(getSubSubtotal().toFixed(2)) <
          80.0
          ? cfh == "5.25"
            ? "8.95"
            : "0.0"
          : parseFloat(getSubSubtotal().toFixed(2)) < 80.0
          ? cfh == "5.25"
            ? "8.95"
            : "0.0"
          : "0.0"
        : "0.0";

    if (purchaseType == 0) {
      console.log;

      try {
        checkout({
          variables: {
            input: {
              paymentMethod: paymentOptions[selectedPayment].name,
              lineItems: lineItems,
              customerId: parseInt(customerId),
              customerNote: "Ernie App Order",
              coupons: appliedVoucher,
              billing: {
                address1: bAddress,
                company: businessName,
                postcode: bPostcode,
                phone: contactNumber,
              },
              shipping: {
                address1: sAddress,
                company: businessName,
                postcode: sPostcode,
                phone: contactNumber,
              },
              shippingLines: [
                {
                  methodId: mId,
                  methodTitle: mTitle,
                  total: total,
                },
              ],
              metaData:
                paymentOptions[selectedPayment].name == "stripe"
                  ? [
                      {
                        key: "_stripe_intent_id",
                        value: paymentIntentId,
                      },
                    ]
                  : [],
            },
          },
        })
          .then((data) => {
            console.log("Order Received (", data, ")");

            let totalQty = 0;

            console.log(orderHistory);

            let employerUser = localStorage.getItem("employeruser");
            let employerEmail = localStorage.getItem("employeremail");

            let orderData = data;

            refreshOrderHistory({
              variables: {
                customerId: parseInt(employerUser),
              },
            }).then((data) => {
              console.log(data.data.orders.nodes);

              let employerUser = localStorage.getItem("employeruser");
              let employerEmail = localStorage.getItem("employeremail");

              refreshOrderHistory({
                variables: {
                  customerId: parseInt(employerUser),
                },
              }).then((data) => {
                console.log(data.data.orders.nodes);

                setOrderHistory(data.data.orders.nodes);
              });
            });

            for (
              let i = 0;
              i < data.data.createOrder.order.lineItems.nodes.length;
              i++
            ) {
              totalQty +=
                data.data.createOrder.order.lineItems.nodes[i].quantity;
            }

            console.log(totalQty);

            let cInfo = JSON.parse(localStorage.getItem("clientInformation"));

            console.log(cInfo);

            let address = cInfo.deliveryCompanyAddress;
            let coffeeMachine =
              cInfo.coffeeMachineOnSite != null
                ? cInfo.coffeeMachineOnSite
                : false;
            let contactNumber = cInfo.pointOfContactNumber;
            let noOfStaff = cInfo.numberOfStaff;
            let poiEmail = cInfo.pointOfContactEmail;
            let poiFirstName = cInfo.pointOfContactFirstName;
            let postcode = cInfo.deliveryCompanyPostcode;
            let wfh = cInfo.workFromHomeDays;

            updateClient({
              variables: {
                id: localStorage.getItem("clientID"),
                bags: parseInt(localStorage.getItem("bags")) + totalQty,
                carbon:
                  parseFloat(localStorage.getItem("carbon")) +
                  (totalQty * 0.44 + Math.floor(totalQty / 2) * 25),
                trees:
                  parseInt(localStorage.getItem("trees")) +
                  Math.floor(totalQty / 6),
                coffee:
                  parseInt(localStorage.getItem("coffee")) + totalQty * 100,
                phones:
                  parseInt(localStorage.getItem("phones")) +
                  Math.round(totalQty * 0.44 * 120),
                m25:
                  Math.round((totalQty * 0.44) / 32.148) +
                    parseFloat(localStorage.getItem("m25")) <
                  1
                    ? Math.round(((totalQty * 0.44) / 32.148) * 100) / 100 +
                      parseFloat(localStorage.getItem("m25"))
                    : Math.round((total * 0.44) / 32.148) +
                      parseFloat(localStorage.getItem("m25")),
                address: address,
                coffeeMachine: coffeeMachine,
                contactNumber: contactNumber,
                noOfStaff: noOfStaff,
                poiEmail: poiEmail,
                poiFirstName: poiFirstName,
                postcode: postcode,
                wfh: wfh,
              },
            }).then((data) => {
              console.log(data);

              localStorage.setItem(
                "client",
                JSON.stringify(data.data.updateClient.client)
              );
            });

            setOrderComplete(true);
            setOrderDetails(data);
          })
          .catch((error) => {
            console.log(error);

            localStorage.setItem("authtoken", "");

            refreshToken({
              variables: {
                refreshToken: localStorage.getItem("refreshtoken"),
              },
            }).then((data) => {
              console.log(data);

              localStorage.setItem(
                "authtoken",
                data.data.refreshToken.authToken
              );

              checkout({
                variables: {
                  input: {
                    paymentMethod: paymentOptions[selectedPayment].name,

                    lineItems: lineItems,
                    customerId: parseInt(customerId),
                    customerNote: "Ernie App Order",
                    coupons: appliedVoucher,
                    billing: {
                      address1: bAddress,
                      company: businessName,
                      postcode: bPostcode,
                      phone: contactNumber,
                    },
                    shipping: {
                      address1: sAddress,
                      company: businessName,
                      postcode: sPostcode,
                      phone: contactNumber,
                    },
                    shippingLines: [
                      {
                        methodId: mId,
                        methodTitle: mTitle,
                        total: total,
                      },
                    ],
                    metaData:
                      paymentOptions[selectedPayment].name == "stripe"
                        ? [
                            {
                              key: "_stripe_intent_id",
                              value: paymentIntentId,
                            },
                          ]
                        : [],
                  },
                },
              }).then((data) => {
                console.log("Order Received (", data, ")");

                let totalQty = 0;

                let employerUser = localStorage.getItem("employeruser");
                let employerEmail = localStorage.getItem("employeremail");

                let orderData = data;

                refreshOrderHistory({
                  variables: {
                    customerId: parseInt(employerUser),
                  },
                }).then((data) => {
                  console.log(data.data.orders.nodes);

                  let employerUser = localStorage.getItem("employeruser");
                  let employerEmail = localStorage.getItem("employeremail");

                  refreshOrderHistory({
                    variables: {
                      customerId: parseInt(employerUser),
                    },
                  }).then((data) => {
                    console.log(data.data.orders.nodes);

                    setOrderHistory(data.data.orders.nodes);
                  });
                });

                for (
                  let i = 0;
                  i < data.data.createOrder.order.lineItems.nodes.length;
                  i++
                ) {
                  totalQty +=
                    data.data.createOrder.order.lineItems.nodes[i].quantity;
                }

                console.log(totalQty);

                let cInfo = JSON.parse(
                  localStorage.getItem("clientInformation")
                );

                console.log(cInfo);

                let address = cInfo.deliveryCompanyAddress;
                let coffeeMachine = cInfo.coffeeMachineOnSite;
                let contactNumber = cInfo.pointOfContactNumber;
                let noOfStaff = cInfo.numberOfStaff;
                let poiEmail = cInfo.pointOfContactEmail;
                let poiFirstName = cInfo.pointOfContactFirstName;
                let postcode = cInfo.deliveryCompanyPostcode;
                let wfh = cInfo.workFromHomeDays;

                updateClient({
                  variables: {
                    id: localStorage.getItem("clientID"),
                    bags: parseInt(localStorage.getItem("bags")) + totalQty,
                    carbon:
                      parseFloat(localStorage.getItem("carbon")) +
                      (totalQty * 0.44 + Math.floor(totalQty / 2) * 25),
                    trees:
                      parseInt(localStorage.getItem("trees")) +
                      Math.floor(totalQty / 6),
                    coffee:
                      parseInt(localStorage.getItem("coffee")) + totalQty * 100,
                    phones:
                      parseInt(localStorage.getItem("phones")) +
                      Math.round(totalQty * 0.44 * 120),
                    m25:
                      Math.round((totalQty * 0.44) / 32.148) +
                        parseFloat(localStorage.getItem("m25")) <
                      1
                        ? Math.round(((totalQty * 0.44) / 32.148) * 100) / 100 +
                          parseFloat(localStorage.getItem("m25"))
                        : Math.round((total * 0.44) / 32.148) +
                          parseFloat(localStorage.getItem("m25")),
                    address: address,
                    coffeeMachine: coffeeMachine,
                    contactNumber: contactNumber,
                    noOfStaff: noOfStaff,
                    poiEmail: poiEmail,
                    poiFirstName: poiFirstName,
                    postcode: postcode,
                    wfh: wfh,
                  },
                }).then((data) => {
                  console.log(data);

                  localStorage.setItem(
                    "client",
                    JSON.stringify(data.data.updateClient.client)
                  );
                });

                setOrderComplete(true);
                setOrderDetails(data);
              });
            });
          });
      } catch (error) {
        console.error("hi", error);
      }
    } else {
      try {
        console.log(mId);
        console.log(mTitle);
        console.log(total);
        console.log(lineItems);

        addSubscription({
          variables: {
            input: {
              paymentMethod: paymentOptions[selectedPayment].name,
              lineItems: lineItems,
              customerId: parseInt(customerId),
              customerNote: "Ernie App Order",
              billing: {
                address1: bAddress,
                company: businessName,
                postcode: bPostcode,
                phone: contactNumber,
              },
              shipping: {
                address1: sAddress,
                company: businessName,
                postcode: sPostcode,
                phone: contactNumber,
              },
              shippingLines: [
                {
                  methodId: mId,
                  methodTitle: mTitle,
                  total: total,
                },
              ],
              billingInterval: interval + "",
              billingPeriod: period,
              metaData:
                paymentOptions[selectedPayment].name == "stripe"
                  ? [
                      {
                        key: "_stripe_intent_id",
                        value: paymentIntentId,
                      },
                    ]
                  : [],
            },
          },
        })
          .then((data) => {
            console.log("Order Received (", data, ")");

            let totalQty = 0;

            let employerUser = localStorage.getItem("employeruser");
            let employerEmail = localStorage.getItem("employeremail");

            let orderData = data;

            refreshOrderHistory({
              variables: {
                customerId: parseInt(employerUser),
              },
            }).then((data) => {
              console.log(data.data.orders.nodes);

              setOrderHistory(data.data.orders.nodes);
            });

            for (
              let i = 0;
              i <
              data.data.createSubscription.subscription.lineItems.nodes.length;
              i++
            ) {
              totalQty +=
                data.data.createSubscription.subscription.lineItems.nodes[i]
                  .quantity;
            }

            console.log(totalQty);

            let cInfo = JSON.parse(localStorage.getItem("clientInformation"));

            console.log(cInfo);

            let address = cInfo.deliveryCompanyAddress;
            let coffeeMachine = cInfo.coffeeMachineOnSite;
            let contactNumber = cInfo.pointOfContactNumber;
            let noOfStaff = cInfo.numberOfStaff;
            let poiEmail = cInfo.pointOfContactEmail;
            let poiFirstName = cInfo.pointOfContactFirstName;
            let postcode = cInfo.deliveryCompanyPostcode;
            let wfh = cInfo.workFromHomeDays;

            updateClient({
              variables: {
                id: localStorage.getItem("clientID"),
                bags: parseInt(localStorage.getItem("bags")) + totalQty,
                carbon:
                  parseFloat(localStorage.getItem("carbon")) +
                  (totalQty * 0.44 + Math.floor(totalQty / 2) * 25),
                trees:
                  parseInt(localStorage.getItem("trees")) +
                  Math.floor(totalQty / 6),
                coffee:
                  parseInt(localStorage.getItem("coffee")) + totalQty * 100,
                phones:
                  parseInt(localStorage.getItem("phones")) +
                  Math.round(totalQty * 0.44 * 120),
                m25:
                  Math.round((totalQty * 0.44) / 32.148) +
                    parseFloat(localStorage.getItem("m25")) <
                  1
                    ? Math.round(((totalQty * 0.44) / 32.148) * 100) / 100 +
                      parseFloat(localStorage.getItem("m25"))
                    : Math.round((total * 0.44) / 32.148) +
                      parseFloat(localStorage.getItem("m25")),
                address: address,
                coffeeMachine: coffeeMachine,
                contactNumber: contactNumber,
                noOfStaff: noOfStaff,
                poiEmail: poiEmail,
                poiFirstName: poiFirstName,
                postcode: postcode,
                wfh: wfh,
              },
            }).then((data) => {
              console.log(data);

              localStorage.setItem(
                "client",
                JSON.stringify(data.data.updateClient.client)
              );
            });

            setOrderComplete(true);
            setOrderDetails(data);
          })
          .catch((error) => {
            console.log(error);

            localStorage.setItem("authtoken", "");

            refreshToken({
              variables: {
                refreshToken: localStorage.getItem("refreshtoken"),
              },
            }).then((data) => {
              addSubscription({
                variables: {
                  input: {
                    paymentMethod: paymentOptions[selectedPayment].name,
                    lineItems: lineItems,
                    customerId: parseInt(customerId),
                    customerNote: "Ernie App Order",
                    billing: {
                      address1: bAddress,
                      company: businessName,
                      postcode: bPostcode,
                      phone: contactNumber,
                    },
                    shipping: {
                      address1: sAddress,
                      company: businessName,
                      postcode: sPostcode,
                      phone: contactNumber,
                    },
                    shippingLines: [
                      {
                        methodId: mId,
                        methodTitle: mTitle,
                        total: total,
                      },
                    ],
                    billingInterval: interval + "",
                    billingPeriod: period,
                    metaData:
                      paymentOptions[selectedPayment].name == "stripe"
                        ? [
                            {
                              key: "_stripe_intent_id",
                              value: paymentIntentId,
                            },
                          ]
                        : [],
                  },
                },
              }).then((data) => {
                console.log("Order Received (", data, ")");

                let totalQty = 0;

                for (
                  let i = 0;
                  i <
                  data.data.createSubscription.subscription.lineItems.nodes
                    .length;
                  i++
                ) {
                  totalQty +=
                    data.data.createSubscription.subscription.lineItems.nodes[i]
                      .quantity;
                }

                console.log(totalQty);

                let cInfo = JSON.parse(
                  localStorage.getItem("clientInformation")
                );

                console.log(cInfo);

                let address = cInfo.deliveryCompanyAddress;
                let coffeeMachine = cInfo.coffeeMachineOnSite;
                let contactNumber = cInfo.pointOfContactNumber;
                let noOfStaff = cInfo.numberOfStaff;
                let poiEmail = cInfo.pointOfContactEmail;
                let poiFirstName = cInfo.pointOfContactFirstName;
                let postcode = cInfo.deliveryCompanyPostcode;
                let wfh = cInfo.workFromHomeDays;

                updateClient({
                  variables: {
                    id: localStorage.getItem("clientID"),
                    bags: parseInt(localStorage.getItem("bags")) + totalQty,
                    carbon:
                      parseFloat(localStorage.getItem("carbon")) +
                      (totalQty * 0.44 + Math.floor(totalQty / 2) * 25),
                    trees:
                      parseInt(localStorage.getItem("trees")) +
                      Math.floor(totalQty / 6),
                    coffee:
                      parseInt(localStorage.getItem("coffee")) + totalQty * 100,
                    phones:
                      parseInt(localStorage.getItem("phones")) +
                      Math.round(totalQty * 0.44 * 120),
                    m25:
                      Math.round((totalQty * 0.44) / 32.148) +
                        parseFloat(localStorage.getItem("m25")) <
                      1
                        ? Math.round(((totalQty * 0.44) / 32.148) * 100) / 100 +
                          parseFloat(localStorage.getItem("m25"))
                        : Math.round((total * 0.44) / 32.148) +
                          parseFloat(localStorage.getItem("m25")),
                    address: address,
                    coffeeMachine: coffeeMachine,
                    contactNumber: contactNumber,
                    noOfStaff: noOfStaff,
                    poiEmail: poiEmail,
                    poiFirstName: poiFirstName,
                    postcode: postcode,
                    wfh: wfh,
                  },
                }).then((data) => {
                  console.log(data);

                  localStorage.setItem(
                    "client",
                    JSON.stringify(data.data.updateClient.client)
                  );
                });

                setOrderComplete(true);
                setOrderDetails(data);
              });
            });
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const backAction = () => {
    setShowingCheckout(false);
    setVoucherApplied(false);
  };

  const appearance = {
    rules: {
      ".Input": {
        backgroundColor: "#FFFFEC",
        border: "1px solid #01513C",
        borderRadius: "8px",
        padding: "10px 16px",
        fontFamily: "Circular Std",
        fontWeight: "500",
        color: "#01513C",
      },
      ".Input--empty": {
        backgroundColor: "#FFFFEC",
        border: "1px solid #01513C",
        borderRadius: "8px",
        padding: "10px 16px",
        fontFamily: "Circular Std",
        fontWeight: "500",
        color: "#01513C",
      },
      ".Input::placeholder": {
        backgroundColor: "#FFFFEC",

        fontFamily: "Circular Std",
        fontWeight: "500",
        color: "#01513C",
      },
      ".Label": {
        fontFamily: "Circular Std",
        fontWeight: "500",
        color: "#01513C",
        marginBottom: "8px",
      },
    },
  };

  const pathname = usePathname();

  const paymentOptions = cfh
    ? [
        { image: "/Visa_Inc._logo.svg", name: "stripe" },
        // { image: "/Paypal.svg" },
        // { image: "/Apple_Pay_logo.svg" },
        // { image: "/Google_Pay_Logo.svg" },
      ]
    : [
        { image: "/Visa_Inc._logo.svg", name: "stripe" },
        // { image: "/Paypal.svg" },
        // { image: "/Apple_Pay_logo.svg" },
        // { image: "/Google_Pay_Logo.svg" },
        { image: "/erniesmall.svg", name: "bacs" },
      ];

  const nextSteps = () => {
    if (managingSubscription) {
      console.log(donationAmount);
      console.log(addDonation);

      console.log(products);

      let donationProduct = {};

      for (let i = 0; i < products.length; i++) {
        if (products[i].databaseId == 3723) {
          donationProduct = products[i];
        }
      }

      if (addDonation) {
        subAdjBasket.push({
          product: { node: donationProduct },
          quantity: donationAmount,
        });
      }

      console.log(subAdjBasket);

      updatePlan(subAdjBasket);
      // updatePlanFrequency({
      //   id: subscriptions.data.subscription.subscription
      //     .databaseId,
      //   billingInterval: interval + "",
      //   billingPeriod: period,
      // });
      setProcessingOrder(true);
    } else {
      handleSubmit();
    }
  };

  const [selectedPayment, setSelectedPayment] = useState(0);

  const [ping, setPing] = useState(false);

  const [showBillingAddress, setShowBillingAddress] = useState(true);

  const [addDonation, setDonation] = useState(false);

  useEffect(() => {
    let basketIndicator = document.getElementById("indicator");

    basketIndicator.classList.toggle("animate-ping-once");

    setTimeout(() => {
      basketIndicator.classList.remove("animate-ping-once");
    }, 1000);
  }, [subBasket]);

  const [interval, setInterval] = useState(
    parseInt(subscriptions.data?.subscription?.subscription?.billingInterval)
  );
  const [period, setPeriod] = useState(
    subscriptions.data?.subscription?.subscription?.billingPeriod
  );

  useEffect(() => {
    setInterval(
      parseInt(
        subscriptions.data?.subscription?.subscription?.billingInterval
          ? subscriptions.data?.subscription?.subscription?.billingInterval
          : 1
      )
    );
    setPeriod(
      subscriptions.data?.subscription?.subscription?.billingPeriod
        ? subscriptions.data?.subscription?.subscription?.billingPeriod
        : "week"
    );
  }, [subscriptions]);

  const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js

  const [showingInfo, setShowingInfo] = useState(false);

  const close = () => {
    setShowingInfo(false);
  };

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const setOrderCompleteFromBasket = (val) => {
    setOrderComplete(val);
  };

  useEffect(() => {
    setProcessingOrder(false);
  }, [orderComplete]);

  const getLoggedInUserOrders = (orders, email) => {
    let userOrders = [];

    for (let i = 0; i < orders?.length; i++) {
      if (orders[i].customer?.email == email) {
        userOrders.push(orders[i]);
      }
    }

    return userOrders;
  };

  const openCapacitorSite = async (link) => {
    await Browser.open({ url: link });
  };

  useEffect(() => {
    if (managingSubscription) {
      if (voucherApplied && appliedVoucher == "FREECOFFEE") {
        setDeliveryAmount(0.0);

        for (let i = 0; i < subAdjBasket.length; i++) {
          console.log(subAdjBasket[i]);
        }

        setVoucherAmount(
          parseFloat(
            subAdjBasket[subAdjBasket.length - 1]?.product.price.replace(
              "£",
              ""
            )
          ) * -1
        );
      } else {
        if (
          parseFloat(getCurSubSubTotal().toFixed(2)) +
            parseFloat(getSubSubtotal().toFixed(2)) <
          80.0
        ) {
          if (cfh) {
            setDeliveryAmount(5.25);
          } else {
            setDeliveryAmount(8.95);
          }
          setVoucherAmount(0.0);
        } else {
          setDeliveryAmount(0.0);
          setVoucherAmount(0.0);
        }
      }
    } else {
      if (purchaseType == 0) {
        if (voucherApplied) {
          let currentVoucher = {};

          for (let i = 0; i < coupons.length; i++) {
            if (coupons[i].code == appliedVoucher.toLowerCase()) {
              currentVoucher = coupons[i];
            }
          }

          console.log(currentVoucher);

          if (currentVoucher.freeShipping) {
            setDeliveryAmount(0.0);
          } else {
            if (cfh) {
              setDeliveryAmount(5.25);
            } else {
              setDeliveryAmount(8.95);
            }
          }

          for (let i = 0; i < oneOffBasket.length; i++) {
            console.log(oneOffBasket[i]);
          }

          if (currentVoucher.code === "groundswellstaff") {
            // Apply 20% discount to the basket
            const subtotal = parseFloat(getOneOffSubtotal().toFixed(2));
            const discount = subtotal * 0.2;
            setVoucherAmount(-discount);
          } else {
            setVoucherAmount(
              parseFloat(
                oneOffBasket[oneOffBasket.length - 1]?.product.price.replace(
                  "£",
                  ""
                )
              ) * -1
            );
          }
        } else {
          if (parseFloat(getOneOffSubtotal().toFixed(2)) < 80.0) {
            if (cfh) {
              setDeliveryAmount(5.25);
            } else {
              setDeliveryAmount(8.95);
            }

            setVoucherAmount(0.0);
          } else {
            setDeliveryAmount(0.0);
            setVoucherAmount(0.0);
          }
        }
      } else {
        if (voucherApplied && appliedVoucher == "FREECOFFEE") {
          setDeliveryAmount(0.0);

          for (let i = 0; i < subAdjBasket.length; i++) {
            console.log(subAdjBasket[i]);
          }

          setVoucherAmount(
            parseFloat(
              subAdjBasket[subAdjBasket.length - 1]?.product.price.replace(
                "£",
                ""
              )
            ) * -1
          );
        } else {
          if (parseFloat(getSubSubtotal().toFixed(2)) < 80.0) {
            if (cfh) {
              setDeliveryAmount(5.25);
            } else {
              setDeliveryAmount(8.95);
            }

            setVoucherAmount(0.0);
          } else {
            setDeliveryAmount(0.0);
            setVoucherAmount(0.0);
          }
        }
      }
    }
  }, [
    subAdjBasket,
    getCurSubSubTotal,
    getSubSubtotal,
    voucher,
    voucherApplied,
    managingSubscription,
    oneOffBasket,
    getOneOffSubtotal,
    purchaseType,
    coupons,
    appliedVoucher,
  ]);

  useEffect(() => {
    if (addDonation) {
    } else {
      setDonationAmount(0.0);
    }
  }, [addDonation]);

  useEffect(() => {
    console.log(mProducts);

    let higher = 0.0;
    let location = 0;

    for (let i = 0; i < mProducts.length; i++) {
      if (
        (
          parseFloat(mProducts[i].product.price.replace("£", "")) *
          mProducts[i].quantity
        ).toFixed(2) > higher
      ) {
        higher = (
          parseFloat(mProducts[i].product.price.replace("£", "")) *
          mProducts[i].quantity
        ).toFixed(2);
        location = i;
      }
    }

    console.log(higher);

    setMatchedProduct(location);
  }, [mProducts]);

  const [collectingCardDetails, setCollectingCardDetails] = useState(false);

  return (
    <div className="flex flex-col justify-center z-[990]">
      {showingInfo && (
        <Info
          name={"Coffee That Connects: Bridging Communities with Groundswell "}
          description={
            "Ernie London is proud to partner with Groundswell, a charity creating healthier lives, stronger voices and better futures for anyone with experience of homelessness. We share the belief that everyone deserves to be seen, heard and supported. Our contribution will fuel Groundswell’s person-centered and participatory approach to tackling homelessness, where often the most powerful first step is connecting over a cup of coffee. Together, we’re turning every sip into a step towards solving homelessness, recognising that change often begins with a simple, human gesture. "
          }
          close={close}
          link={"https://groundswell.org.uk/"}
        />
      )}
      <div
        className={`relative cursor-pointer ${
          showingBasket && "bg-erniemint"
        } rounded-lg p-2 mr-[-8px]`}
      >
        {console.log(oneOffBasket)}
        <img
          id="indicator"
          src="/ERNIE_APP_ICON_CART_V1.png"
          className="w-10"
          onClick={() => setShowingBasket(!showingBasket)}
        ></img>
        <p className="font-circular text-erniecream absolute left-1/2 translate-x-[-50%] -translate-y-[27px] pointer-events-none">
          {purchaseType == 0
            ? oneOffBasket.length
            : purchaseType == 1
            ? subBasket?.length
            : 0}
        </p>
      </div>
      {console.log(purchaseType)}
      {showingBasket && (
        <>
          {showingCheckout ? (
            <div>
              {orderComplete ? (
                <div className="absolute right-0 top-20 h-auto w-full lg:h-[80%] lg:w-[80%]  lg:left-1/2 lg:top-1/2 lg:translate-x-[-50%] lg:translate-y-[-50%] lg:border-[1px] lg:border-erniegreen lg:rounded-xl lg:p-10 lg:shadow-xl bg-erniedarkcream p-6 lg:p-10 z-[990] flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <p className="font-circe font-[900] text-center text-2xl lg:text-3xl text-erniegreen uppercase">
                      Thank you for <br />
                      your order
                    </p>
                    <p className="font-circular font-[500] text-erniegreen text-center text-sm mb-2 lg:text-base">
                      {managingSubscription
                        ? "Your subscription has been updated"
                        : purchaseType == 0
                        ? "You will receive an email confirming the details of your order, and including your invoice. Please check your spam if you don't receive it."
                        : "Your new subscription is now active"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="bg-erniecream rounded-xl p-6">
                      <p className="font-circe font-[900] text-erniegreen uppercase text-xl">
                        Order Details
                      </p>
                      <img src="/divider.png" className="w-full"></img>
                      <div className="mt-2 flex flex-col">
                        <p className="font-circular font-[500] text-erniegreen">
                          {managingSubscription ? "Subscription " : "Order "}{" "}
                          {console.log(orderDetails)}
                          Number:{" "}
                          {purchaseType == 1
                            ? managingSubscription
                              ? orderDetails.data.subscription.subscription
                                  .databaseId
                              : orderDetails.data.createSubscription
                                  .subscription.databaseId
                            : orderDetails.data.createOrder.order.databaseId}
                        </p>
                        {purchaseType == 0 && (
                          <p className="font-circular font-[400] text-erniegreen">
                            Order Total: {console.log(orderDetails)}
                            {orderDetails.data.createOrder.order.total}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className="bg-erniegold py-2 w-full rounded-xl"
                      onClick={() => {
                        setOrderComplete(false);

                        console.log(orderHistory);

                        if (!managingSubscription) {
                          if (purchaseType == 0) {
                            clearOneOffBasket();

                            setShowingBasket(false);
                          } else {
                            clearSubBasket();

                            let data = {
                              data: {
                                subscription: {
                                  subscription:
                                    orderDetails.data.createSubscription
                                      .subscription,
                                },
                              },
                            };

                            console.log(data);

                            setSubscriptions(data);
                            setShowingBasket(false);
                            setHasSubscription(true);
                          }
                        } else {
                          clearSubBasket();

                          let data = orderDetails;
                          console.log(data);

                          setSubscriptions(data);
                          setShowingBasket(false);
                          setHasSubscription(true);
                        }
                      }}
                    >
                      <p className="font-circe font-[900] text-erniegreen text-xl text-center">
                        Continue Browsing
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {collectingCardDetails ? (
                    <div className="absolute right-0 top-20 h-full w-full bg-erniedarkcream p-6 lg:p-10 z-[990] flex flex-col gap-4">
                      <div
                        className="pb-2 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer mb-6"
                        onClick={() => {
                          setCollectingCardDetails(false);
                        }}
                      >
                        <div className="h-3 w-3 lg:h-4 lg:w-4 relative">
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
                      <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                        <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                          Card Payment
                        </p>
                        <img src="/divider.png" className=" w-full mt-2"></img>
                        <Elements
                          stripe={stripePromise}
                          options={{
                            mode: managingSubscription
                              ? "subscription"
                              : "payment",
                            appearance: appearance,
                            amount:
                              (managingSubscription
                                ? (
                                    parseFloat(getCurSubSubTotal().toFixed(2)) +
                                    parseFloat(getSubSubtotal().toFixed(2)) +
                                    parseFloat(deliveryAmount.toFixed(2)) +
                                    parseFloat(donationAmount.toFixed(2)) +
                                    parseFloat(voucherAmount.toFixed(2))
                                  ).toFixed(2)
                                : purchaseType == 0
                                ? (
                                    parseFloat(getOneOffSubtotal().toFixed(2)) +
                                    parseFloat(deliveryAmount.toFixed(2)) +
                                    parseFloat(donationAmount.toFixed(2)) +
                                    parseFloat(voucherAmount.toFixed(2))
                                  ).toFixed(2)
                                : (
                                    parseFloat(getSubSubtotal().toFixed(2)) +
                                    parseFloat(deliveryAmount.toFixed(2)) +
                                    parseFloat(donationAmount.toFixed(2)) +
                                    parseFloat(voucherAmount.toFixed(2))
                                  ).toFixed(2)) * 100,
                            currency: "gbp",
                          }}
                          className="relative"
                        >
                          <CardCheckout
                            amount={
                              (managingSubscription
                                ? (
                                    parseFloat(getCurSubSubTotal().toFixed(2)) +
                                    parseFloat(getSubSubtotal().toFixed(2)) +
                                    parseFloat(deliveryAmount.toFixed(2)) +
                                    parseFloat(donationAmount.toFixed(2)) +
                                    parseFloat(voucherAmount.toFixed(2))
                                  ).toFixed(2)
                                : purchaseType == 0
                                ? (
                                    parseFloat(getOneOffSubtotal().toFixed(2)) +
                                    parseFloat(deliveryAmount.toFixed(2)) +
                                    parseFloat(donationAmount.toFixed(2)) +
                                    parseFloat(voucherAmount.toFixed(2))
                                  ).toFixed(2)
                                : (
                                    parseFloat(getSubSubtotal().toFixed(2)) +
                                    parseFloat(deliveryAmount.toFixed(2)) +
                                    parseFloat(donationAmount.toFixed(2)) +
                                    parseFloat(voucherAmount.toFixed(2))
                                  ).toFixed(2)) * 100
                            }
                            setPaymentIntentId={setPaymentIntentId}
                            nextSteps={nextSteps}
                          />
                        </Elements>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute right-0 top-20 h-full w-full bg-erniedarkcream p-6 lg:p-10 z-[990] flex flex-col gap-4">
                      <div
                        className="pb-2 flex flex-row items-center gap-1 border-b-[1px] border-erniegreen cursor-pointer mb-6"
                        onClick={() => {
                          backAction();
                        }}
                      >
                        <div className="h-3 w-3 lg:h-4 lg:w-4 relative">
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
                      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-10">
                        <div className="flex flex-col gap-4">
                          <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                            <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                              Your Details
                            </p>
                            <img
                              src="/divider.png"
                              className=" w-full mt-2"
                            ></img>
                            <div className="flex flex-col gap-4 mt-4">
                              <div className="flex flex-col gap-2">
                                <label
                                  htmlFor="businessname"
                                  className={`font-circular ${
                                    businessNameError
                                      ? "text-red-400"
                                      : "text-erniegreen"
                                  } text-sm font-[500]`}
                                >
                                  Name of Company *
                                </label>
                                <input
                                  type="text"
                                  name="businessname"
                                  defaultValue={businessName}
                                  onChange={(e) => {
                                    setBusinessName(e.currentTarget.value);
                                  }}
                                  className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                                    businessNameError
                                      ? "border-red-400"
                                      : "border-erniegreen"
                                  } rounded-lg outline-erniegold outline-[1px]`}
                                ></input>
                              </div>

                              <div className="flex flex-col gap-2">
                                <label
                                  htmlFor="sAddress"
                                  className={`font-circular text-sm font-[500] ${
                                    sAddressError
                                      ? "text-red-400"
                                      : "text-erniegreen"
                                  }`}
                                >
                                  Shipping Address *
                                </label>
                                <input
                                  type="text"
                                  name="sAddress"
                                  defaultValue={sAddress}
                                  onChange={(e) => {
                                    setSAddress(e.currentTarget.value);
                                    if (showBillingAddress) {
                                      setBAddress(e.currentTarget.value);
                                    }
                                  }}
                                  className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                                    sAddressError
                                      ? "border-red-400"
                                      : "border-erniegreen"
                                  } rounded-lg outline-erniegold outline-[1px]`}
                                ></input>
                              </div>
                              <div className="flex flex-col gap-2">
                                <label
                                  htmlFor="sPostcode"
                                  className={`font-circular ${
                                    sPostcodeError
                                      ? "text-red-400"
                                      : "text-erniegreen"
                                  } text-sm font-[500]`}
                                >
                                  Postcode *
                                </label>
                                <input
                                  type="text"
                                  name="sPostcode"
                                  defaultValue={sPostcode}
                                  onChange={(e) => {
                                    setSPostcode(e.currentTarget.value);
                                    if (showBillingAddress) {
                                      setBPostcode(e.currentTarget.value);
                                    }
                                  }}
                                  className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                                    sPostcodeError
                                      ? "border-red-400"
                                      : "border-erniegreen"
                                  } rounded-lg outline-erniegold outline-[1px]`}
                                ></input>
                              </div>
                              <div className="flex flex-row gap-2">
                                <label
                                  htmlFor="isAddressSame"
                                  className="font-circular font-[500] text-erniegreen text-sm"
                                >
                                  Is this the same as the billing address?
                                </label>
                                <input
                                  type="checkbox"
                                  name="isAddressSame"
                                  className="w-6 h-6 bg-erniecream border-[1px] border-erniegreen rounded-sm outline-none appearance-none checked:bg-erniegold"
                                  checked={showBillingAddress}
                                  onChange={(e) => {
                                    setShowBillingAddress(!showBillingAddress);
                                  }}
                                ></input>
                              </div>
                              {!showBillingAddress && (
                                <>
                                  <div className="flex flex-col gap-2">
                                    <label
                                      htmlFor="bAddress"
                                      className={`font-circular ${
                                        bAddressError
                                          ? "text-red-400"
                                          : "text-erniegreen"
                                      } text-sm font-[500]`}
                                    >
                                      Billing Address *
                                    </label>
                                    <input
                                      type="text"
                                      name="bAddress"
                                      defaultValue={bAddress}
                                      onChange={(e) => {
                                        setBAddress(e.currentTarget.value);
                                      }}
                                      className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                                        bAddressError
                                          ? "border-red-400"
                                          : "border-erniegreen"
                                      } rounded-lg outline-erniegold outline-[1px]`}
                                    ></input>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label
                                      htmlFor="bPostcode"
                                      className={`font-circular ${
                                        bPostcode
                                          ? "text-red-400"
                                          : "text-erniegreen"
                                      } text-sm font-[500]`}
                                    >
                                      Postcode *
                                    </label>
                                    <input
                                      type="text"
                                      name="bPostcode"
                                      defaultValue={bPostcode}
                                      onChange={(e) => {
                                        setBPostcode(e.currentTarget.value);
                                      }}
                                      className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                                        bPostcodeError
                                          ? "border-red-400"
                                          : "border-erniegreen"
                                      } rounded-lg outline-erniegold outline-[1px]`}
                                    ></input>
                                  </div>
                                </>
                              )}
                              <div className="flex flex-col gap-2">
                                <label
                                  htmlFor="contactnumber"
                                  className={`font-circular ${
                                    contactNumberError
                                      ? "text-red-400"
                                      : "text-erniegreen"
                                  } text-sm font-[500]`}
                                >
                                  Contact Number *
                                </label>
                                <input
                                  type="text"
                                  name="contactnumber"
                                  defaultValue={contactNumber}
                                  onChange={(e) => {
                                    setContactNumber(e.currentTarget.value);
                                  }}
                                  className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] ${
                                    contactNumberError
                                      ? "border-red-400"
                                      : "border-erniegreen"
                                  } rounded-lg outline-erniegold outline-[1px]`}
                                ></input>
                              </div>
                            </div>
                          </div>
                          <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                            <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                              Coupons & Discounts
                            </p>
                            <img
                              src="/divider.png"
                              className=" w-full mt-2"
                            ></img>
                            <div className="flex flex-col gap-4 mt-4">
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  name="voucher"
                                  placeholder="Enter code here"
                                  onChange={(e) => {
                                    setVoucher(e.currentTarget.value);
                                  }}
                                  onPaste={(e) => {
                                    setVoucher(e.currentTarget.value);
                                  }}
                                  className={`bg-erniecream h-10 font-circular font-[500] px-4 text-erniegreen border-[1px] rounded-lg outline-erniegold outline-[1px] ${
                                    voucherInvalid
                                      ? "border-red-500"
                                      : voucherApplied
                                      ? "border-ernieteal"
                                      : "border-erniegreen"
                                  }`}
                                ></input>
                              </div>
                              {voucherApplied && (
                                <div className="flex flex-row">
                                  <div
                                    className="p-2 bg-erniedarkcream flex flex-row gap-2 rounded-lg cursor-pointer"
                                    onClick={(e) => {
                                      setVoucherApplied(false);
                                    }}
                                  >
                                    <p className="font-circular text-erniegreen text-xs font-[500]">
                                      {appliedVoucher}
                                    </p>
                                    <img src="/cross.svg" className="w-3"></img>
                                  </div>
                                </div>
                              )}
                              {voucherInvalid && (
                                <div className="flex flex-row">
                                  <p className="font-circular text-red-500 text-xs font-[500]">
                                    {voucherInvalidMsg}
                                  </p>
                                </div>
                              )}
                              <div
                                className={`bg-erniegold rounded-xl w-full p-2 flex flex-row justify-center items-center cursor-pointer`}
                                onClick={(e) => {
                                  setApplyingVoucher(true);

                                  console.log(voucher);

                                  console.log(coupons);

                                  console.log(oneOffBasket);

                                  let vFound = false;

                                  let id = localStorage.getItem("employeruser");

                                  let productsForCode = [];

                                  let usage = 0;

                                  checkCoupon({
                                    variables: {
                                      id: id,
                                      coupon: appliedVoucher.toLowerCase(),
                                    },
                                  })
                                    .then((data) => {
                                      usage = data.data.checkCouponUsage.usage;

                                      console.log(usage);

                                      setApplyingVoucher(false);

                                      for (let i = 0; i < coupons.length; i++) {
                                        if (
                                          coupons[i].code ==
                                          voucher.toLowerCase()
                                        ) {
                                          console.log(
                                            coupons[i].code,
                                            voucher.toLowerCase()
                                          );
                                          console.log(
                                            usage,
                                            coupons[i].couponDetails.maxUsage
                                          );
                                          if (
                                            usage <
                                            coupons[i].couponDetails.maxUsage
                                          ) {
                                            if (purchaseType == 0) {
                                              productsForCode =
                                                coupons[i].products.nodes;

                                              console.log(productsForCode);

                                              let matchingProducts = [];

                                              for (
                                                let a = 0;
                                                a < productsForCode.length;
                                                a++
                                              ) {
                                                for (
                                                  let b = 0;
                                                  b < oneOffBasket.length;
                                                  b++
                                                ) {
                                                  console.log(
                                                    productsForCode[a]
                                                      .databaseId,
                                                    oneOffBasket[b].product
                                                      .databaseId
                                                  );
                                                  if (
                                                    productsForCode[a]
                                                      .databaseId ==
                                                    oneOffBasket[b].product
                                                      .databaseId
                                                  ) {
                                                    matchingProducts.push(
                                                      oneOffBasket[b]
                                                    );
                                                    break;
                                                  } else {
                                                  }
                                                }
                                              }

                                              console.log(matchingProducts);

                                              if (matchingProducts.length > 0) {
                                                console.log(purchaseType);
                                                setVoucherApplied(true);
                                                setVoucherFound(true);
                                                vFound = true;
                                                setVoucherInvalid(false);
                                                setAppliedVoucher(voucher);
                                                console.log(matchingProducts);
                                                setMProducts(matchingProducts);
                                              } else {
                                                console.log("no products");
                                                if (
                                                  productsForCode.length == 0
                                                ) {
                                                  console.log(purchaseType);
                                                  setVoucherApplied(true);
                                                  setVoucherFound(true);
                                                  vFound = true;
                                                  setVoucherInvalid(false);
                                                  setAppliedVoucher(voucher);
                                                  console.log(matchingProducts);
                                                  setMProducts(oneOffBasket);
                                                } else {
                                                  console.log("sub");
                                                  console.log(purchaseType);
                                                  setVoucherApplied(false);
                                                  setVoucherFound(true);
                                                  vFound = true;
                                                  setVoucherInvalid(true);
                                                  setVoucherInvalidMsg(
                                                    "You have no valid items in your basket"
                                                  );
                                                }
                                              }
                                            } else {
                                              console.log("sub");
                                              console.log(purchaseType);
                                              setVoucherApplied(false);
                                              setVoucherFound(true);
                                              vFound = true;
                                              setVoucherInvalid(true);
                                              setVoucherInvalidMsg(
                                                "This coupon can only be applied to one-off orders"
                                              );
                                            }
                                          } else {
                                            console.log("limit");
                                            console.log(purchaseType);
                                            setVoucherApplied(false);
                                            setVoucherFound(true);
                                            vFound = true;
                                            setVoucherInvalid(true);
                                            setVoucherInvalidMsg(
                                              "You can only use this voucher once"
                                            );
                                          }

                                          break;
                                        } else {
                                          continue;
                                        }
                                      }

                                      if (!vFound) {
                                        console.log(voucher);
                                        setVoucherInvalid(true);
                                        setVoucherInvalidMsg("Invalid coupon");
                                        setVoucherApplied(false);
                                      }
                                    })
                                    .catch((error) => {
                                      console.log(error);

                                      localStorage.setItem("authtoken", "");

                                      refreshToken({
                                        variables: {
                                          refreshToken:
                                            localStorage.getItem(
                                              "refreshtoken"
                                            ),
                                        },
                                      }).then((data) => {
                                        console.log(data);

                                        localStorage.setItem(
                                          "authtoken",
                                          data.data.refreshToken.authToken
                                        );

                                        checkCoupon({
                                          variables: {
                                            id: id,
                                            coupon: voucher.toLowerCase(),
                                          },
                                        }).then((data) => {
                                          usage =
                                            data.data.checkCouponUsage.usage;

                                          console.log(usage);

                                          setApplyingVoucher(false);

                                          for (
                                            let i = 0;
                                            i < coupons.length;
                                            i++
                                          ) {
                                            if (
                                              coupons[i].code ==
                                              voucher.toLowerCase()
                                            ) {
                                              console.log(
                                                coupons[i].code,
                                                voucher.toLowerCase()
                                              );
                                              console.log(
                                                usage,
                                                coupons[i].limitUsageToXItems
                                              );
                                              if (
                                                usage <
                                                coupons[i].limitUsageToXItems
                                              ) {
                                                if (purchaseType == 0) {
                                                  productsForCode =
                                                    coupons[i].products.nodes;

                                                  let matchingProducts = [];

                                                  for (
                                                    let a = 0;
                                                    a < productsForCode.length;
                                                    a++
                                                  ) {
                                                    for (
                                                      let b = 0;
                                                      b < oneOffBasket.length;
                                                      b++
                                                    ) {
                                                      console.log(
                                                        productsForCode[a]
                                                          .databaseId,
                                                        oneOffBasket[b].product
                                                          .databaseId
                                                      );
                                                      if (
                                                        productsForCode[a]
                                                          .databaseId ==
                                                        oneOffBasket[b].product
                                                          .databaseId
                                                      ) {
                                                        matchingProducts.push(
                                                          oneOffBasket[b]
                                                        );
                                                        break;
                                                      } else {
                                                      }
                                                    }
                                                  }

                                                  console.log(matchingProducts);

                                                  if (
                                                    matchingProducts.length > 0
                                                  ) {
                                                    console.log(purchaseType);
                                                    setVoucherApplied(true);
                                                    setVoucherFound(true);
                                                    vFound = true;
                                                    setVoucherInvalid(false);
                                                    setAppliedVoucher(voucher);
                                                    console.log(
                                                      matchingProducts
                                                    );
                                                    setMProducts(
                                                      matchingProducts
                                                    );
                                                  } else {
                                                    console.log("sub");
                                                    console.log(purchaseType);
                                                    setVoucherApplied(false);
                                                    setVoucherFound(true);
                                                    vFound = true;
                                                    setVoucherInvalid(true);
                                                    setVoucherInvalidMsg(
                                                      "You have no valid items in your basket"
                                                    );
                                                  }
                                                } else {
                                                  console.log("sub");
                                                  console.log(purchaseType);
                                                  setVoucherApplied(false);
                                                  setVoucherFound(true);
                                                  vFound = true;
                                                  setVoucherInvalid(true);
                                                  setVoucherInvalidMsg(
                                                    "This coupon can only be applied to one-off orders"
                                                  );
                                                }
                                              } else {
                                                console.log("limit");
                                                console.log(purchaseType);
                                                setVoucherApplied(false);
                                                setVoucherFound(true);
                                                vFound = true;
                                                setVoucherInvalid(true);
                                                setVoucherInvalidMsg(
                                                  "You can only use this voucher once"
                                                );
                                              }

                                              break;
                                            } else {
                                              continue;
                                            }
                                          }

                                          if (!vFound) {
                                            console.log(voucher);
                                            setVoucherInvalid(true);
                                            setVoucherInvalidMsg(
                                              "Invalid coupon"
                                            );
                                            setVoucherApplied(false);
                                          }
                                        });
                                      });
                                    });
                                }}
                              >
                                {applyingVoucher && (
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
                                <p
                                  className={`font-circe font-[900] text-erniegreen text-center text-lg`}
                                >
                                  Apply Voucher
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          {!managingSubscription && (
                            <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                              <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                                Payment Options
                              </p>
                              <img
                                src="/divider.png"
                                className=" w-full mt-2"
                              ></img>
                              <div className="flex flex-col gap-2 mt-4">
                                {paymentOptions.map((option, index) => (
                                  <div className="" key={index}>
                                    <div
                                      className={`flex flex-row justify-between p-2 rounded-lg ${
                                        selectedPayment == index
                                          ? "bg-erniedarkcream rounded"
                                          : "border-[1px] border-erniegreen"
                                      }`}
                                      onClick={() => {
                                        setSelectedPayment(index);
                                      }}
                                    >
                                      <img className="h-6" src={option.image} />
                                    </div>
                                    {selectedPayment == index && (
                                      <>
                                        {/* {index == 0 && (
                                  <div className="bg-erniedarkcream">
                                    {console.log(period)}
                                    <CheckoutForm
                                      basket={oneOffBasket}
                                      employerUser={customerId}
                                      billing={{
                                        address1: bAddress,
                                        company: businessName,
                                        postcode: bPostcode,
                                        phone: contactNumber,
                                      }}
                                      shipping={{
                                        address1: sAddress,
                                        company: businessName,
                                        postcode: sPostcode,
                                        phone: contactNumber,
                                      }}
                                      shippingLines={[
                                        {
                                          methodId:
                                            purchaseType == 0
                                              ? parseFloat(
                                                  getOneOffSubtotal().toFixed(2)
                                                ) < 80.0
                                                ? "flat_rate"
                                                : "free_shipping"
                                              : managingSubscription
                                              ? parseFloat(
                                                  getCurSubSubTotal().toFixed(2)
                                                ) +
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) <
                                                80.0
                                                ? "flat_rate"
                                                : "free_shipping"
                                              : parseFloat(
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) < 80.0
                                                    ? "flat_rate"
                                                    : "free_shipping"
                                                ),
                                          methodTitle:
                                            purchaseType == 0
                                              ? parseFloat(
                                                  getOneOffSubtotal().toFixed(2)
                                                ) < 80.0
                                                ? "Flat Rate"
                                                : "Free Shipping"
                                              : managingSubscription
                                              ? parseFloat(
                                                  getCurSubSubTotal().toFixed(2)
                                                ) +
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) <
                                                80.0
                                                ? "Flat Rate"
                                                : "Free Shipping"
                                              : parseFloat(
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) < 80.0
                                                    ? "Flat Rate"
                                                    : "Free Shipping"
                                                ),
                                          total:
                                            purchaseType == 0
                                              ? parseFloat(
                                                  getOneOffSubtotal().toFixed(2)
                                                ) < 80.0
                                                ? "8.95"
                                                : "0.0"
                                              : managingSubscription
                                              ? parseFloat(
                                                  getCurSubSubTotal().toFixed(2)
                                                ) +
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) <
                                                80.0
                                                ? "8.95"
                                                : "0.0"
                                              : parseFloat(
                                                  parseFloat(
                                                    getSubSubtotal().toFixed(2)
                                                  ) < 80.0
                                                    ? "8.95"
                                                    : "0.0"
                                                ),
                                        },
                                      ]}
                                      shippingTotal={
                                        purchaseType == 0
                                          ? parseFloat(
                                              getOneOffSubtotal().toFixed(2)
                                            ) < 80.0
                                            ? "8.95"
                                            : "0.0"
                                          : managingSubscription
                                          ? parseFloat(
                                              getCurSubSubTotal().toFixed(2)
                                            ) +
                                              parseFloat(
                                                getSubSubtotal().toFixed(2)
                                              ) <
                                            80.0
                                            ? "8.95"
                                            : "0.0"
                                          : parseFloat(
                                              parseFloat(
                                                getSubSubtotal().toFixed(2)
                                              ) < 80.0
                                                ? "8.95"
                                                : "0.0"
                                            )
                                      }
                                      setOrderComplete={
                                        setOrderCompleteFromBasket
                                      }
                                      setOrderDetails={setOrderDetails}
                                      purchaseType={purchaseType}
                                      billingInterval={interval}
                                      billingPeriod={period}
                                      setProcessingOrder={setProcessingOrder}
                                      setBAddressError={setBAddressError}
                                      setBPostcodeError={setBPostcodeError}
                                      setBusinessNameError={
                                        setBusinessNameError
                                      }
                                      setContactNumberError={
                                        setContactNumberError
                                      }
                                      setSAddressError={setSAddressError}
                                      setSPostcodeError={setSPostcodeError}
                                      bAddress={bAddress}
                                      sAddress={sAddress}
                                      bPostcode={bPostcode}
                                      sPostcode={sPostcode}
                                      contactNumber={contactNumber}
                                      businessName={businessName}
                                      scrollToTop={scrollToTop}
                                      processingOrder={processingOrder}
                                      setUrl={setUrl}
                                      currentUrl={router.asPath}
                                      managingSubscription={
                                        managingSubscription
                                      }
                                      orderDetails={orderDetails}
                                    />
                                  </div>
                                )} */}
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                            <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                              Order Summary
                            </p>
                            <img
                              src="/divider.png"
                              className=" w-full mt-2"
                            ></img>
                            <div className="flex flex-col gap-1 mt-4">
                              {subBasket.map((item, index) => (
                                <div
                                  className="w-full grid grid-cols-4 items-center"
                                  key={index}
                                >
                                  <p className="font-circular text-erniegreen col-span-2 text-sm">
                                    {item.product.type == "SIMPLE"
                                      ? item.product.name
                                      : item.selectedVariant?.name}
                                  </p>
                                  <p className="font-circular text-erniegreen text-sm">
                                    £
                                    {(
                                      parseFloat(
                                        item.product.type == "SIMPLE"
                                          ? item.product.price.replace("£", "")
                                          : item.selectedVariant?.price.replace(
                                              "£",
                                              ""
                                            )
                                      ) * item.quantity
                                    ).toFixed(2)}
                                  </p>
                                  <div className="flex flex-row gap-2 items-center justify-end">
                                    <p className="font-circular text-erniegreen text-right">
                                      {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {oneOffBasket.map((item, index) => (
                                <div
                                  className="w-full grid grid-cols-4 items-center"
                                  key={index}
                                >
                                  <p className="font-circular text-erniegreen col-span-2 text-sm">
                                    {item.product.type == "SIMPLE"
                                      ? item.product.name
                                      : item.selectedVariant?.name}
                                  </p>
                                  <p className="font-circular text-erniegreen text-sm">
                                    £
                                    {(
                                      parseFloat(
                                        item.product.type == "SIMPLE"
                                          ? item.product.price.replace("£", "")
                                          : item.selectedVariant?.price.replace(
                                              "£",
                                              ""
                                            )
                                      ) * item.quantity
                                    ).toFixed(2)}
                                  </p>
                                  <div className="flex flex-row gap-2 items-center justify-end">
                                    <p className="font-circular text-erniegreen text-right">
                                      {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              <div className="w-full h-[1px] bg-erniegreen mt-4"></div>
                              <div className="flex flex-row justify-between mt-4">
                                <p className="font-circular text-erniegreen text-sm">
                                  Delivery Fee
                                </p>
                                <p className="font-circular text-erniegreen text-sm">
                                  £{deliveryAmount.toFixed(2)}
                                </p>
                              </div>
                              {addDonation && (
                                <div className="flex flex-row justify-between mt-2">
                                  <p className="font-circular text-erniegreen text-sm">
                                    Donation
                                  </p>
                                  <p className="font-circular text-erniegreen text-sm">
                                    £{donationAmount.toFixed(2)}
                                  </p>
                                </div>
                              )}
                              {voucherApplied && (
                                <div className="flex flex-row justify-between mt-2">
                                  <p className="font-circular text-erniegreen text-sm font-[500]">
                                    DISCOUNT: {appliedVoucher}
                                  </p>
                                  <p className="font-circular text-erniegreen text-sm">
                                    -
                                    {appliedVoucher == "groundswellstaff"
                                      ? "£" +
                                        (
                                          (purchaseType == 0
                                            ? getOneOffSubtotal()
                                            : getSubSubtotal()) * 0.2
                                        ).toFixed(2)
                                      : purchaseType == 0 &&
                                        mProducts[matchedProduct]?.product
                                          .price}
                                  </p>
                                  {console.log(matchedProduct)}
                                </div>
                              )}
                              <div className="flex flex-row justify-between mt-2">
                                <p className="font-circular font-[900] text-erniegreen">
                                  Total
                                </p>
                                <p className="font-circular font-[900] text-erniegreen text-sm">
                                  £
                                  {managingSubscription
                                    ? (
                                        parseFloat(
                                          getCurSubSubTotal().toFixed(2)
                                        ) +
                                        parseFloat(
                                          getSubSubtotal().toFixed(2)
                                        ) +
                                        parseFloat(deliveryAmount.toFixed(2)) +
                                        parseFloat(donationAmount.toFixed(2)) +
                                        parseFloat(voucherAmount.toFixed(2))
                                      ).toFixed(2)
                                    : purchaseType == 0
                                    ? (
                                        parseFloat(
                                          getOneOffSubtotal().toFixed(2)
                                        ) +
                                        parseFloat(deliveryAmount.toFixed(2)) +
                                        parseFloat(donationAmount.toFixed(2)) +
                                        parseFloat(voucherAmount.toFixed(2))
                                      ).toFixed(2)
                                    : (
                                        parseFloat(
                                          getSubSubtotal().toFixed(2)
                                        ) +
                                        parseFloat(deliveryAmount.toFixed(2)) +
                                        parseFloat(donationAmount.toFixed(2)) +
                                        parseFloat(voucherAmount.toFixed(2))
                                      ).toFixed(2)}
                                </p>
                              </div>
                              {purchaseType == 1 && (
                                <p className="font-circular font-[500] text-erniegreen text-right">
                                  {period == "week" && interval == 1
                                    ? "Every week"
                                    : period == "week" && interval == 2
                                    ? "Every other week"
                                    : period == "month" && interval == 1
                                    ? "Every month"
                                    : period == "month" && interval == 2
                                    ? "Every other month"
                                    : ""}
                                </p>
                              )}
                            </div>
                          </div>
                          {console.log(subAdjBasket)}
                          <div className="flex flex-col p-6 bg-ernieteal rounded-xl">
                            <p className="font-circular text-erniecream text-sm">
                              Experience issues ordering? Please get in touch
                              with our team:
                            </p>
                            <div className="w-full h-px bg-erniecream my-2"></div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <a
                                className="bg-erniegold rounded-lg p-2 font-circe font-[900] text-erniegreen text-center"
                                href="tel:07711834804"
                              >
                                Phone
                              </a>
                              <a
                                className="bg-erniegold rounded-lg p-2 font-circe font-[900] text-erniegreen text-center"
                                href="mailto:hello@ernie.london"
                              >
                                Email
                              </a>
                            </div>
                            {/* <a
                      className="font-circular text-erniecream text-md mb-1"
                      href="tel:07711834804"
                    >
                      <span className="text-erniecream">Phone:</span>{" "}
                      07711834804
                    </a>
                    <a
                      className="font-circular text-erniecream text-md"
                      href="mailto:hello@ernie.london"
                    >
                      <span className="text-erniecream">Email:</span>{" "}
                      hello@ernie.london
                    </a> */}
                          </div>
                          <div
                            className={`bg-erniegold rounded-xl w-full p-2 flex flex-row justify-center items-center cursor-pointer`}
                            onClick={(e) => {
                              if (managingSubscription) {
                                console.log(donationAmount);
                                console.log(addDonation);

                                console.log(products);

                                let donationProduct = {};

                                for (let i = 0; i < products.length; i++) {
                                  if (products[i].databaseId == 3723) {
                                    donationProduct = products[i];
                                  }
                                }

                                if (addDonation) {
                                  subAdjBasket.push({
                                    product: { node: donationProduct },
                                    quantity: donationAmount,
                                  });
                                }

                                console.log(subAdjBasket);

                                updatePlan(subAdjBasket);
                                // updatePlanFrequency({
                                //   id: subscriptions.data.subscription.subscription
                                //     .databaseId,
                                //   billingInterval: interval + "",
                                //   billingPeriod: period,
                                // });
                                setProcessingOrder(true);
                              } else {
                                if (selectedPayment == 1) {
                                  handleSubmit();
                                } else if (selectedPayment == 0) {
                                  setCollectingCardDetails(true);
                                }
                              }
                            }}
                          >
                            {console.log(selectedPayment)}
                            {processingOrder && (
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

                            <p
                              className={`font-circe font-[900] text-erniegreen text-center text-lg`}
                            >
                              {managingSubscription
                                ? "Update Subscription"
                                : selectedPayment == 0
                                ? "Pay by Card"
                                : "Pay By Invoice"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="absolute right-0 top-20 h-[calc(100%-80px)] lg:h-[calc(100vh-80px)] w-full bg-erniedarkcream p-6 lg:p-10 z-[990] flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-10 overflow-auto">
              <div className="flex flex-col gap-4">
                {subBasket.length == 0 && oneOffBasket.length == 0 ? (
                  <p className="font-circular text-erniegreen text-center">
                    Your basket is currently empty
                  </p>
                ) : purchaseType == 0 && oneOffBasket.length == 0 ? (
                  <p className="font-circular text-erniegreen text-center">
                    Your basket is currently empty
                  </p>
                ) : purchaseType == 1 && subBasket.length == 0 ? (
                  <p className="font-circular text-erniegreen text-center">
                    Your basket is currently empty
                  </p>
                ) : (
                  <>
                    {(hasSubscription || subBasket.length != 0) &&
                      purchaseType == 1 && (
                        <>
                          {managingSubscription && (
                            <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                              <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                                Current Subscription
                              </p>
                              <img
                                src="/divider.png"
                                className="w-fill mt-2"
                              ></img>
                              <div className="flex flex-col gap-1 mt-4">
                                {console.log(
                                  subscriptions.data.subscription.subscription
                                    .lineItems.nodes
                                )}
                                {subscriptions?.subscriptions
                                  ? subscriptions.subscriptions.data.subscription.subscription.lineItems.nodes.map(
                                      (item, index) => (
                                        <div
                                          className="w-full grid grid-cols-4 items-center"
                                          key={index}
                                        >
                                          <p className="font-circular text-erniegreen col-span-2 text-sm">
                                            {item.product.node.type == "SIMPLE"
                                              ? item.product.node.name
                                              : item.variation.node.name}
                                          </p>
                                          <p className="font-circular text-erniegreen col-span-1 text-sm">
                                            {item.product.node.type == "SIMPLE"
                                              ? item.product.node.price
                                              : item.variation.node.price}
                                          </p>
                                          <p className="font-circular text-erniegreen col-span-1 text-sm text-right">
                                            {item.quantity}
                                          </p>
                                        </div>
                                      )
                                    )
                                  : subscriptions.data.subscription.subscription.lineItems.nodes.map(
                                      (item, index) => (
                                        <div
                                          className="w-full grid grid-cols-4 items-center"
                                          key={index}
                                        >
                                          <p className="font-circular text-erniegreen col-span-2 text-sm">
                                            {item.product.node.type == "SIMPLE"
                                              ? item.product.node.name
                                              : item.variation.node.name}
                                          </p>
                                          <p className="font-circular text-erniegreen col-span-1 text-sm">
                                            {item.product.node.type == "SIMPLE"
                                              ? item.product.node.price
                                              : item.variation.node.price}
                                          </p>
                                          <p className="font-circular text-erniegreen col-span-1 text-sm text-right">
                                            {item.quantity}
                                          </p>
                                        </div>
                                      )
                                    )}
                              </div>
                            </div>
                          )}
                          <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                            <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                              Add To Subscription
                            </p>
                            {console.log(subscriptions)}
                            <img
                              src="/divider.png"
                              className=" w-full mt-2"
                            ></img>

                            <div className="flex flex-col gap-1 mt-4">
                              {subBasket.map((item, index) => (
                                <div
                                  className="w-full grid grid-cols-4 items-center"
                                  key={index}
                                >
                                  <p className="font-circular text-erniegreen col-span-2 text-sm">
                                    {item.product.type == "SIMPLE"
                                      ? item.product.name
                                      : item.selectedVariant.name}
                                  </p>
                                  <p className="font-circular text-erniegreen text-sm">
                                    £
                                    {(
                                      parseFloat(
                                        item.product.type == "SIMPLE"
                                          ? item.product.price.replace("£", "")
                                          : item.selectedVariant.price.replace(
                                              "£",
                                              ""
                                            )
                                      ) * item.quantity
                                    ).toFixed(2)}
                                  </p>
                                  <div className="flex flex-row gap-2 items-center justify-end">
                                    <div
                                      className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                                      onClick={() => decSubQuantity(index)}
                                    >
                                      <img
                                        src="/remove-green.svg"
                                        className="w-3 h-3"
                                      ></img>
                                    </div>
                                    <p className="font-circular text-erniegreen text-right">
                                      {item.quantity}
                                    </p>
                                    <div
                                      className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                                      onClick={() => incSubQuantity(index)}
                                    >
                                      <img
                                        src="/add-green.svg"
                                        className="w-3 h-3"
                                      ></img>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                            <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                              Subscription Frequency
                            </p>
                            <img
                              src="/divider.png"
                              className=" w-full mt-2"
                            ></img>
                            {purchaseType == 1 && (
                              <p className="font-circular text-erniegreen font-[500] text-sm mt-2">
                                Note: This is change your entire subscriptions
                                frequency.
                              </p>
                            )}
                            <select
                              name="frequency"
                              disabled={managingSubscription}
                              onChange={(e) => {
                                setNewSubFrequency(
                                  e.target.value.toUpperCase()
                                );

                                console.log(e.target.value);
                                switch (e.target.value) {
                                  case "weekly":
                                    setInterval(1);
                                    setPeriod("week");
                                    break;
                                  case "bi-weekly":
                                    setInterval(2);
                                    setPeriod("week");
                                    break;
                                  case "monthly":
                                    setInterval(1);
                                    setPeriod("month");
                                    break;
                                  case "bi-monthly":
                                    setInterval(2);
                                    setPeriod("month");
                                    break;
                                }
                              }}
                              className="mt-4 border-[1px] border-erniegreen bg-erniecream rounded-lg font-circular px-2 py-2 text-erniegreen text-sm font-[500]"
                            >
                              <option
                                value="weekly"
                                selected={
                                  subscriptions.data.subscription.subscription
                                    ? subscriptions.data.subscription
                                        .subscription?.billingPeriod ==
                                        "week" &&
                                      subscriptions.data.subscription
                                        .subscription.billingInterval == "1"
                                    : true
                                }
                              >
                                Weekly
                              </option>
                              <option
                                value="bi-weekly"
                                selected={
                                  subscriptions.data.subscription.subscription
                                    ?.billingPeriod == "week" &&
                                  subscriptions.data.subscription.subscription
                                    .billingInterval == "2"
                                }
                              >
                                {"Bi-weekly (once every two weeks)"}
                              </option>
                              <option
                                value="monthly"
                                selected={
                                  subscriptions.data.subscription.subscription
                                    ?.billingPeriod == "month" &&
                                  subscriptions.data.subscription.subscription
                                    .billingInterval == "1"
                                }
                              >
                                Monthly
                              </option>
                              <option
                                value="bi-monthly"
                                selected={
                                  subscriptions.data.subscription.subscription
                                    ?.billingPeriod == "month" &&
                                  subscriptions.data.subscription.subscription
                                    .billingInterval == "2"
                                }
                              >
                                {"Bi-monthly (once every two months)"}
                              </option>
                            </select>
                            {managingSubscription && (
                              <p className="font-circular text-red-500 font-[500] text-xs mt-2">
                                The subscription can only be adjusted by
                                visiting Manage Plan
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    {oneOffBasket.length != 0 && purchaseType == 0 && (
                      <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                        <p className="font-circe text-xl text-erniegreen font-[900] uppercase">
                          My One Off Basket
                        </p>
                        <img src="/divider.png" className=" w-full mt-2"></img>
                        <div className="flex flex-col mt-4 gap-1">
                          {oneOffBasket.map((item, index) => (
                            <div
                              className="w-full grid grid-cols-4 items-center"
                              key={index}
                            >
                              <p className="font-circular text-erniegreen col-span-2 text-sm">
                                {console.log(item)}
                                {item.product.type == "SIMPLE"
                                  ? item.product.name
                                  : item.selectedVariant?.name}
                              </p>
                              <p className="font-circular text-erniegreen text-sm">
                                {item.product.type == "SIMPLE"
                                  ? `£
                                ${(
                                  parseFloat(
                                    item.product.price.replace("£", "")
                                  ) * item.quantity
                                ).toFixed(2)}`
                                  : `£
                                ${(
                                  parseFloat(
                                    item.selectedVariant?.price.replace("£", "")
                                  ) * item.quantity
                                ).toFixed(2)}`}
                              </p>
                              <div className="flex flex-row gap-2 items-center justify-end">
                                <div
                                  className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                                  onClick={() => decOneOffQuantity(index)}
                                >
                                  <img
                                    src="/remove-green.svg"
                                    className="w-3 h-3"
                                  ></img>
                                </div>
                                <p className="font-circular text-erniegreen text-right">
                                  {item.quantity}
                                </p>
                                <div
                                  className="flex flex-col justify-center items-center border-[1px] border-erniegreen rounded-full aspect-[1/1] p-1 min-w-[22px] max-h-[20px] cursor-pointer"
                                  onClick={() => incOneOffQuantity(index)}
                                >
                                  <img
                                    src="/add-green.svg"
                                    className="w-3 h-3"
                                  ></img>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-ernieteal rounded-xl p-6 flex flex-col">
                  <div className="flex flex-row justify-between">
                    <img
                      src="/groundswellimg.jpg"
                      className="bg-groundswell w-36 p-2 object-cover rounded-lg"
                    ></img>
                    <div className="flex flex-row">
                      <div
                        onClick={(e) => {
                          openCapacitorSite("https://groundswell.org.uk/");
                        }}
                      >
                        <img
                          src="/Language icon wght200.svg"
                          className="w-10 h-10"
                        ></img>
                      </div>
                      <img
                        src="/info.svg"
                        className="w-10 h-10"
                        onClick={(e) => {
                          setShowingInfo(true);
                        }}
                      ></img>
                    </div>
                  </div>
                  <p className="font-circe font-[900] uppercase text-erniecream text-xl mt-4">
                    Donate to Groundswell
                  </p>

                  <p className="font-circular font-[500] text-erniecream">
                    Add a £1 donation to Groundswell to your order
                  </p>
                  <div className="flex flex-row mt-2 items-center gap-2">
                    <div className="grid grid-cols-4 gap-2 w-full">
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="donation"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          £0.00
                        </label>
                        <input
                          type="radio"
                          name="donation"
                          defaultChecked={true}
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 cursor-pointer"
                          value={"0.0"}
                          onChange={(e) => {
                            setDonation(false);
                            setDonationAmount(0.0);
                          }}
                        ></input>
                      </div>
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="donation"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          £1.00
                        </label>
                        <input
                          type="radio"
                          name="donation"
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 cursor-pointer"
                          value={"1.0"}
                          onChange={(e) => {
                            setDonation(true);
                            setDonationAmount(1.0);
                          }}
                        ></input>
                      </div>
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="donation"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          £2.00
                        </label>
                        <input
                          type="radio"
                          name="donation"
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 cursor-pointer"
                          value={"2.0"}
                          onChange={(e) => {
                            setDonation(true);
                            setDonationAmount(2.0);
                          }}
                        ></input>
                      </div>
                      <div className="flex flex-row gap-2 relative">
                        <label
                          htmlFor="donation"
                          className="font-circular text-erniegreen text-sm font-[500] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-full text-center pointer-events-none"
                        >
                          £5.00
                        </label>
                        <input
                          type="radio"
                          name="donation"
                          className="bg-erniecream border-[1px] border-erniegreen appearance-none flex w-full checked:bg-erniegold checked:border-erniegold rounded-lg h-10 cursor-pointer"
                          value={"5.0"}
                          onChange={(e) => {
                            setDonation(true);
                            setDonationAmount(5.0);
                          }}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-erniecream rounded-xl p-6 flex flex-col">
                  <p className="font-circular font-[900] text-erniegreen">
                    Subtotal
                  </p>

                  {managingSubscription && (
                    <div className="flex flex-row justify-between mt-2">
                      <p className="font-circular text-erniegreen text-sm">
                        Current subscription
                      </p>

                      <p className="font-circular font-[900] text-erniegreen text-sm">
                        £{getCurSubSubTotal().toFixed(2)}
                      </p>
                    </div>
                  )}
                  {purchaseType == 1 && (
                    <div className="flex flex-row justify-between mt-2">
                      <p className="font-circular text-erniegreen text-sm">
                        {managingSubscription
                          ? "New items"
                          : "Subscription items"}
                      </p>

                      <p className="font-circular font-[900] text-erniegreen text-sm">
                        £{getSubSubtotal().toFixed(2)}
                      </p>
                    </div>
                  )}
                  {purchaseType == 0 && (
                    <div className="flex flex-row justify-between">
                      <p className="font-circular text-erniegreen text-sm">
                        One off items
                      </p>
                      <p className="font-circular font-[900] text-erniegreen text-sm">
                        £{getOneOffSubtotal().toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="w-full h-[1px] bg-erniegreen mt-4"></div>
                  <div className="flex flex-row justify-between mt-4">
                    <p className="font-circular text-erniegreen text-sm">
                      Delivery Fee
                    </p>
                    <p className="font-circular text-erniegreen text-sm">
                      £{deliveryAmount.toFixed(2)}
                    </p>
                  </div>
                  {addDonation && (
                    <div className="flex flex-row justify-between mt-2">
                      <p className="font-circular text-erniegreen text-sm">
                        Donation
                      </p>
                      <p className="font-circular text-erniegreen text-sm">
                        £{donationAmount.toFixed(2)}
                      </p>
                    </div>
                  )}
                  {voucherApplied && (
                    <div className="flex flex-row justify-between mt-2">
                      <p className="font-circular text-erniegreen text-sm font-[500]">
                        DISCOUNT: {appliedVoucher}
                      </p>
                      <p className="font-circular text-erniegreen text-sm">
                        -
                        {purchaseType == 0 &&
                          oneOffBasket[oneOffBasket.length - 1]?.product?.price}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-row justify-between mt-2">
                    <p className="font-circular font-[900] text-erniegreen">
                      Total
                    </p>
                    <p className="font-circular font-[900] text-erniegreen text-sm">
                      £
                      {managingSubscription
                        ? (
                            parseFloat(getCurSubSubTotal().toFixed(2)) +
                            parseFloat(getSubSubtotal().toFixed(2)) +
                            parseFloat(deliveryAmount.toFixed(2)) +
                            parseFloat(donationAmount.toFixed(2)) +
                            parseFloat(voucherAmount.toFixed(2))
                          ).toFixed(2)
                        : purchaseType == 0
                        ? (
                            parseFloat(getOneOffSubtotal().toFixed(2)) +
                            parseFloat(deliveryAmount.toFixed(2)) +
                            parseFloat(donationAmount.toFixed(2)) +
                            parseFloat(voucherAmount.toFixed(2))
                          ).toFixed(2)
                        : (
                            parseFloat(getSubSubtotal().toFixed(2)) +
                            parseFloat(deliveryAmount.toFixed(2)) +
                            parseFloat(donationAmount.toFixed(2)) +
                            parseFloat(voucherAmount.toFixed(2))
                          ).toFixed(2)}
                    </p>
                  </div>
                  {purchaseType == 1 && (
                    <p className="font-circular tedt-erniegreen italic text-sm text-right">
                      Every {interval == 2 && "other"} {period}
                    </p>
                  )}
                </div>
                {subBasket.length == 0 && oneOffBasket.length == 0 ? (
                  <></>
                ) : (
                  <div
                    className={`bg-erniegold rounded-xl w-full p-2 ${
                      hasSubscription
                        ? "opacity-100 cursor-pointer"
                        : purchaseType != -1
                        ? "opacity-100 cursor-pointer"
                        : "opacity-50"
                    }`}
                    onClick={() => {
                      if (purchaseType == 1) {
                        setShowingCheckout(true);

                        let tempSubAdj = [];

                        let arr = [];

                        arr =
                          subscriptions?.data?.subscription?.subscription
                            ?.lineItems?.nodes;

                        if (managingSubscription) {
                          if (arr?.length > 0) {
                            for (let i = 0; i < arr.length; i++) {
                              tempSubAdj.push(arr[i]);
                            }

                            for (let j = 0; j < subBasket.length; j++) {
                              tempSubAdj.push({
                                product: { node: subBasket[j].product },
                                quantity: subBasket[j].quantity,
                              });
                            }
                          }

                          console.log(tempSubAdj);

                          setSubAdjBasket(tempSubAdj);
                        }
                      } else {
                        setShowingCheckout(true);
                      }
                    }}
                  >
                    <p className="font-circe font-[900] text-erniegreen text-center text-lg">
                      Checkout
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
