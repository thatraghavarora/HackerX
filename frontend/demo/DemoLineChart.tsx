import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { DemoTx } from "./demoUtils";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DemoLineChart({ transactions }: { transactions: DemoTx[] }) {
  // compute month index from date 'YYYY-MM-DD'
  const incomes = new Array(12).fill(0);
  const expenses = new Array(12).fill(0);
  transactions.forEach((t) => {
    const parts = t.date.split("-");
    let monthIdx = 0;
    if (parts.length >= 2) monthIdx = Number(parts[1]) - 1;
    if (monthIdx < 0 || monthIdx > 11) monthIdx = 0;
    if (t.type === 0) incomes[monthIdx] += t.amount;
    else expenses[monthIdx] += t.amount;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomes,
        fill: true,
        lineTension: 0.3,
        backgroundColor: "rgba(71, 245, 39, 0.25)",
        borderColor: "#15b310",
      },
      {
        label: "Expenses",
        data: expenses,
        fill: false,
        lineTension: 0.3,
        borderColor: "#fc0339",
        backgroundColor: "#ff91ad",
      },
    ],
  };

  return (
    <div>
      <h4 className="d-flex justify-content-center">Monthly Performance</h4>
      <Line data={data} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
    </div>
  );
}
