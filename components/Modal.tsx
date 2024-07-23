"use client";

import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Modal({
  showModal,
  handleOpenChange,
  children,
}: {
  showModal: boolean;
  handleOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog
      defaultOpen={showModal}
      open={showModal}
      onOpenChange={handleOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="overflow-y-hidden">{children}</DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
