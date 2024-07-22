-- CreateEnum
CREATE TYPE "LeaseType" AS ENUM ('residential', 'commercial');

-- CreateTable
CREATE TABLE "Lease" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leaseStartDate" TIMESTAMP(3) NOT NULL,
    "leaseEndDate" TIMESTAMP(3),
    "monthlyRent" DOUBLE PRECISION NOT NULL,
    "securityDeposit" DOUBLE PRECISION NOT NULL,
    "additionalCharges" DOUBLE PRECISION,
    "annualRentIncreasePercentage" DOUBLE PRECISION NOT NULL,
    "leaseType" "LeaseType" NOT NULL,
    "utilitiesIncluded" BOOLEAN NOT NULL,
    "maintenanceFees" DOUBLE PRECISION,
    "latePaymentPenalty" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Lease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedLease" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leaseId" TEXT NOT NULL,

    CONSTRAINT "SharedLease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SharedLeaseToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SharedLeaseToUser_AB_unique" ON "_SharedLeaseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SharedLeaseToUser_B_index" ON "_SharedLeaseToUser"("B");

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedLease" ADD CONSTRAINT "SharedLease_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SharedLeaseToUser" ADD CONSTRAINT "_SharedLeaseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "SharedLease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SharedLeaseToUser" ADD CONSTRAINT "_SharedLeaseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
