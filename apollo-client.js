import {
    ApolloClient,
    ApolloLink,
    InMemoryCache,
    createHttpLink,
  } from "@apollo/client";
  
  import { setContext } from "@apollo/client/link/context";
  import { onError } from "@apollo/client/link/error";
  
  const httpLink = createHttpLink({
    url: "/graphql",
    credentials: "include",
  });
  
  const authLink = setContext((_, { headers }) => {
    //console.log(token);
    const token = process.browser ? localStorage.getItem("authtoken") : null;
    const refresh = process.browser ? localStorage.getItem("refreshtoken") : null;
  
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
  
  /**
   * Middleware operation
   * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
   */
  export const middleware = new ApolloLink((operation, forward) => {
    /**
     * If session data exist in local storage, set value as session header.
     */
    const session = process.browser ? localStorage.getItem("woo-session") : null;
    const token = process.browser ? localStorage.getItem("authtoken") : null;
    
  
    if (session) {
      operation.setContext(({ headers }) => ({
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
          "woocommerce-session": `Session ${session}`,
        },
      }));
    }
  
    return forward(operation);
  });
  
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log("ERROR");
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });
  
  /**
   * Afterware operation.
   *
   * This catches the incoming session token and stores it in localStorage, for future GraphQL requests.
   */
  export const afterware = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      if (!process.browser) {
        return response;
      }
  
      /**
       * Check for session header and update session in local storage accordingly.
       */
      const context = operation.getContext();
      const {
        response: { headers },
      } = context;
  
      const session = headers.get("woocommerce-session");
  
      if (session) {
        // Remove session data if session destroyed.
        if ("false" === session) {
          localStorage.removeItem("woo-session");
  
          // Update session new data if changed.
        } else if (localStorage.getItem("woo-session") !== session) {
          localStorage.setItem("woo-session", headers.get("woocommerce-session"));
        }
      }
  
      return response;
    });
  });
  
  // Apollo GraphQL client.
  const graphqlClient = new ApolloClient({
    link: authLink.concat(
      errorLink.concat(
        middleware.concat(
          afterware.concat(
            createHttpLink({
              uri: "https://ernie.london/graphql",
            })
          )
        )
      )
    ),
    cache: new InMemoryCache(),
  });


export default graphqlClient;