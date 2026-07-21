import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cors from "cors";
import { supabase } from "./supabase.js";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { z } from "zod";
import {
  readStore,
  writeStore,
  type ContentStore,
  type UserRecord,
  type UserRole,
} from "./storage.js";
console.log("SERVER MODULE STARTED");
const ap = express();
console.log("EXPRESS APP CREATED");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const jwtSecret = process.env.JWT_SECRET || "dev-secret";

const allowedOrigins = frontendOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
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

const authorize =
  (roles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
  skills: z.array(
    z.object({ name: z.string().min(1), badge: z.string().min(1), color: z.string().min(1) }),
  ),
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
app.get("/test-db", async (_req, res) => {
  const { data, error } = await supabase.from("projects").select("*");

  res.json({
    data,
    error,
  });
});
app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body as {
    email?: string;
    password?: string;
    name?: string;
  };

  if (!email || !password || !name) {
    res.status(400).json({ error: "Email, password, and name are required" });
    return;
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (existing) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email: email.toLowerCase(),
      password: hashed,
      name,
      role: "USER",
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json({
    token: signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }),
    user: serializeUser(user),
  });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error || !user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.json({
    token: signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

app.get("/api/auth/me", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.user?.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return;
  }

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});
app.get("/api/projects", async (_req, res: Response) => {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    data.map((project) => ({
      ...project,
      techStack: project.techstack,
    })),
  );
});
app.post(
  "/api/projects",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title: parsed.data.title,
        category: parsed.data.category,
        description: parsed.data.description,
        techstack: parsed.data.techStack,
        github: parsed.data.github,
        demo: parsed.data.demo,
        gradient: parsed.data.gradient,
        featured: parsed.data.featured,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({
      ...data,
      techStack: data.techstack,
    });
  },
);
app.put(
  "/api/projects/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = projectSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { data, error } = await supabase
      .from("projects")
      .update({
        title: parsed.data.title,
        category: parsed.data.category,
        description: parsed.data.description,
        techstack: parsed.data.techStack,
        github: parsed.data.github,
        demo: parsed.data.demo,
        gradient: parsed.data.gradient,
        featured: parsed.data.featured,
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      console.error(error);

      if (error.code === "PGRST116") {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.status(500).json({ error: error.message });
      return;
    }

    res.json({
      ...data,
      techStack: data.techstack,
    });
  },
);
app.delete(
  "/api/projects/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { error } = await supabase.from("projects").delete().eq("id", req.params.id);

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(204).send();
  },
);
app.post(
  "/api/projects/:id/image",
  authenticate,
  authorize(["ADMIN"]),
  upload.single("image"),
  async (req: AuthenticatedRequest, res: Response) => {
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
  },
);

app.get("/api/skills", async (_req, res: Response) => {
  const { data, error } = await supabase.from("skills").select("*");

  if (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data);
});
app.post(
  "/api/skills",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = skillSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { data, error } = await supabase
      .from("skills")
      .insert({
        title: parsed.data.title,
        skills: parsed.data.skills,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  },
);

app.put(
  "/api/skills/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = skillSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { data, error } = await supabase
      .from("skills")
      .update({
        title: parsed.data.title,
        skills: parsed.data.skills,
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      console.error(error);

      if (error.code === "PGRST116") {
        res.status(404).json({ error: "Skill group not found" });
        return;
      }

      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  },
);

app.delete(
  "/api/skills/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { error } = await supabase.from("skills").delete().eq("id", req.params.id);

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(204).send();
  },
);
app.get("/api/experience", async (_req, res: Response) => {
  const { data, error } = await supabase.from("experience").select("*");

  if (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data);
});

app.post(
  "/api/experience",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = experienceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { data, error } = await supabase
      .from("experience")
      .insert({
        role: parsed.data.role,
        company: parsed.data.company,
        period: parsed.data.period,
        type: parsed.data.type,
        bullets: parsed.data.bullets,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  },
);

app.put(
  "/api/experience/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = experienceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { data, error } = await supabase
      .from("experience")
      .update({
        role: parsed.data.role,
        company: parsed.data.company,
        period: parsed.data.period,
        type: parsed.data.type,
        bullets: parsed.data.bullets,
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  },
);

app.delete(
  "/api/experience/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { error } = await supabase.from("experience").delete().eq("id", req.params.id);

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(204).send();
  },
);

app.get("/api/certificates", async (_req, res: Response) => {
  const { data, error } = await supabase.from("certificates").select("*");

  if (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data);
});

app.post(
  "/api/certificates",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = certificateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { data, error } = await supabase
      .from("certificates")
      .insert({
        title: parsed.data.title,
        issuer: parsed.data.issuer,
        date: parsed.data.date,
        link: parsed.data.link,
        gradient: parsed.data.gradient,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  },
);

app.put(
  "/api/certificates/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = certificateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { data, error } = await supabase
      .from("certificates")
      .update({
        title: parsed.data.title,
        issuer: parsed.data.issuer,
        date: parsed.data.date,
        link: parsed.data.link,
        gradient: parsed.data.gradient,
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  },
);

app.delete(
  "/api/certificates/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { error } = await supabase.from("certificates").delete().eq("id", req.params.id);

    if (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(204).send();
  },
);

app.get("/api/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", req.user?.id)
    .maybeSingle();
  if (error) {
    console.error(error);
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json({
    profile: {
      id: data.id,
      userId: data.user_id,
      bio: data.bio,
      location: data.location,
      website: data.website,
    },
  });
});

app.put("/api/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = profileSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: userId,
        bio: parsed.data.bio,
        location: parsed.data.location,
        website: parsed.data.website,
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({
    profile: {
      id: data.id,
      userId: data.user_id,
      bio: data.bio,
      location: data.location,
      website: data.website,
    },
  });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, async () => {
    console.log(`Portfolio CMS server listening on http://localhost:${port}`);
  });
}
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    supabaseUrl: !!process.env.SUPABASE_URL,
    supabaseKey: !!process.env.SUPABASE_KEY,
  });
});
export default app;
