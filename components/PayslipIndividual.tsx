"use client";
import { Payslip } from "@/types";
import React, { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { mutate } from "swr";

const PayslipIndividual = ({
  payslip,
  isEdit,
  setIsEdit,
}: {
  payslip: Payslip;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
}) => {
  const [other, setOther] = useState<string>(payslip.other || "");
  const [otherDeduction, setOtherDeduction] = useState<number>(
    payslip.otherDeduction || 0
  );

  function grossPay() {
    return (payslip.ordinaryWage || 0) + (payslip.allowance || 0);
  }

  function totalDeduction() {
    return (payslip.employeeCPF || 0) + (payslip.otherDeduction || 0);
  }

  function netPay() {
    const c = grossPay();
    return (
      c -
      totalDeduction() +
      (payslip.otPay || 0) +
      (payslip.additionalWage || 0)
    );
  }

  function fromToDate() {
    const paymentDate = new Date(payslip.monthYear);

    const year = paymentDate.getFullYear();
    const month = paymentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const formattedFirstDay = firstDayOfMonth.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedLastDay = lastDayOfMonth.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedDate = `${formattedFirstDay} - ${formattedLastDay}`;

    return formattedDate;
  }

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOther(e.target.value);
  };

  const handleOtherDeductionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    const num = parseFloat(val);
    setOtherDeduction(isNaN(num) ? 0 : num);
  };

  async function handleSubmit() {
    console.log(other);
    console.log(otherDeduction);
    try {
      const res = await fetch(`/api/payslips/${payslip.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ other: other, otherDeduction: otherDeduction }),
      });

      if (res.ok) {
        console.log("Updated Payslip");
        mutate(`/api/payslips/${payslip.id}`);
      } else {
        const errorMessage = await res.text();
        alert(errorMessage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEdit(false);
    }
  }

  if (isEdit) {
    return (
      <div>
        <div className="h-[14.85cm] w-full flex items-center py-12 box-border bg-white">
          <div className="flex flex-col gap-5 h-full w-[10.5cm] pl-12 pr-2">
            <div className="font-bold text-[24px] h-[45px]">
              Itemised Payslip
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg">
                Name of Employer
              </div>
              <div className="text-[12px]">{payslip.companyName}</div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg">
                Name of Employee
              </div>
              <div className="text-[12px]">{payslip.name}</div>
            </div>

            <table className="border border-gray-400 rounded-lg text-[12px]">
              <thead className="border-b border-gray-400">
                <tr>
                  <th className="p-2 border-r border-gray-400 ">Item</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">Basic Pay</td>
                  <td className="p-0">
                    <div className="flex">
                      <div className="flex-1 text-right p-2 border-r border-gray-400">
                        ${payslip.ordinaryWage}
                      </div>
                      <div className="flex-none w-[30px] p-2">(A)</div>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">
                    Total Allowances
                  </td>
                  <td className="p-0">
                    <div className="flex">
                      <div className="flex-1 text-right p-2 border-r border-gray-400">
                        ${payslip.allowance}
                      </div>
                      <div className="flex-none w-[30px] p-2">(B)</div>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">
                    Gross Pay (A+B)
                  </td>
                  <td className="p-0">
                    <div className="flex">
                      <div className="flex-1 text-right p-2 border-r border-gray-400">
                        ${grossPay()}
                      </div>
                      <div className="flex-none w-[30px] p-2">(C)</div>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">
                    Total Deductions
                  </td>
                  <td className="p-0">
                    <div className="flex">
                      <div className="flex-1 text-right p-2 border-r border-gray-400">
                        {totalDeduction()}
                      </div>
                      <div className="flex-none w-[30px] p-2">(D)</div>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">Employee CPF</td>
                  <td className="p-0">
                    <div className="text-right p-2  border-gray-400">
                      ${payslip.employeeCPF}
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">
                    <div className="flex-1">Other :</div>
                    <input
                      className="flex-1"
                      type="text"
                      value={other}
                      onChange={handleOtherChange}
                    />
                  </td>
                  <td className="p-0">
                    <div className="text-right p-2  border-gray-400">
                      <input
                        type="number"
                        value={otherDeduction}
                        onChange={handleOtherDeductionChange}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-5 h-full w-[10.5cm] pl-2 pr-12">
            <div className="flex flex-col items-start h-[45px]">
              <div className="font-semibold text-[14px]">For the Period</div>
              <div className="text-[12px]">{fromToDate()}</div>
            </div>

            <div className="flex items-center">
              <div className="flex flex-col items-start flex-1 gap-2">
                <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg box-border w-[95%]">
                  Date of Payment
                </div>
                <div className="text-[12px]">
                  {new Date(payslip?.dateOfPayment || "").toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-col items-start flex-1 gap-2">
                <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg box-border w-[95%]">
                  Mode of Payment
                </div>
                <div className="text-[12px]">{payslip.modeOfPayment}</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex flex-col items-start flex-1 gap-2">
                <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg box-border w-[95%]">
                  NRIC/FIN
                </div>
                <div className="text-[12px]">{payslip.NRIC}</div>
              </div>

              <div className="flex flex-col items-start flex-1 gap-2">
                <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg box-border w-[95%]">
                  Designation
                </div>
                <div className="text-[12px]">{payslip.designation}</div>
              </div>
            </div>

            <table className="border border-gray-400 rounded-lg text-[12px]">
              <thead className="border-b border-gray-400">
                <tr>
                  <th className="p-2 border-r border-gray-400">Item</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">
                    Overtime Hours
                  </td>
                  <td className="text-right p-2">{payslip.otHours} hours</td>
                </tr>

                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">Overtime Pay</td>
                  <td className="p-0">
                    <div className="flex">
                      <div className="flex-1 text-right p-2 border-r border-gray-400">
                        ${payslip.otPay}
                      </div>
                      <div className="flex-none w-[30px] p-2">(E)</div>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">
                    Additional Payments
                  </td>
                  <td className="p-0">
                    <div className="flex">
                      <div className="flex-1 text-right p-2 border-r border-gray-400">
                        ${payslip.additionalWage}
                      </div>
                      <div className="flex-none w-[30px] p-2">(F)</div>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">
                    Net Pay (C-D+E+F)
                  </td>
                  <td className="text-right p-2 font-bold">${netPay()}</td>
                </tr>

                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">
                    Employer&apos;s CPF
                  </td>
                  <td className="text-right p-2">${payslip.employerCPF}</td>
                </tr>

                <tr className="border-b border-gray-400">
                  <td className="p-2 border-r border-gray-400">
                    Total CPF Paid
                  </td>
                  <td className="text-right p-2">${payslip.totalCPF}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <Button
            onClick={() => setIsEdit(false)}
            className="flex-1"
            variant={"destructive"}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1" variant={"add"}>
            Submit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[14.85cm] w-full flex items-center py-12 box-border bg-white">
      <div className="flex flex-col gap-5 h-full w-[10.5cm] pl-12 pr-2">
        <div className="font-bold text-[24px] h-[45px]">Itemised Payslip</div>

        <div className="flex flex-col gap-2">
          <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg">
            Name of Employer
          </div>
          <div className="text-[12px]">{payslip.companyName}</div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg">
            Name of Employee
          </div>
          <div className="text-[12px]">{payslip.name}</div>
        </div>

        <table className="border border-gray-400 rounded-lg text-[12px]">
          <thead className="border-b border-gray-400">
            <tr>
              <th className="p-2 border-r border-gray-400 ">Item</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">Basic Pay</td>
              <td className="p-0">
                <div className="flex">
                  <div className="flex-1 text-right p-2 border-r border-gray-400">
                    ${payslip.ordinaryWage}
                  </div>
                  <div className="flex-none w-[30px] p-2">(A)</div>
                </div>
              </td>
            </tr>

            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">Total Allowances</td>
              <td className="p-0">
                <div className="flex">
                  <div className="flex-1 text-right p-2 border-r border-gray-400">
                    ${payslip.allowance}
                  </div>
                  <div className="flex-none w-[30px] p-2">(B)</div>
                </div>
              </td>
            </tr>

            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">Gross Pay (A+B)</td>
              <td className="p-0">
                <div className="flex">
                  <div className="flex-1 text-right p-2 border-r border-gray-400">
                    ${grossPay()}
                  </div>
                  <div className="flex-none w-[30px] p-2">(C)</div>
                </div>
              </td>
            </tr>

            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">Total Deductions</td>
              <td className="p-0">
                <div className="flex">
                  <div className="flex-1 text-right p-2 border-r border-gray-400">
                    {totalDeduction()}
                  </div>
                  <div className="flex-none w-[30px] p-2">(D)</div>
                </div>
              </td>
            </tr>

            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">Employee CPF</td>
              <td className="p-0">
                <div className="text-right p-2  border-gray-400">
                  ${payslip.employeeCPF}
                </div>
              </td>
            </tr>

            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">
                Other : {payslip.other}
              </td>
              <td className="p-0">
                <div className="text-right p-2  border-gray-400">
                  ${payslip.otherDeduction}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-5 h-full w-[10.5cm] pl-2 pr-12">
        <div className="flex flex-col items-start h-[45px]">
          <div className="font-semibold text-[14px]">For the Period</div>
          <div className="text-[12px]">{fromToDate()}</div>
        </div>

        <div className="flex items-center">
          <div className="flex flex-col items-start flex-1 gap-2">
            <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg box-border w-[95%]">
              Date of Payment
            </div>
            <div className="text-[12px]">
              {new Date(payslip?.dateOfPayment || "").toLocaleDateString()}
            </div>
          </div>

          <div className="flex flex-col items-start flex-1 gap-2">
            <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg box-border w-[95%]">
              Mode of Payment
            </div>
            <div className="text-[12px]">{payslip.modeOfPayment}</div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex flex-col items-start flex-1 gap-2">
            <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg box-border w-[95%]">
              NRIC/FIN
            </div>
            <div className="text-[12px]">{payslip.NRIC}</div>
          </div>

          <div className="flex flex-col items-start flex-1 gap-2">
            <div className="font-semibold text-[14px] bg-slate-200 px-2 py-1 rounded-lg box-border w-[95%]">
              Designation
            </div>
            <div className="text-[12px]">{payslip.designation}</div>
          </div>
        </div>

        <table className="border border-gray-400 rounded-lg text-[12px]">
          <thead className="border-b border-gray-400">
            <tr>
              <th className="p-2 border-r border-gray-400">Item</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">Overtime Hours</td>
              <td className="text-right p-2">{payslip.otHours} hours</td>
            </tr>

            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">Overtime Pay</td>
              <td className="p-0">
                <div className="flex">
                  <div className="flex-1 text-right p-2 border-r border-gray-400">
                    ${payslip.otPay}
                  </div>
                  <div className="flex-none w-[30px] p-2">(E)</div>
                </div>
              </td>
            </tr>

            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">
                Additional Payments
              </td>
              <td className="p-0">
                <div className="flex">
                  <div className="flex-1 text-right p-2 border-r border-gray-400">
                    ${payslip.additionalWage}
                  </div>
                  <div className="flex-none w-[30px] p-2">(F)</div>
                </div>
              </td>
            </tr>

            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">
                Net Pay (C-D+E+F)
              </td>
              <td className="text-right p-2 font-bold">${netPay()}</td>
            </tr>

            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">
                Employer&apos;s CPF
              </td>
              <td className="text-right p-2">${payslip.employerCPF}</td>
            </tr>

            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400">Total CPF Paid</td>
              <td className="text-right p-2">${payslip.totalCPF}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayslipIndividual;
