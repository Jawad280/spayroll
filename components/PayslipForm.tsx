"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { Employee, Payslip } from "@/types";
import { generatePayslips } from "@/components/GeneratePayslips";

const PayslipForm = ({ employees }: { employees: Employee[] }) => {
  const router = useRouter();
  const formSchema = z.object({
    monthYear: z.string().refine((val) => /^\d{4}-(0[1-9]|1[0-2])$/.test(val), {
      message: "Invalid month and year format",
    }),
    dateOfPayment: z.string().date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      // monthYear: new Date().toISOString().substring(0, 7),
      // dateOfPayment: new Date().toLocaleDateString(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Create a payslip for each employee
    const payslips = employees.map((employee: Employee) => {
      const result = generatePayslips(employee);

      const employeeCPF = result?.employeeCPF || 0;
      const totalCPF = result?.totalCPF || 0;
      const employerCPF = totalCPF - employeeCPF;
      const dateOfPayment = new Date(values.dateOfPayment);

      const payslip: Payslip = {
        employeeCPF: employeeCPF,
        employerCPF: employerCPF,
        totalCPF: totalCPF,
        monthYear: values.monthYear,
        dateOfPayment: dateOfPayment,
        ordinaryWage: employee.ordinaryWage,
        additionalWage: employee.additionalWage,
        allowance: employee.allowance,
        otPay: employee.otPay,
        otHours: employee.otHours,
        modeOfPayment: employee.modeOfPayment,
        typeOfContributionRate: employee.typeOfContributionRate,
        name: employee.name,
        NRIC: employee.NRIC,
        dob: employee.dob,
        nationality: employee.nationality,
        citizenshipStatus: employee.citizenshipStatus,
        companyName: employee.companyName,
        designation: employee.designation,
        joinDate: employee.joinDate,
        employeeId: employee.id,
      };
      return payslip;
    });

    try {
      const res = await fetch(`/api/payslips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payslips),
      });

      if (res.ok) {
        router.push(`/dashboard/payslips/date/${values.monthYear}`);
      } else {
        const errorMessage = await res.text();
        alert(errorMessage);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-10 flex flex-col items-center gap-6 bg-slate-50 rounded-md min-w-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="monthYear"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold text-[16px]">
                      Choose Month & Year
                    </Label>
                    <Input {...field} type="month" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfPayment"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold text-[16px]">
                      Date of Payment
                    </Label>
                    <Input {...field} type="date" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col">
            <Button className="mt-4" variant="default" type="submit">
              Generate
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PayslipForm;
