"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSearchParams, useRouter } from "next/navigation";
import { generateUrlQuery } from "@/lib/utils";

type FilterPropType = {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
};

const Filter = ({
  filters,
  containerClasses,
  otherClasses,
}: FilterPropType) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filterParam = searchParams.get("filter");

  const handleFilterChange = (value: string) => {
    const newUrl = generateUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleFilterChange}
        defaultValue={filterParam || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border
            border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
