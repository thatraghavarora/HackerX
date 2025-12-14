import React, { useMemo, useState } from "react";
import Head from "next/head";
import { Button, Card, Form, Row, Col, Container } from "react-bootstrap";
import DemoAccount from "../demo/demoUtils";
import { formatDate } from "../utils/formatDate";
import DemoPieChart from "../demo/DemoPieChart";
import DemoLineChart from "../demo/DemoLineChart";
import DemoTransactionList from "../demo/DemoTransactionList";
import ChartGallery from "../demo/ChartGallery";

const DemoPage: React.FC = () => {
  const demo = useMemo(() => new DemoAccount(100), []);
  const [transactions, setTransactions] = useState(demo.getTransactions());

  const [form, setForm] = useState({
    type: "income",
    amount: 10,
    category: "Misc",
    date: formatDate(new Date()),
    description: "Demo",
  });

  function refresh() {
    setTransactions(demo.getTransactions());
  }

  function handleAdd() {
    if (form.type === "income") demo.addIncome(form as any);
    else demo.addExpense(form as any);
    refresh();
  }

  function handleDelete(id: string) {
    demo.deleteTransaction(id);
    refresh();
  }

  return (
    <>
      <Head>
        <title>Demo Account — Decentralized Expense Tracker</title>
      </Head>
      <Container style={{ minHeight: "100vh" }} className="py-4">
        <h3 className="d-flex justify-content-center pb-2">Overview (Demo)</h3>
        <Row>
          <Col md={6} xs={12} className="d-flex flex-column align-items-center justify-content-center">
            <Card style={{ width: "100%" }} className="mb-3">
              <Card.Header as="h5" className="d-flex justify-content-center">Add Transaction</Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6} xs={6}>
                      <Form.Label>Type</Form.Label>
                      <Form.Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Label>Category</Form.Label>
                      <Form.Control value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    </Col>
                  </Row>
                  <Form.Label className="mt-2">Amount</Form.Label>
                  <Form.Control type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
                  <Form.Label className="mt-2">Date</Form.Label>
                  <Form.Control type="date" value={form.date} onChange={(e) => setForm({ ...form, date: formatDate(new Date(e.target.value)) })} />
                  <Form.Label className="mt-2">Description</Form.Label>
                  <Form.Control value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <div className="d-flex justify-content-center mt-3">
                    <Button onClick={handleAdd}>Add {form.type}</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} xs={12} className="d-flex flex-column align-items-center justify-content-center">
            <div style={{ width: "70%" }}>
              <DemoPieChart transactions={transactions} />
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={8} xs={12} className="mb-3">
            <DemoTransactionList transactions={transactions} onDelete={handleDelete} />
          </Col>
          <Col md={4} xs={12} className="mb-3">
            <Card>
              <Card.Header>Monthly Performance</Card.Header>
              <Card.Body>
                <DemoLineChart transactions={transactions} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <ChartGallery transactions={transactions} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DemoPage;
