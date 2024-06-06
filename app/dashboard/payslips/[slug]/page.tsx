"use client";
import PayslipIndividual from "@/components/PayslipIndividual";
import { Button } from "@/components/ui/button";
import { GetIndividualPayslip } from "@/lib/serverFunctions";
import { Edit3Icon } from "lucide-react";
import React, { useState } from "react";
import Loading from "@/components/Loading";

const PayslipPage = ({ params }: { params: { slug: string } }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { payslip, error, isLoading } = GetIndividualPayslip(params.slug);

  if (isLoading) {
    return <Loading />;
  }

  if (isEdit) {
    return (
      <div className="flex flex-col items-center p-8 w-screen gap-6 bg-slate-400 h-screen">
        {payslip && (
          <div>
            <PayslipIndividual
              payslip={payslip}
              setIsEdit={setIsEdit}
              isEdit={isEdit}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 w-screen gap-6 bg-slate-400 h-screen relative print:m-0 print:p-0">
      {payslip && (
        <div
          className="border w-[8.27in] h-[5.845in] box-border"
          id="print-content"
        >
          <PayslipIndividual
            payslip={payslip}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          />
        </div>
      )}

      <Button
        variant={"ghost"}
        className=" absolute top-6 right-8 print:hidden"
      >
        <Edit3Icon onClick={() => setIsEdit(true)} size={32} />
      </Button>
    </div>
  );
};

export default PayslipPage;
