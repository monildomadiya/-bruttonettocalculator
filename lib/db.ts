import mysql from "mysql2/promise";

// Global type for connection pool caching in Next.js development
declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

export interface Article {
  id?: number;
  headline: string;
  slug: string;
  category?: string;
  tags?: string;
  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  canonical_url?: string;
  featured_image?: string;
  featured_image_alt?: string;
  featured_image_caption?: string;
  enable_toc?: boolean;
  content?: string;
  faqs?: string | any; // JSON string or parsed array
  og_title?: string;
  og_description?: string;
  og_image?: string;
  status?: string;
  read_time?: string;
  created_at?: string;
  updated_at?: string;
}

// Create MySQL connection pool
function getPool(): mysql.Pool {
  if (global._mysqlPool) {
    return global._mysqlPool;
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "darshan",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "Darshan@2000-",
    database: process.env.DB_NAME || "bruttonetto_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  if (process.env.NODE_ENV !== "production") {
    global._mysqlPool = pool;
  }

  return pool;
}

// In-memory fallback store if local MySQL server is offline during development/testing
let fallbackArticles: Article[] = [];

let isDbInitialized = false;

// Initialize tables
export async function initDb() {
  if (isDbInitialized) return;
  try {
    const pool = getPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        headline VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100),
        tags VARCHAR(255),
        excerpt TEXT,
        meta_title VARCHAR(255),
        meta_description VARCHAR(500),
        focus_keyword VARCHAR(100),
        canonical_url VARCHAR(255),
        featured_image VARCHAR(500),
        featured_image_alt VARCHAR(255),
        featured_image_caption VARCHAR(255),
        enable_toc BOOLEAN DEFAULT TRUE,
        content LONGTEXT,
        faqs JSON,
        og_title VARCHAR(255),
        og_description VARCHAR(500),
        og_image VARCHAR(500),
        status VARCHAR(50) DEFAULT 'Published',
        read_time VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    isDbInitialized = true;
    console.log("✅ MySQL articles table checked/initialized successfully.");

    // Seeding is disabled so user can delete articles without them coming back
    // console.log("✅ MySQL articles table checked/initialized successfully.");
  } catch (err: any) {
    console.warn("⚠️ MySQL offline or connection failed. Using resilient fallback store:", err.message);
  }
}

// Execute query with fallback support
export async function dbQuery<T = any>(sql: string, params: any[] = []): Promise<T> {
  await initDb();
  try {
    const pool = getPool();
    const [rows] = await pool.query(sql, params);
    return rows as T;
  } catch (err: any) {
    console.warn(`⚠️ MySQL Query failed (${err.message}). Intercepting with resilient fallback store.`);
    // Fallback CRUD handling
    const sqlUpper = sql.trim().toUpperCase();
    if (sqlUpper.startsWith("SELECT")) {
      if (sqlUpper.includes("WHERE SLUG =")) {
        const targetSlug = params[0];
        const found = fallbackArticles.find((a) => a.slug === targetSlug);
        return (found ? [found] : []) as any;
      }
      return fallbackArticles as any;
    } else if (sqlUpper.startsWith("INSERT")) {
      const newId = (fallbackArticles.length > 0 ? Math.max(...fallbackArticles.map(a => a.id || 0)) : 0) + 1;
      const newArt: Article = {
        id: newId,
        headline: params[0] || "",
        slug: params[1] || `article-${newId}`,
        category: params[2] || "",
        tags: params[3] || "",
        excerpt: params[4] || "",
        meta_title: params[5] || "",
        meta_description: params[6] || "",
        focus_keyword: params[7] || "",
        canonical_url: params[8] || "",
        featured_image: params[9] || "",
        featured_image_alt: params[10] || "",
        featured_image_caption: params[11] || "",
        enable_toc: params[12] !== undefined ? Boolean(params[12]) : true,
        content: params[13] || "",
        faqs: typeof params[14] === "string" ? params[14] : JSON.stringify(params[14] || []),
        og_title: params[15] || "",
        og_description: params[16] || "",
        og_image: params[17] || "",
        status: params[18] || "Published",
        read_time: params[19] || "3 min read",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      fallbackArticles.unshift(newArt);
      return { insertId: newId, affectedRows: 1 } as any;
    } else if (sqlUpper.startsWith("UPDATE")) {
      const targetSlug = params[params.length - 1];
      const idx = fallbackArticles.findIndex(a => a.slug === targetSlug || a.id === Number(targetSlug));
      if (idx !== -1) {
        fallbackArticles[idx] = {
          ...fallbackArticles[idx],
          headline: params[0] !== undefined ? params[0] : fallbackArticles[idx].headline,
          slug: params[1] !== undefined ? params[1] : fallbackArticles[idx].slug,
          category: params[2] !== undefined ? params[2] : fallbackArticles[idx].category,
          tags: params[3] !== undefined ? params[3] : fallbackArticles[idx].tags,
          excerpt: params[4] !== undefined ? params[4] : fallbackArticles[idx].excerpt,
          meta_title: params[5] !== undefined ? params[5] : fallbackArticles[idx].meta_title,
          meta_description: params[6] !== undefined ? params[6] : fallbackArticles[idx].meta_description,
          focus_keyword: params[7] !== undefined ? params[7] : fallbackArticles[idx].focus_keyword,
          canonical_url: params[8] !== undefined ? params[8] : fallbackArticles[idx].canonical_url,
          featured_image: params[9] !== undefined ? params[9] : fallbackArticles[idx].featured_image,
          featured_image_alt: params[10] !== undefined ? params[10] : fallbackArticles[idx].featured_image_alt,
          featured_image_caption: params[11] !== undefined ? params[11] : fallbackArticles[idx].featured_image_caption,
          enable_toc: params[12] !== undefined ? Boolean(params[12]) : fallbackArticles[idx].enable_toc,
          content: params[13] !== undefined ? params[13] : fallbackArticles[idx].content,
          faqs: params[14] !== undefined ? (typeof params[14] === "string" ? params[14] : JSON.stringify(params[14])) : fallbackArticles[idx].faqs,
          og_title: params[15] !== undefined ? params[15] : fallbackArticles[idx].og_title,
          og_description: params[16] !== undefined ? params[16] : fallbackArticles[idx].og_description,
          og_image: params[17] !== undefined ? params[17] : fallbackArticles[idx].og_image,
          status: params[18] !== undefined ? params[18] : fallbackArticles[idx].status,
          read_time: params[19] !== undefined ? params[19] : fallbackArticles[idx].read_time,
          updated_at: new Date().toISOString(),
        };
      }
      return { affectedRows: idx !== -1 ? 1 : 0 } as any;
    } else if (sqlUpper.startsWith("DELETE")) {
      const targetSlug = params[0];
      const beforeLen = fallbackArticles.length;
      fallbackArticles = fallbackArticles.filter(a => a.slug !== targetSlug && a.id !== Number(targetSlug));
      return { affectedRows: beforeLen - fallbackArticles.length } as any;
    }
    return [] as any;
  }
}
