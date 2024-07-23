"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeReq } from "@/constants";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
type ResponseType = {
  response: { data: { message: string } };
};

export const usePostMutationRQuery = <T>(
  datatype: T,
  url: string,
  key: unknown[],
  hidemodal?: () => void,
  redirectUrl?: string | null
) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: key,
    mutationFn: async (data: typeof datatype) => {
      return (await makeReq.post(url, data)).data;
    },
    onSuccess(data, variables, context) {
      if (hidemodal) {
        hidemodal();
      }
      if (redirectUrl) {
        router.push(redirectUrl);
      }
      toast.success(data.message || "Created Successfully");
      // if(redirectUrl)navigate(redirectUrl)
    },
    onError(error: ResponseType, variables, context) {
      toast.error(error.response.data.message);
    },

    onSettled: async (data, error, variables, context) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
};
