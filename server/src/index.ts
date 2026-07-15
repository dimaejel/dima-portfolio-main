import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { z } from "zod";
import { readStore, writeStore, type ContentStore, type UserRecord, type UserRole } from "./storage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const jwtSecret = process.env.JWT_SECRET || "dev-secret";

app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "..", "uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }
    cb(new Error("Only image uploads are allowed"));
  },
});

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

type AuthenticatedRequest = Request & { user?: AuthUser };

const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const authorize = (roles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
};

const serializeUser = (user: UserRecord) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  profile: user.profile,
});

const signToken = (user: AuthUser) => jwt.sign(user, jwtSecret, { expiresIn: "7d" });

const projectSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.string()),
  github: z.string().optional().default("#"),
  demo: z.string().optional().default("#"),
  gradient: z.string().optional().default("from-slate-500 to-slate-600"),
  featured: z.boolean().optional().default(false),
});

const skillSchema = z.object({
  title: z.string().min(1),
  skills: z.array(z.object({ name: z.string().min(1), badge: z.string().min(1), color: z.string().min(1) })),
});

const experienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  type: z.string().min(1),
  bullets: z.array(z.string()),
});

const certificateSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().min(1),
  link: z.string().min(1),
  gradient: z.string().min(1),
});

const profileSchema = z.object({
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, status: "healthy" });
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
  if (!email || !password || !name) {
    res.status(400).json({ error: "Email, password, and name are required" });
    return;
  }

  const store = await readStore();
  const existing = store.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user: UserRecord = {
    id: randomUUID(),
    email,
    password: hashed,
    name,
    role: "USER",
    createdAt: new Date().toISOString(),
    profile: {
      id: randomUUID(),
      userId: "",
      bio: "",
      location: "",
      website: "",
    },
  };
  user.profile!.userId = user.id;

  store.users.push(user);
  await writeStore(store);

  res.status(201).json({ token: signToken({ id: user.id, email: user.email, name: user.name, role: user.role }), user: serializeUser(user) });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const store = await readStore();
  const user = store.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.json({ token: signToken({ id: user.id, email: user.email, name: user.name, role: user.role }), user: serializeUser(user) });
});

app.get("/api/auth/me", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const store = await readStore();
  const user = store.users.find((entry) => entry.id === req.user?.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user: serializeUser(user) });
});

app.get("/api/projects", async (_req, res: Response) => {
  const store = await readStore();
  res.json(store.projects);
});

app.post("/api/projects", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const store = await readStore();
  const project = { id: randomUUID(), ...parsed.data };
  store.projects.unshift(project);
  await writeStore(store);
  res.status(201).json(project);
});

app.put("/api/projects/:id", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const store = await readStore();
  const index = store.projects.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  store.projects[index] = { ...store.projects[index], ...parsed.data };
  await writeStore(store);
  res.json(store.projects[index]);
});

app.delete("/api/projects/:id", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const store = await readStore();
  store.projects = store.projects.filter((item) => item.id !== req.params.id);
  await writeStore(store);
  res.status(204).send();
});

app.post("/api/projects/:id/image", authenticate, authorize(["ADMIN"]), upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No image uploaded" });
    return;
  }

  const store = await readStore();
  const index = store.projects.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  store.projects[index].gradient = `/uploads/${req.file.filename}`;
  await writeStore(store);
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

app.get("/api/skills", async (_req, res: Response) => {
  const store = await readStore();
  res.json(store.skills);
});

app.post("/api/skills", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = skillSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const store = await readStore();
  const skill = { id: randomUUID(), ...parsed.data };
  store.skills.unshift(skill);
  await writeStore(store);
  res.status(201).json(skill);
});

app.put("/api/skills/:id", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = skillSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const store = await readStore();
  const index = store.skills.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    res.status(404).json({ error: "Skill group not found" });
    return;
  }

  store.skills[index] = { ...store.skills[index], ...parsed.data };
  await writeStore(store);
  res.json(store.skills[index]);
});

app.delete("/api/skills/:id", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const store = await readStore();
  store.skills = store.skills.filter((item) => item.id !== req.params.id);
  await writeStore(store);
  res.status(204).send();
});

app.get("/api/experience", async (_req, res: Response) => {
  const store = await readStore();
  res.json(store.experience);
});

app.post("/api/experience", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = experienceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const store = await readStore();
  const experience = { id: randomUUID(), ...parsed.data };
  store.experience.unshift(experience);
  await writeStore(store);
  res.status(201).json(experience);
});

app.put("/api/experience/:id", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = experienceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const store = await readStore();
  const index = store.experience.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    res.status(404).json({ error: "Experience entry not found" });
    return;
  }

  store.experience[index] = { ...store.experience[index], ...parsed.data };
  await writeStore(store);
  res.json(store.experience[index]);
});

app.delete("/api/experience/:id", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const store = await readStore();
  store.experience = store.experience.filter((item) => item.id !== req.params.id);
  await writeStore(store);
  res.status(204).send();
});

app.get("/api/certificates", async (_req, res: Response) => {
  const store = await readStore();
  res.json(store.certificates);
});

app.post("/api/certificates", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = certificateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const store = await readStore();
  const certificate = { id: randomUUID(), ...parsed.data };
  store.certificates.unshift(certificate);
  await writeStore(store);
  res.status(201).json(certificate);
});

app.put("/api/certificates/:id", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = certificateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const store = await readStore();
  const index = store.certificates.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    res.status(404).json({ error: "Certificate not found" });
    return;
  }

  store.certificates[index] = { ...store.certificates[index], ...parsed.data };
  await writeStore(store);
  res.json(store.certificates[index]);
});

app.delete("/api/certificates/:id", authenticate, authorize(["ADMIN"]), async (req: AuthenticatedRequest, res: Response) => {
  const store = await readStore();
  store.certificates = store.certificates.filter((item) => item.id !== req.params.id);
  await writeStore(store);
  res.status(204).send();
});

app.get("/api/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const store = await readStore();
  const user = store.users.find((entry) => entry.id === req.user?.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ profile: user.profile });
});

app.put("/api/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const store = await readStore();
  const user = store.users.find((entry) => entry.id === req.user?.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  user.profile = { ...(user.profile || { id: randomUUID(), userId: user.id }), ...parsed.data, userId: user.id };
  await writeStore(store);
  res.json({ profile: user.profile });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Portfolio CMS server listening on http://localhost:${port}`);
});
