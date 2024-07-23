"use client";
import { Edit2Icon, Share2Icon, Trash2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import LeaseForm from "./form/LeaseForm";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { ShareLease } from "./ShareLease";
import { useGetPaginatedRQuery } from "@/hooks/useGetQuery";
import { DELETE_LEASE, GET_LEASES } from "@/constants";
import toast from "react-hot-toast";
import { convertDate } from "@/lib/utils";
import { useDeleteRQuery } from "@/hooks/useDeleteQuery";

const Table = () => {
  const [leaseDetail, setLeaseDetail] = useState({} as any);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const params = useSearchParams();
  const filter = params.get("filter") || "all";
  const page = params.get("page") || 1;
  const limit = params.get("limit") || 10;

  let { data } = useGetPaginatedRQuery(
    {} as any,
    GET_LEASES,
    [`lease ${filter} ${page}`],
    +page,
    limit,
    filter
  );

  const { mutate: deleteApi } = useDeleteRQuery(
    `lease ${filter} ${page}`,
    `${DELETE_LEASE}/${leaseDetail?.id}`
  );
  function deleteLease() {
    try {
      deleteApi();
    } catch (error) {
      console.log(error);
    }
  }

  function shareLease() {}

  return (
    <>
      <div className="p-5 bg-gray-100 m-3">
        <h1 className="text-xl mb-2">{filter} leases</h1>
        <div className="overflow-auto rounded-lg shadow hidden lg:block">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="w-15 p-3 text-sm font-semibold tracking-wide text-left">
                  No.
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Start date
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  End date
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Type
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Monthly rent
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Security deposit
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Additional charges
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Rent increase percentage
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Maintenance fee
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Penalty
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Utilities included
                </th>

                <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                  Total
                </th>

                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data?.length > 0 &&
                data.map((lease: any, index: number) => (
                  <tr key={lease?.id || index} className="bg-white">
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <p className="font-bold text-blue-500 hover:underline">
                        {index + 1}
                      </p>
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {convertDate(lease.leaseStartDate)}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {convertDate(lease.leaseEndDate)}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                        {lease.leaseType.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {lease.monthlyRent}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {lease.securityDeposit}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {lease.additionalCharges}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {lease.annualRentIncreasePercentage}%
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {lease.maintenanceFees}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {lease.latePaymentPenalty}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {lease.utilitiesIncluded ? "Yes" : "No"}
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      1200$
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap space-x-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setLeaseDetail(lease);
                          setShowFormModal(true);
                        }}
                      >
                        <Edit2Icon />
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setLeaseDetail(lease);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2Icon />
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setLeaseDetail(lease);
                          setShowShareModal(true);
                        }}
                      >
                        <Share2Icon />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS  */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {data?.length > 0 &&
            data.map((lease: any, index: number) => (
              <div
                className="bg-white space-y-3 p-4 rounded-lg shadow"
                key={lease?.id || index}
              >
                <div className="flex items-center space-x-2 text-sm">
                  <div>
                    From {convertDate(lease.leaseStartDate)} To{" "}
                    {convertDate(lease.leaseEndDate)}
                  </div>
                  <div>
                    <span className=" p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                      {lease.leaseType.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  {lease.monthlyRent} / month ,
                  <span className="ml-2 text-gray-500">
                    {lease.annualRentIncreasePercentage}% (Annual rent increase)
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  ${lease.securityDeposit}(security deposit) ,
                  <span className="ml-2 text-gray-500">
                    ${lease.latePaymentPenalty} (Late payment penalty)
                  </span>
                </div>

                <div className="text-sm text-gray-700">
                  Utilities included: {lease.utilitiesIncluded ? "Yes" : "No"} ,
                  <span className="ml-2 text-gray-500">
                    ${lease.maintenanceFees} (Maintenance fees) ,
                  </span>
                  <span className="ml-2 text-gray-500">
                    ${lease.additionalCharges} (Additional charges) ,
                  </span>
                </div>
                <div className="text-sm font-medium text-black">
                  Total: $200.00
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setLeaseDetail(lease);
                      setShowFormModal(true);
                    }}
                  >
                    <Edit2Icon />
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setLeaseDetail(lease);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2Icon />
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setLeaseDetail(lease);
                      setShowShareModal(true);
                    }}
                  >
                    <Share2Icon />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* MODALS   */}

      <Modal showModal={showFormModal} handleOpenChange={setShowFormModal}>
        <LeaseForm
          leaseDetails={leaseDetail}
          type="edit"
          hideModal={() => {
            setShowFormModal(false);
          }}
        />
      </Modal>

      <Modal showModal={showDeleteModal} handleOpenChange={setShowDeleteModal}>
        <DeleteConfirmation
          message="Are you sure you want to delete this lease?. This action cannot be undone."
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          confirmationAction={deleteLease}
        />
      </Modal>

      <Modal showModal={showShareModal} handleOpenChange={setShowShareModal}>
        <ShareLease
          open={showShareModal}
          setOpen={setShowShareModal}
          confirmationAction={() => {}}
        />
      </Modal>

      {/* {showShareModal && <LeaseShareModal />} */}
    </>
  );
};

export default Table;
