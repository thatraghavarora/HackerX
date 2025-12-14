import React from "react";
import { ListGroup, Card } from "react-bootstrap";
import TransactionCard from "../components/transactions/TransactionCard";
import DownloadTransactions from "../components/transactions/DownloadTransactions";
import { DemoTx } from "./demoUtils";

export default function DemoTransactionList({ transactions, onDelete }: { transactions: DemoTx[]; onDelete: (id: string) => void; }) {
  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <div>Transactions</div>
          <div>
            <DownloadTransactions transactions={transactions as any} />
          </div>
        </div>
      </Card.Header>
      <ListGroup variant="flush">
        {transactions.map((t) => (
          <ListGroup.Item key={t.id} className="p-2">
            <TransactionCard transaction={t as any} handleDelete={onDelete} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}
