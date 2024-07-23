"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  calculateAnnualRentIncrease,
  calculateLeaseDuration,
  calculateTotalCost,
  calculateTotalMaintenance,
  calculateTotalRent,
} from "../../lib/calculations";
import { leaseSchema } from "@/lib/validations";
import { usePostMutationRQuery } from "@/hooks/usePostQuery";
import { ADD_LEASE } from "@/constants";
import { useUpdateRQuery } from "@/hooks/useUpdateQuery";
import { useSearchParams } from "next/navigation";
import { convertDate, formatDate } from "@/lib/utils";

type LeaseFormProp = {
  type?: string;
  leaseDetails?: any;
  hideModal?: () => void;
};

type LeaseFormData = z.infer<typeof leaseSchema>;
export default function LeaseForm(prop: LeaseFormProp) {
  const form = useForm<LeaseFormData>({
    defaultValues:
      {
        ...prop.leaseDetails,
        leaseStartDate: formatDate(prop.leaseDetails?.leaseStartDate),
        leaseEndDate: formatDate(prop.leaseDetails?.leaseEndDate),
        utilitiesIncluded: prop.leaseDetails?.utilitiesIncluded.toString(),
      } || {},
    resolver: zodResolver(leaseSchema),
  });

  const leaseStartDate = form.watch("leaseStartDate");
  const leaseEndDate = form.watch("leaseEndDate");
  const monthlyRent = form.watch("monthlyRent");
  const securityDeposit = form.watch("securityDeposit");
  const additionalCharges = form.watch("additionalCharges");
  const annualRentIncreasePercentage = form.watch(
    "annualRentIncreasePercentage"
  );
  const maintenanceFees = form.watch("maintenanceFees");

  const leaseDurationMonths = calculateLeaseDuration(
    leaseStartDate,
    leaseEndDate
  );
  const totalRent = calculateTotalRent(+monthlyRent, leaseDurationMonths);
  const annualRentIncrease = calculateAnnualRentIncrease(
    +monthlyRent,
    leaseDurationMonths,
    +annualRentIncreasePercentage
  );
  const totalMaintenance = calculateTotalMaintenance(
    +maintenanceFees,
    leaseDurationMonths
  );
  const totalCost = calculateTotalCost(
    totalRent,
    +securityDeposit,
    +additionalCharges,
    totalMaintenance,
    annualRentIncrease
  );

  const params = useSearchParams();
  const filter = params.get("filter") || "private";
  const page = params.get("page") || 1;

  const { mutate: createLease } = usePostMutationRQuery(
    {} as any,
    ADD_LEASE,
    [`lease ${filter} ${page}`],
    prop.hideModal
  );
  const { mutate: updateLease } = useUpdateRQuery(
    {} as any,
    ADD_LEASE,
    [`lease ${filter} ${page}`],
    prop.leaseDetails?.id,
    prop.hideModal
  );
  const onSubmit = (data: LeaseFormData) => {
    if (prop.type === "edit") {
      updateLease(data);
    } else {
      createLease(data);
    }
  };

  return (
    <main className="flex h-full justify-center items-center">
      <div className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="leaseStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Start date"
                          {...field}
                          value={field.value?.toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="leaseEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="End date"
                          {...field}
                          value={field.value?.toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="monthlyRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly rent</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Monthly rent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="securityDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security deposit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Security deposit"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="additionalCharges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional charges</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Additional charges"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="annualRentIncreasePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent Increase Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Rent Increase Percentage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="maintenanceFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance fees</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Maintenance fees"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="latePaymentPenalty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Late payment penalty</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Late payment penalty"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="leaseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lease type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select lease type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="residential">
                            Residential
                          </SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="utilitiesIncluded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Utilities included</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="utilities included" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={"false"}>No</SelectItem>
                          <SelectItem value={"true"}>Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">Total: ${totalCost}</div>
              <Button type="submit" className="w-full gap-2">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
