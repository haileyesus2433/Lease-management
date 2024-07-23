import { authOptions } from "@/lib/auth";
import { hashPassword } from "@/lib/crypto";
import prisma from "@/lib/db";
import { leaseSchema } from "@/lib/validations";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }
  try {
    const body = await req.json();
    const leaseData = leaseSchema.parse(body);
    const utility = leaseData?.utilitiesIncluded == "true" ? true : false;
    const newLease = await prisma.lease.create({
      data: {
        leaseStartDate: new Date(leaseData.leaseStartDate),
        leaseEndDate: new Date(leaseData.leaseEndDate),
        monthlyRent: +leaseData.monthlyRent,
        securityDeposit: +leaseData.securityDeposit,
        additionalCharges: +leaseData.additionalCharges,
        annualRentIncreasePercentage: +leaseData.annualRentIncreasePercentage,
        leaseType: leaseData.leaseType,
        utilitiesIncluded: utility,
        maintenanceFees: +leaseData.maintenanceFees,
        latePaymentPenalty: +leaseData.latePaymentPenalty,
        userId: session.user.id,
      },
    });
    return NextResponse.json(
      { lease: newLease, message: "Lease created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page") ?? 1;
    const limit = searchParams.get("filter") ?? 10;
    const filter = searchParams.get("filter") ?? "all";
    const skip = (+page - 1) * +limit;
    let leases;
    let total;

    console.log(filter, limit, page);
    if (!filter || filter === "all") {
      const myleases = await prisma.lease.findMany({
        where: {
          userId: session.user.id,
        },
        skip,
        take: +limit / 2,
        orderBy: {
          createdAt: "desc",
        },
      });

      const sharedLeases = await prisma.sharedLease.findMany({
        where: {
          users: {
            some: { id: session.user.id },
          },
        },
        skip,
        take: +limit / 2,
        orderBy: {
          createdAt: "desc",
        },
      });

      const mytotal = await prisma.lease.count({
        where: {
          userId: session.user.id,
        },
      });
      const mysharedtotal = await prisma.sharedLease.count({
        where: {
          users: {
            some: {
              id: session.user.id,
            },
          },
        },
      });

      total = mytotal + mysharedtotal;
      leases = [...myleases, ...sharedLeases];

      console.log(total, "TOTAL", leases, "LEASES");
    } else if (filter === "private") {
      leases = await prisma.lease.findMany({
        where: {
          userId: session.user.id,
        },
        skip,
        take: +limit,
        orderBy: {
          createdAt: "desc",
        },
      });
      total = await prisma.lease.count({
        where: {
          userId: session.user.id,
        },
      });
    } else if (filter === "private") {
      leases = await prisma.sharedLease.findMany({
        where: {
          users: {
            some: { id: session.user.id },
          },
        },
        skip,
        take: +limit / 2,
        orderBy: {
          createdAt: "desc",
        },
      });

      total = await prisma.sharedLease.count({
        where: {
          users: {
            some: {
              id: session.user.id,
            },
          },
        },
      });
    }

    return NextResponse.json(
      {
        data: leases,
        page: +page,
        limit: +limit,
        total,
        message: "Lease fetched Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error },
      { status: 500 }
    );
  }
}
