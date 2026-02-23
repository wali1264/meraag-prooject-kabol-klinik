import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db";
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Customers
  app.get("/api/customers", (req, res) => {
    const { search } = req.query;
    let query = "SELECT * FROM customers ORDER BY created_at DESC";
    let params: any[] = [];

    if (search) {
      query = "SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? OR code LIKE ? ORDER BY created_at DESC";
      const term = `%${search}%`;
      params = [term, term, term];
    }

    const customers = db.prepare(query).all(...params);
    res.json(customers);
  });

  app.get("/api/customers/:id", (req, res) => {
    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    
    const transactions = db.prepare("SELECT * FROM transactions WHERE customer_id = ? ORDER BY created_at DESC").all(req.params.id);
    
    // Calculate totals
    const stats = db.prepare(`
      SELECT 
        SUM(CASE WHEN type IN ('win', 'sell') THEN total ELSE 0 END) as total_wins,
        SUM(CASE WHEN type IN ('receipt', 'buy') THEN total ELSE 0 END) as total_receipts,
        SUM(fee1 + fee2) as total_fees
      FROM transactions WHERE customer_id = ?
    `).get(req.params.id);

    res.json({ ...(customer as any), transactions, stats });
  });

  app.post("/api/customers", (req, res) => {
    const { name, phone } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    // Generate unique code (e.g., C-1001)
    const count = db.prepare("SELECT COUNT(*) as count FROM customers").get() as { count: number };
    const code = `C-${1000 + count.count + 1}`;

    try {
      const result = db.prepare(
        "INSERT INTO customers (name, code, phone) VALUES (?, ?, ?)"
      ).run(name, code, phone);
      res.json({ id: result.lastInsertRowid, code, name, phone, balance: 0 });
    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Customer with this phone number already exists." });
      }
      res.status(500).json({ error: err.message });
    }
  });

  // Transactions
  app.post("/api/transactions", (req, res) => {
    const { customer_id, type, amount, rate, fee1, fee2, description } = req.body;
    
    if (!customer_id || !type || !amount) {
      return res.status(400).json({ error: "Customer, type, and amount are required" });
    }

    const total = amount * (rate || 1); 
    
    // Profit Calculation Logic
    let profit = (fee1 || 0) + (fee2 || 0);
    
    // Transaction Logic
    const runTransaction = db.transaction(() => {
      // Insert Transaction
      const result = db.prepare(`
        INSERT INTO transactions (customer_id, type, amount, rate, total, fee1, fee2, profit, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(customer_id, type, amount, rate || 1, total, fee1 || 0, fee2 || 0, profit, description);

      // Update Customer Balance
      let balanceChange = 0;
      if (type === 'win' || type === 'sell') {
        // Win: Customer debt increases
        // Sell: We sell to customer -> Customer owes us -> Debt increases
        balanceChange = total;
      } else if (type === 'receipt' || type === 'buy') {
        // Receipt: Customer pays us -> Debt decreases
        // Buy: We buy from customer -> We owe them (or they owe us less) -> Debt decreases
        balanceChange = -total;
      }
      
      if (customer_id) {
        db.prepare("UPDATE customers SET balance = balance + ? WHERE id = ?").run(balanceChange, customer_id);
      }

      return result;
    });

    try {
      const result = runTransaction();
      res.json({ id: result.lastInsertRowid });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reports
  app.get("/api/reports/daily", (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const stats = db.prepare(`
      SELECT 
        SUM(profit) as total_profit,
        SUM(CASE WHEN type IN ('win', 'sell') THEN total ELSE 0 END) as total_in,
        SUM(CASE WHEN type IN ('receipt', 'buy') THEN total ELSE 0 END) as total_out
      FROM transactions 
      WHERE date(created_at) = ?
    `).get(today);
    
    res.json(stats);
  });

  app.get("/api/reports/debtors", (req, res) => {
    const debtors = db.prepare("SELECT * FROM customers WHERE balance > 0 ORDER BY balance DESC").all();
    res.json(debtors);
  });

  app.get("/api/reports/creditors", (req, res) => {
    // Assuming negative balance means we owe them (Creditors)
    // Or if the prompt implies "Debt" is just a positive number and "Credit" is something else.
    // Let's assume standard accounting: Positive = Debit (They owe us), Negative = Credit (We owe them).
    const creditors = db.prepare("SELECT * FROM customers WHERE balance < 0 ORDER BY balance ASC").all();
    res.json(creditors);
  });

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { password } = req.body;
    const adminPassRow = db.prepare("SELECT value FROM settings WHERE key = 'admin_password'").get() as { value: string } | undefined;
    const adminPass = adminPassRow?.value || 'admin123';
    
    if (password === adminPass) {
      res.json({ role: 'admin', token: 'mock-admin-token' });
    } else if (password === 'user123') { // Simple hardcoded employee pass for demo
      res.json({ role: 'employee', token: 'mock-employee-token' });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
