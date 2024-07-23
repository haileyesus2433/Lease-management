"use client";
import { generateUrlQuery } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationPropsType = {
  pageNumber: number;
  hasNext: boolean;
};

const Pagination = ({ hasNext, pageNumber }: PaginationPropsType) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction.toLowerCase() === "next" ? pageNumber + 1 : pageNumber - 1;

    const newUrl = generateUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  if (!hasNext && pageNumber === 1) return null;

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("previous")}
        className="light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2"
      >
        <p className="body-medium text-dark200_light800">Previous</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5  py-2 ">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!hasNext}
        onClick={() => handleNavigation("next")}
        className="light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2"
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
