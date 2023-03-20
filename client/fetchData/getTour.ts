export const getTour = async (tourId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tours/${tourId}`
  );
  if (!res.ok) throw new Error("failed to fetch tour");

  return res.json();
};
