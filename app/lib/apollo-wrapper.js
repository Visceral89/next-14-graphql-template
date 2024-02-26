"use client";

import { ApolloClient, ApolloLink, HttpLink } from "@apollo/client";
import {
	ApolloNextAppProvider,
	NextSSRInMemoryCache,
	SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";

function makeClient() {
	const httpLink = new HttpLink({
		// GraphQL Endpoint
		uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
	});

	return new NextSSRApolloClient({
		cache: new NextSSRInMemoryCache(),
		link:
			typeof window === "undefined"
				? ApolloLink.from([
						new SSRMultipartLink({
							stripDefer: true,
						}),
						httpLink,
				  ])
				: httpLink,
	});
}

export function ApolloWrapper({ children }) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}

// When using the data:
/*
import { gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { cookies } from "next/headers";


const USER_QUERY = gql`
  query Query {
    user {
      id
      firstName
      email
      phone
    }
  }
`;


const UserProfile = async () => {
  const client = getClient();
  const ourCookies = cookies();

  let token = await ourCookies.get("jwtToken")!.value;

  let jwtToken = JSON.parse(token);

  const { data } = await client.query({
    query: USER_QUERY,
    context: {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  });
  console.log("🚀 ~ user ~ data:", data?.user);
  return (
    <>
      <h1>{data?.user?.firstName}</h1>
      <h2>{data?.user?.email}</h2>
    </>
  );
};
*/
