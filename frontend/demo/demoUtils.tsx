import { v4 as uuid } from "uuid";
import { demo_transactions } from "../utils/demo_data";

export type DemoTx = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: number; // 0 income, 1 expense
};

export class DemoAccount {
  balance: number;
  transactions: DemoTx[];

  constructor(startingUsd = 100) {
    this.balance = startingUsd;
    // clone demo_transactions and ensure ids
    this.transactions = demo_transactions.map((t) => ({
      id: t.id || uuid(),
      amount: Number(t.amount),
      category: t.category,
      date: t.date,
      description: t.description,
      type: Number(t.type),
    }));
    this.recalculateBalance();
  }

  recalculateBalance() {
    // treat balance as startingUsd + incomes - expenses
    const incomes = this.transactions
      .filter((t) => t.type === 0)
      .reduce((s, t) => s + t.amount, 0);
    const expenses = this.transactions
      .filter((t) => t.type === 1)
      .reduce((s, t) => s + t.amount, 0);
    this.balance = 100 + incomes - expenses;
  }

  getTransactions() {
    return [...this.transactions].sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
    );
  }

  addIncome({ amount, category, date, description }: Omit<DemoTx, "id" | "type">) {
    const tx: DemoTx = {
      id: uuid(),
      amount: Number(amount),
      category,
      date,
      description,
      type: 0,
    };
    this.transactions.push(tx);
    this.recalculateBalance();
    return tx;
  }

  addExpense({ amount, category, date, description }: Omit<DemoTx, "id" | "type">) {
    const tx: DemoTx = {
      id: uuid(),
      amount: Number(amount),
      category,
      date,
      description,
      type: 1,
    };
    this.transactions.push(tx);
    this.recalculateBalance();
    return tx;
  }

  deleteTransaction(id: string) {
    const idx = this.transactions.findIndex((t) => t.id === id);
    if (idx >= 0) {
      const [removed] = this.transactions.splice(idx, 1);
      this.recalculateBalance();
      return removed;
    }
    return null;
  }
}

export default DemoAccount;
