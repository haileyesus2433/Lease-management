import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { useState } from "react";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmationAction: (email:string) => void;
  message?: string;
};

export function ShareLease({
  open,
  setOpen,
  confirmationAction,
  message,
}: Props) {
  const [email, setEmail] = useState("");
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sharing Lease</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <Input
            placeholder="email@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>{confirmationAction(email)}}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
