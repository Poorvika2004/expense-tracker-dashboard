import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!name || !amount) return;

    const newExpense = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      category,
    };

    setExpenses([...expenses, newExpense]);
    setName("");
    setAmount("");
  };

  const totalSpent = expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] =
      (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#22C55E",
          "#3B82F6",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
      },
    ],
  };

const [budget, setBudget] = useState(2000);

  return (
    <div className="min-h-screen bg-[#0F1115] text-white p-8 space-y-10">

      <h1 className="text-3xl font-bold">
        Expense Dashboard
      </h1>
      <div className="bg-[#181C23] p-6 rounded-xl shadow-lg max-w-sm">
      <p className="text-gray-400 text-sm mb-2">Set Monthly Budget</p>

      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
        className="bg-[#0F1115] p-3 rounded-lg border border-gray-700 focus:border-green-400 outline-none w-full"
      />
    </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-[#181C23] p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm">Total Spent</p>
          <h2 className="text-2xl font-bold mt-2">
            ${totalSpent}
          </h2>
        </div>

        <div className="bg-[#181C23] p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm">Expenses Count</p>
          <h2 className="text-2xl font-bold mt-2">
            {expenses.length}
          </h2>
        </div>

        <div className="bg-[#181C23] p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm">Remaining Budget</p>
          <h2 className="text-2xl font-bold mt-2 text-green-400">
            ${budget - totalSpent}
          </h2>
        </div>

      </div>

      {/* Add Expense Form */}
      <div className="bg-[#181C23] p-8 rounded-xl shadow-lg max-w-4xl">
        <h2 className="text-xl font-semibold mb-6">
          Add New Expense
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Expense Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#0F1115] p-3 rounded-lg border border-gray-700 focus:border-green-400 outline-none"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#0F1115] p-3 rounded-lg border border-gray-700 focus:border-green-400 outline-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#0F1115] p-3 rounded-lg border border-gray-700 focus:border-green-400"
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>

          <button
            onClick={addExpense}
            className="bg-green-500 hover:bg-green-600 transition p-3 rounded-lg font-semibold"
          >
            Add
          </button>

        </div>
      </div>

      {/* Expense List */}
      <div className="bg-[#181C23] p-8 rounded-xl shadow-lg max-w-4xl">
        <h2 className="text-xl font-semibold mb-6">
          Expense List
        </h2>

        {expenses.length === 0 ? (
          <p className="text-gray-400">
            No expenses added yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex justify-between items-center bg-[#0F1115] p-4 rounded-lg"
              >
                <div>
                  <p>{expense.name}</p>
                  <p className="text-xs text-gray-400">
                    {expense.category}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-green-400 font-semibold">
                    ${expense.amount}
                  </span>

                  <button
                    onClick={() =>
                      setExpenses(
                        expenses.filter(
                          (e) => e.id !== expense.id
                        )
                      )
                    }
                    className="text-red-400 hover:text-red-500 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-[#181C23] p-8 rounded-xl shadow-lg max-w-4xl">
        <h2 className="text-xl font-semibold mb-6">
          Category Distribution
        </h2>

        {Object.keys(categoryTotals).length === 0 ? (
          <p className="text-gray-400">
            Add expenses to see chart.
          </p>
        ) : (
          <div className="max-w-md mx-auto">
            <Pie data={pieData} />
          </div>
        )}
      </div>

    </div>
  );
}