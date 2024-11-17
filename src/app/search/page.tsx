import React from "react";
import ContentPage from "./content-page";
import { Metadata, ResolvingMetadata } from "next";
import { Props } from "@/types/pages";

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const category = (await searchParams).category;
  const query = (await searchParams).query;

  return {
    title: category ? `${category} Products` : "Search Results",
    description: category
      ? `View all ${category} products`
      : `Search results for "${query}"`,
    openGraph: {
      title: category ? `${category} Products` : "Search Results",
    },
  };
}

const page = (props: Props) => {
  return <ContentPage {...props} />;
};

export default page;
