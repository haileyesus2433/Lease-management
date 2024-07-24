export const calculateLeaseDuration = (
  startDate: Date | string,
  endDate: Date | string
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return months + 1;
};

export const calculateTotalRent = (monthlyRent: number, months: number) => {
  return monthlyRent * months;
};

export const calculateAnnualRentIncrease = (
  monthlyRent: number,
  months: number,
  percentage: number
) => {
  const annualIncrease = monthlyRent * (percentage / 100);
  return annualIncrease * (months / 12);
};

export const calculateTotalMaintenance = (
  maintenanceFees: number,
  months: number
) => {
  return maintenanceFees * months;
};

export const calculateTotalCost = (
  totalRent: number = 0,
  securityDeposit: number = 0,
  additionalCharges: number = 0,
  totalMaintenance: number = 0,
  annualRentIncrease: number = 0
) => {
  return (
    totalRent +
    +securityDeposit +
    +additionalCharges +
    +totalMaintenance +
    +annualRentIncrease
  ).toFixed(2);
};

export const calculateTotalFromLease = (lease: any) => {
  const leaseDuration = calculateLeaseDuration(
    lease?.leaseStartDate,
    lease?.leaseEndDate
  );
  const totalRent = calculateTotalRent(+lease?.monthlyRent, leaseDuration);
  const annualRentIncrease = calculateAnnualRentIncrease(
    +lease?.monthlyRent,
    leaseDuration,
    +lease?.annualRentIncreasePercentage
  );
  const totalMaintenance = calculateTotalMaintenance(
    +lease?.maintenanceFees,
    leaseDuration
  );
  const totalCost = calculateTotalCost(
    totalRent,
    +lease?.securityDeposit,
    +lease?.additionalCharges,
    totalMaintenance,
    annualRentIncrease
  );

  return totalCost;
};
