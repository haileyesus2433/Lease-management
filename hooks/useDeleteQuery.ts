"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeReq } from "@/constants";
import toast from "react-hot-toast";

export const useDeleteRQuery = (
  key: string,
  url: string,
  hidemodal?: () => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [key],
    mutationFn: async () => {
      await makeReq.delete(`${url}`);
    },
    onSuccess() {
      if (hidemodal) {
        hidemodal();
      }
      toast.success("Deleted Successfully");
    },
    onError() {
      if (hidemodal) {
        hidemodal();
      }
      toast.error("Deleted Failed");
    },
    onSettled: async (_, error) => {
      if (error) {
      } else {
        await queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
  });
};
