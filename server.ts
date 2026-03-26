import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs/promises";

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "mechpart-secret-key-123";
const DB_FILE = path.join(__dirname, "db.json");

// Initial DB structure
const initialDb = {
  users: [],
  products: [
    {
      id: "1",
      title: "V8 Engine Block - Used",
      description: "Complete V8 engine block from a 2015 Mustang. Good condition, needs some cleaning.",
      price: 1200,
      condition: "used",
      category: "engine",
      compatibility: "Ford Mustang 2015-2020",
      location: "Detroit, MI",
      images: ["https://picsum.photos/seed/engine/800/600"],
      sellerId: "admin",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "Brembo Brake Calipers",
      description: "High-performance brake calipers. Refurbished and ready for installation.",
      price: 450,
      condition: "refurbished",
      category: "suspension",
      compatibility: "Universal / Performance Cars",
      location: "Los Angeles, CA",
      images: ["https://picsum.photos/seed/brakes/800/600"],
      sellerId: "admin",
      createdAt: new Date().toISOString()
    }
  ],
  categories: ["engine", "suspension", "electrical", "body", "interior", "other"]
};

async function ensureDb() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(initialDb, null, 2));
  }
}

async function readDb() {
  const data = await fs.readFile(DB_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeDb(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  await ensureDb();
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Auth Middleware
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    const db = await readDb();
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, role: "user" };
    db.users.push(newUser);
    await writeDb(db);
    res.status(201).json({ message: "User registered" });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const db = await readDb();
    const user = db.users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  // Products
  app.get("/api/products", async (req: Request, res: Response) => {
    const db = await readDb();
    let filtered = [...db.products];
    const { search, category, minPrice, maxPrice, location } = req.query;

    if (typeof search === 'string') {
      const s = search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    if (typeof category === 'string') filtered = filtered.filter(p => p.category === category);
    if (typeof minPrice === 'string') filtered = filtered.filter(p => p.price >= Number(minPrice));
    if (typeof maxPrice === 'string') filtered = filtered.filter(p => p.price <= Number(maxPrice));
    if (typeof location === 'string') {
      const l = location.toLowerCase();
      filtered = filtered.filter(p => p.location.toLowerCase().includes(l));
    }

    res.json(filtered);
  });

  app.get("/api/products/:id", async (req, res) => {
    const db = await readDb();
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post("/api/products", authenticateToken, async (req, res) => {
    const db = await readDb();
    const newProduct = {
      ...req.body,
      id: Date.now().toString(),
      sellerId: req.user.id,
      createdAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    await writeDb(db);
    res.status(201).json(newProduct);
  });

  app.delete("/api/products/:id", authenticateToken, async (req, res) => {
    const db = await readDb();
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Not found" });
    
    const product = db.products[index];
    if (product.sellerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    db.products.splice(index, 1);
    await writeDb(db);
    res.sendStatus(204);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
