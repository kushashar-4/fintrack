"use client";

import { Button } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import {
  fetchData,
  checkForSetup,
  editFinancialData,
  updateProfileFinancials,
} from "../../actions";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [tempIncome, setTempIncome] = useState<number>(0);
  const [tempExpense, setTempExpense] = useState<number>(0);

  const editFinancials = async (table: string, amount: number) => {
    await editFinancialData(table, amount);
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData("profiles");
      if (data != null) {
        setBalance(data[0].balance);
      }
    };

    checkForSetup();
    getData();
  }, []);

  return (
    <div className="flex flex-col align-center gap-6">
      <p>{balance}</p>
      <input
        placeholder="Income amount"
        onChange={(e) => {
          setTempIncome(parseFloat(e.target.value) || 0);
        }}
      ></input>
      {/* <Button onClick={editFinancials("income", tempIncome)}>Add income</Button> */}
      <button onClick={() => editFinancials("income", tempIncome)}>
        Add income
      </button>
      <input
        placeholder="Expense amount"
        onChange={(e) => {
          setTempExpense(parseFloat(e.target.value) || 0);
        }}
      ></input>
      <button onClick={() => editFinancials("expense", tempExpense)}>
        Add expense
      </button>
    </div>
  );
}
