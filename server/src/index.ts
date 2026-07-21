import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { supabase } from "./supabase.js";

const app = express();

const port = Number(process.env.PORT || 4000);

const jwtSecret = process.env.JWT_SECRET || "dev-secret";

const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

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

/* =========================
   TYPES
========================= */

type UserRole = "ADMIN" | "USER";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

type AuthenticatedRequest = Request & {
  user?: AuthUser;
};

/* =========================
   AUTHENTICATION
========================= */

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const header = req.header("authorization");

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Missing bearer token",
    });
    return;
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthUser;

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

const authorize =
  (roles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        error: "Forbidden",
      });
      return;
    }

    next();
  };

const signToken = (user: AuthUser) => {
  return jwt.sign(user, jwtSecret, {
    expiresIn: "7d",
  });
};

/* =========================
   VALIDATION SCHEMAS
========================= */

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
    z.object({
      name: z.string().min(1),
      badge: z.string().min(1),
      color: z.string().min(1),
    }),
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

/* =========================
   HEALTH
========================= */

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    status: "healthy",
    supabaseConfigured: Boolean(process.env.SUPABASE_URL) && Boolean(process.env.SUPABASE_KEY),
  });
});

/* =========================
   AUTH - REGISTER
========================= */

app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password || !name) {
      res.status(400).json({
        error: "Email, password, and name are required",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase();

    const { data: existing, error: existingError } = await supabase
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);

      res.status(500).json({
        error: existingError.message,
      });

      return;
    }

    if (existing) {
      res.status(409).json({
        error: "Email already in use",
      });

      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email: normalizedEmail,
        password: hashedPassword,
        name,
        role: "USER",
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.status(201).json({
      token: signToken(authUser),
      user: authUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Registration failed",
    });
  }
});

/* =========================
   AUTH - LOGIN
========================= */

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      res.status(400).json({
        error: "Email and password are required",
      });

      return;
    }

    const normalizedEmail = email.toLowerCase();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    if (!user) {
      res.status(401).json({
        error: "Invalid credentials",
      });

      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(401).json({
        error: "Invalid credentials",
      });

      return;
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.json({
      token: signToken(authUser),
      user: authUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Login failed",
    });
  }
});

/* =========================
   AUTH - ME
========================= */

app.get("/api/auth/me", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      error: "Unauthorized",
    });

    return;
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, name, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });

    return;
  }

  if (!user) {
    res.status(404).json({
      error: "User not found",
    });

    return;
  }

  res.json({
    user,
  });
});

/* =========================
   PROJECTS - GET
========================= */

app.get("/api/projects", async (_req, res: Response) => {
  const { data, error } = await supabase.from("projects").select("*").order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });

    return;
  }

  res.json(
    data.map((project) => ({
      ...project,
      techStack: project.techstack,
    })),
  );
});

/* =========================
   PROJECTS - CREATE
========================= */

app.post(
  "/api/projects",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = projectSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.flatten(),
      });

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

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.status(201).json({
      ...data,
      techStack: data.techstack,
    });
  },
);

/* =========================
   PROJECTS - UPDATE
========================= */

app.put(
  "/api/projects/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = projectSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.flatten(),
      });

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

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.json({
      ...data,
      techStack: data.techstack,
    });
  },
);

/* =========================
   PROJECTS - DELETE
========================= */

app.delete(
  "/api/projects/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { error } = await supabase.from("projects").delete().eq("id", req.params.id);

    if (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.status(204).send();
  },
);

/* =========================
   SKILLS - GET
========================= */

app.get("/api/skills", async (_req, res: Response) => {
  const { data, error } = await supabase.from("skills").select("*").order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });

    return;
  }

  res.json(data);
});

/* =========================
   SKILLS - CREATE
========================= */

app.post(
  "/api/skills",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = skillSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.flatten(),
      });

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

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.status(201).json(data);
  },
);

/* =========================
   SKILLS - UPDATE
========================= */

app.put(
  "/api/skills/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = skillSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.flatten(),
      });

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

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.json(data);
  },
);

/* =========================
   SKILLS - DELETE
========================= */

app.delete(
  "/api/skills/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { error } = await supabase.from("skills").delete().eq("id", req.params.id);

    if (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.status(204).send();
  },
);

/* =========================
   EXPERIENCE - GET
========================= */

app.get("/api/experience", async (_req, res: Response) => {
  const { data, error } = await supabase.from("experience").select("*").order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });

    return;
  }

  res.json(data);
});

/* =========================
   EXPERIENCE - CREATE
========================= */

app.post(
  "/api/experience",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = experienceSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.flatten(),
      });

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

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.status(201).json(data);
  },
);

/* =========================
   EXPERIENCE - UPDATE
========================= */

app.put(
  "/api/experience/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = experienceSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.flatten(),
      });

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

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.json(data);
  },
);

/* =========================
   EXPERIENCE - DELETE
========================= */

app.delete(
  "/api/experience/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { error } = await supabase.from("experience").delete().eq("id", req.params.id);

    if (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.status(204).send();
  },
);

/* =========================
   CERTIFICATES - GET
========================= */

app.get("/api/certificates", async (_req, res: Response) => {
  const { data, error } = await supabase.from("certificates").select("*").order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });

    return;
  }

  res.json(data);
});

/* =========================
   CERTIFICATES - CREATE
========================= */

app.post(
  "/api/certificates",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = certificateSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.flatten(),
      });

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

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.status(201).json(data);
  },
);

/* =========================
   CERTIFICATES - UPDATE
========================= */

app.put(
  "/api/certificates/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = certificateSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.flatten(),
      });

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

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.json(data);
  },
);

/* =========================
   CERTIFICATES - DELETE
========================= */

app.delete(
  "/api/certificates/:id",
  authenticate,
  authorize(["ADMIN"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { error } = await supabase.from("certificates").delete().eq("id", req.params.id);

    if (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });

      return;
    }

    res.status(204).send();
  },
);

/* =========================
   PROFILE - GET
========================= */

app.get("/api/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      error: "Unauthorized",
    });

    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });

    return;
  }

  if (!data) {
    res.json({
      profile: null,
    });

    return;
  }

  res.json({
    profile: {
      id: data.id,
      userId: data.user_id,
      bio: data.bio,
      avatarUrl: data.avatar_url,
      location: data.location,
      website: data.website,
    },
  });
});

/* =========================
   PROFILE - UPDATE
========================= */

app.put("/api/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = profileSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.flatten(),
    });

    return;
  }

  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      error: "Unauthorized",
    });

    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: userId,
        bio: parsed.data.bio,
        avatar_url: parsed.data.avatarUrl,
        location: parsed.data.location,
        website: parsed.data.website,
      },
      {
        onConflict: "user_id",
      },
    )
    .select()
    .single();

  if (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });

    return;
  }

  res.json({
    profile: {
      id: data.id,
      userId: data.user_id,
      bio: data.bio,
      avatarUrl: data.avatar_url,
      location: data.location,
      website: data.website,
    },
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
});

/* =========================
   LOCAL SERVER ONLY
========================= */

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Portfolio CMS server listening on http://localhost:${port}`);
  });
}

export default app;
