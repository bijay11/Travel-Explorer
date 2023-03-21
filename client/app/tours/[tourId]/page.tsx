import { Suspense } from "react";
import type { Metadata } from "next";
import { getTour } from "@/fetchData/getTour";

type Params = {
  params: {
    tourId: string;
  };
};

export async function generateMetadata({
  params: { tourId },
}: Params): Promise<Metadata> {
  const {
    data: { document },
  } = await getTour(tourId);

  return {
    title: document.name,
    description: `Details page of ${document.name}`,
  };
}

export default async function TourPage({ params: { tourId } }: Params) {
  const {
    data: { document },
  } = await getTour(tourId);

  // THIS PAGE IS CREATED JUST TO MAKE SURE IT WORKS, STYLE THE LAYOUT LATER.
  return (
    <>
      <h4>{document.name}</h4>
      <h4>{document.price}</h4>
    </>
  );
}
