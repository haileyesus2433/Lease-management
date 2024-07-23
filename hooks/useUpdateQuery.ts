"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeReq } from "@/constants";
import toast from "react-hot-toast";

type ResponseType = {
  response: { data: { message: string } };
};
export const useUpdateRQuery = <T>(
  datatype: T,
  url: string,
  key: string[],
  id?: string,
  hideModal?: () => void,
  redirectUrl: string | null = null
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: key,
    mutationFn: async (data: any) => {
      const endpoint = id ? `${url}/${id}` : url;
      return (await makeReq.put(endpoint, data)).data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      if (hideModal) hideModal();
      return data;
    },
    onError: (error: ResponseType, variables, context) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
    onSettled: async (_, error, variables) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
};
