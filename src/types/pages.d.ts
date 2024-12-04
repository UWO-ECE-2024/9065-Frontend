export type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export type Props = {
  params: Promise<{ category?: string; query?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
