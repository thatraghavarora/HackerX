import React, { useMemo, useRef, useState } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
  Title,
} from "chart.js";
import { Line, Bar, Doughnut, Pie, Radar, PolarArea, Bubble, Scatter } from "react-chartjs-2";
import { DemoTx } from "./demoUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
  Title
);

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

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 0 }, // disable animation to avoid auto-moving bars
  plugins: { legend: { position: "top" } },
};

function arrayFromMonths(transactions: DemoTx[]) {
  const incomes = new Array(12).fill(0);
  const expenses = new Array(12).fill(0);
  transactions.forEach((t) => {
    const parts = t.date.split("-");
    let m = 0;
    if (parts.length >= 2) m = Number(parts[1]) - 1;
    if (m < 0 || m > 11) m = 0;
    if (t.type === 0) incomes[m] += t.amount;
    else expenses[m] += t.amount;
  });
  return { incomes, expenses };
}

export default function ChartGallery({ transactions }: { transactions: DemoTx[] }) {
  const canvasRef = useRef<any>(null);
  const [type, setType] = useState<string>("line");

  const { incomes, expenses } = useMemo(() => arrayFromMonths(transactions), [transactions]);

  const commonData = useMemo(() => ({ labels, incomes, expenses }), [incomes, expenses]);

  const chartAreaRef = useRef<HTMLDivElement | null>(null);
  const downloadImage = () => {
    try {
      if (!chartAreaRef.current) return;
      const canvas = chartAreaRef.current.querySelector("canvas");
      if (!canvas) return;
      const url = (canvas as HTMLCanvasElement).toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `chart-${type}.png`;
      a.click();
    } catch (e) {
      console.error(e);
    }
  };

  const downloadCSV = () => {
    const rows = [["Month", "Income", "Expense"]];
    labels.forEach((lab, i) => rows.push([lab, String(incomes[i] || 0), String(expenses[i] || 0)]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monthly-data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // dataset used by many charts
  const datasets = [
    { label: "Income", data: incomes, backgroundColor: "rgba(16,172,110,0.6)", borderColor: "#15b310", fill: true },
    { label: "Expense", data: expenses, backgroundColor: "rgba(238,141,104,0.6)", borderColor: "#fc0339", fill: false },
  ];

  return (
    <Card className="mt-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>Chart Gallery</div>
        <div className="d-flex gap-2">
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="line">Line</option>
            <option value="area">Area (filled Line)</option>
            <option value="bar">Bar</option>
            <option value="stackedBar">Stacked Bar</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
            <option value="radar">Radar</option>
            <option value="polar">Polar Area</option>
            <option value="scatter">Scatter</option>
            <option value="mixed">Mixed (Bar+Line)</option>
          </Form.Select>
          <Button onClick={downloadImage}>Download Image</Button>
          <Button onClick={downloadCSV}>Export CSV</Button>
        </div>
      </Card.Header>
      <Card.Body style={{ minHeight: 320 }}>
        <Row>
          <Col>
            <div ref={chartAreaRef} style={{ width: "100%", height: 360 }}>
              {type === "line" && <Line ref={(canvasRef as any)} data={({ labels, datasets } as any)} options={({ ...baseOptions } as any)} />}
              {type === "area" && (
                <Line
                  ref={(canvasRef as any)}
                  data={({ labels, datasets: [{ ...datasets[0], fill: true }, datasets[1]] } as any)}
                  options={({ ...baseOptions } as any)}
                />
              )}
              {type === "bar" && <Bar ref={(canvasRef as any)} data={({ labels, datasets } as any)} options={({ ...baseOptions } as any)} />}
              {type === "stackedBar" && (
                <Bar
                  ref={(canvasRef as any)}
                  data={({ labels, datasets } as any)}
                  options={({ ...baseOptions, scales: { x: { stacked: true }, y: { stacked: true } } } as any)}
                />
              )}
              {type === "pie" && (
                <Pie
                  ref={(canvasRef as any)}
                  data={({ labels: ["Income", "Expense"], datasets: [{ data: [incomes.reduce((s, v) => s + v, 0), expenses.reduce((s, v) => s + v, 0)], backgroundColor: ["#10ac6e", "#ee8d68"] }] } as any)}
                  options={({ ...baseOptions } as any)}
                />
              )}
              {type === "doughnut" && (
                <Doughnut
                  ref={(canvasRef as any)}
                  data={({ labels: ["Income", "Expense"], datasets: [{ data: [incomes.reduce((s, v) => s + v, 0), expenses.reduce((s, v) => s + v, 0)], backgroundColor: ["#10ac6e", "#ee8d68"] }] } as any)}
                  options={({ ...baseOptions } as any)}
                />
              )}
              {type === "radar" && <Radar ref={(canvasRef as any)} data={({ labels, datasets } as any)} options={({ ...baseOptions } as any)} />}
              {type === "polar" && (
                <PolarArea
                  ref={(canvasRef as any)}
                  data={({ labels, datasets: [{ data: incomes.map((v, i) => v + expenses[i]), backgroundColor: labels.map((_, i) => `hsl(${(i / 12) * 360},60%,60%)`) }] } as any)}
                  options={({ ...baseOptions } as any)}
                />
              )}
              {type === "scatter" && (
                <Scatter
                  ref={(canvasRef as any)}
                  data={({ datasets: [{ label: "Income vs Month", data: incomes.map((v, i) => ({ x: i + 1, y: v })), backgroundColor: "#10ac6e" }] } as any)}
                  options={({ ...baseOptions } as any)}
                />
              )}
              {type === "mixed" && (
                <Bar
                  ref={(canvasRef as any)}
                  data={({ labels, datasets: [{ ...datasets[0], type: "line" as any }, { ...datasets[1], type: "bar" as any }] } as any)}
                  options={({ ...baseOptions } as any)}
                />
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
