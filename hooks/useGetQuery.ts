"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { makeReq } from "@/constants";

export const useGetPaginatedRQuery = <T>(
  dataType: T,
  url: string,
  key: unknown[],
  page?: number,
  limit: any = 10,
  filter?: any
) => {
  return useQuery({
    queryKey: [...key],
    queryFn: async () => {
      return (
        await makeReq.get(`${url}?page=${page}&limit=${limit}&filter=${filter}`)
      ).data.data;
    },
    placeholderData: keepPreviousData,
  });
};
