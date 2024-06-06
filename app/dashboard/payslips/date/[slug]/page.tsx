"use client";
import AllPayslips from "@/components/AllPayslips";
import Loading from "@/components/Loading";
import { PayslipTable } from "@/components/PayslipTable/PayslipTable";
import { columns } from "@/components/PayslipTable/columns";
import { Button } from "@/components/ui/button";
import { GetAllPayslips } from "@/lib/serverFunctions";
import { ArrowLeft, Printer } from "lucide-react";
import React, { useState } from "react";

const PayslipsCompany = ({ params }: { params: { slug: string } }) => {
  const { payslips, error, isLoading } = GetAllPayslips(params.slug);
  const [isAll, setIsAll] = useState<boolean>(false);

  if (isLoading) {
    return <Loading />;
  }

  if (isAll) {
    return (
      <div className="flex flex-col items-center p-8 w-screen gap-6">
        <div className="flex justify-between w-full print:hidden">
          <div className="font-bold text-[28px]">
            Payslips Table : {params.slug}
          </div>
        </div>

        <div className="flex justify-between w-4/5 fixed top-48">
          <Button onClick={() => setIsAll(false)} variant={"destructive"}>
            <ArrowLeft />
          </Button>

          <Button onClick={() => window.print()} variant={"default"}>
            <Printer />
          </Button>
        </div>

        <AllPayslips payslips={payslips} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 w-screen gap-6">
      <div className="flex justify-between w-full">
        <div className="font-bold text-[28px]">
          Payslips Table : {params.slug}
        </div>
      </div>

      <div className="py-10 w-full">
        <PayslipTable columns={columns} data={payslips} />
      </div>

      <Button variant={"ghost"} onClick={() => setIsAll(true)}>
        View All
      </Button>
    </div>
  );
};

export default PayslipsCompany;
