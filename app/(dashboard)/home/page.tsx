"use client";
import Filter from "@/components/Filter";
import { Modal } from "@/components/Modal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import LeaseForm from "@/components/form/LeaseForm";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Home = () => {
  const session = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/sign-in");
  }
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <div className="p-5 mt-2">
        <div className="flex justify-between">
          <Filter
            filters={[
              { name: "Shared", value: "shared" },
              { name: "Private", value: "private" },
            ]}
          />
          <Button
            onClick={() => {
              setShowForm(true);
            }}
          >
            Add new lease
          </Button>
        </div>
        <Table />
      </div>
      <Modal showModal={showForm} handleOpenChange={setShowForm}>
        <LeaseForm
          hideModal={() => {
            setShowForm(false);
          }}
        />
      </Modal>
    </>
  );
};

export default Home;
