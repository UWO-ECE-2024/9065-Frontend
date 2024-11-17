export type ProductPageProps = {
  params: {
    name: string;
  };
};

export type Props = {
  params: Promise<{ category?: string; query?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
