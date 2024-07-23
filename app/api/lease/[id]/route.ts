import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { leaseSchema } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json(
      { message: "Id is required" },
      {
        status: 400,
      }
    );
  }
  const body = await request.json();
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
    const leaseData = leaseSchema.parse(body);
    const lease = await prisma.lease.findUnique({
      where: {
        id: id,
      },
    });

    if (!lease || lease.userId !== session.user?.id) {
      return NextResponse.json(
        { message: "Id is required" },
        {
          status: 404,
        }
      );
    }
    const utility = leaseData?.utilitiesIncluded == "true" ? true : false;
    const updatedLease = await prisma.lease.update({
      where: {
        id: id,
      },
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
      { lease: updatedLease, message: "Lease updated Successfully" },
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json(
      { message: "Id is required" },
      {
        status: 400,
      }
    );
  }
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
    const lease = await prisma.lease.findUnique({
      where: {
        id: id,
      },
    });

    if (!lease || lease.userId !== session.user.id) {
      return NextResponse.json({ message: "Lease not found" }, { status: 404 });
    }

    await prisma.lease.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      { message: "Lease deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json(
      { message: "Id is required" },
      {
        status: 400,
      }
    );
  }
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
    const body = await request.json();
    if (!body?.email) {
      return NextResponse.json(
        { message: "User email is required to share" },
        { status: 401 }
      );
    }
    const userToShareWith = await prisma.user.findUnique({
      where: {
        email: body?.email,
      },
    });
    if (!userToShareWith) {
      return NextResponse.json(
        { message: "A user with that email address is not found" },
        { status: 404 }
      );
    }
    const lease = await prisma.lease.findUnique({
      where: {
        id: id,
      },
    });

    if (!lease) {
      return NextResponse.json(
        { message: "A lease with that is is not found" },
        { status: 404 }
      );
    }

    const sharedLease = await prisma.sharedLease.create({
      data: {
        leaseId: lease.id,
        users: {
          connect: [{ id: session.user.id }, { id: userToShareWith.id }],
        },
      },
    });
    return NextResponse.json(
      { lease: sharedLease, message: "Lease shared Successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error },
      { status: 500 }
    );
  }
}
