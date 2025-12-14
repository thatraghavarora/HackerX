import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { DemoTx } from "./demoUtils";

ChartJS.register(ArcElement, Tooltip, Legend);

export const pieTemplate = {
  labels: ["Income", "Expense"],
  datasets: [
    {
      label: "Amount",
      data: [0, 0],
      backgroundColor: ["#10ac6e", "#ee8d68"],
      borderColor: ["#0bc77e", "#ffae8a"],
      borderWidth: 1,
    },
  ],
};

export default function DemoPieChart({ transactions }: { transactions: DemoTx[] }) {
  const incomes = transactions.filter((t) => t.type === 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === 1).reduce((s, t) => s + t.amount, 0);

  const data = {
    ...pieTemplate,
    datasets: [
      {
        ...pieTemplate.datasets[0],
        data: [incomes, expenses],
      },
    ],
  };

  return (
    <div>
      <h4 className="d-flex justify-content-center">You Balance: $ {incomes - expenses}</h4>
      {incomes - expenses !== 0 ? <Pie data={data} /> : <img src="/images/empty.svg" alt="no data" width={"80%"} height={"80%"} />}
    </div>
  );
}
