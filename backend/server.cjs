const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");

const app = express();
const PORT = 3000;
const FILE_PATH = "./backend/db.json";
const CONFIG_FILE_PATH = "./backend/config.json";

// Default schema
const defaultDB = {
    guestbooks: [],
    posts: [],
    projects: [],
    articles: [],
};

// Default config
const defaultConfig = {
    server: {
        host: "localhost",
        port: 3000,
    },
    configuration: {
        githubURL: "",
        adminDashboard: true,
        multipleThemes: true,
        enableSearch: true,
        searchModels: ["projects", "guestbooks", "articles", "posts"],
    },
    theme: {
        defaultTheme: "light",
    },
    security: {
        debug: true,
        adminFingerprintSignature: "",
    }
}

// Logger function
const log = (message, level = "info") => {
    const colors = { info: "\x1b[32m", warn: "\x1b[33m", error: "\x1b[31m" };
    const color = colors[level] || colors.info;
    console.log(`${color}${level}\x1b[0m: ${new Date().toISOString()} | ${message}`);
};

// Middleware
const loggerMiddleware = (req, res, next) => {
    log(`${req.method} ${req.url}`, "info");
    next();
};

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

// Function to initialize database
const initializeDatabase = async () => {
    try {
        await fs.access(FILE_PATH);
        log("Database exists", "info");
    } catch {
        log("Database does not exist, creating it...", "info");
        await fs.writeFile(FILE_PATH, JSON.stringify(defaultDB, null, 2));
    }
};

// Function to initialize config
const initializeConfig = async () => {
    try {
        await fs.access(CONFIG_FILE_PATH);
        log("Config exists", "info");
    } catch {
        log("Config does not exist, creating it...", "info");
        await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(defaultConfig, null, 2));
    }
};


// Database operations
const readDatabase = async () => {
    const data = await fs.readFile(FILE_PATH, "utf8");
    return JSON.parse(data || JSON.stringify(defaultDB));
};

// Database operations
const readConfig = async () => {
    const data = await fs.readFile(CONFIG_FILE_PATH, "utf8");
    return JSON.parse(data || JSON.stringify(defaultConfig));
};

const writeDatabase = async (dbData) => {
    await fs.writeFile(FILE_PATH, JSON.stringify(dbData, null, 2));
};

const writeConfig = async (configData) => {
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(configData, null, 2));
};

// Supported Endpoints
const endpoints = {
    "/": "Home",
    "/guestbooks (GET)": "List guestbook entries with pagination & sorting",
    "/guestbooks (POST)": "Add a new guestbook entry",
    "/guestbooks/:id (DELETE)": "Delete guestbook entry by ID",
    "/projects (GET)": "List projects",
    "/projects (POST)": "Add a new project",
    "/projects/:id (DELETE)": "Delete project by ID",
    "/articles (GET)": "List articles",
    "/articles (POST)": "Add a new article",
    "/articles/:id (DELETE)": "Delete article by ID",
    "/posts (GET)": "List blog posts",
    "/posts (POST)": "Add a new blog post",
    "/posts/:id (DELETE)": "Delete blog post by ID",
};



// Endpoints
// Home route
app.get("/", (req, res) => {
    res.json({ status: "200 OK", healthy: true, api: "Portfolio API", endpoints });
});

// Settings CRUD
app.get("/settings", async (req, res) => {
    try {
        const configData = await readConfig()
        // TODO: handle responed only with the requisted fields
        res.json({ data: configData });
    } catch (error) {
        log(`Failed to read config: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
})

app.post("/settings", async (req, res) => {
    try {
        const configData = await readConfig()
        // TODO: Some validation needed here
        for (const [key, value] of Object.entries(req.body)) {
            if (key in configData) {
                continue
            }
            log(`Unknown config key: ${key}`, 'error');
            return res.status(400).json({ error: `Unknown config key: ${key}` });
        }
        await writeConfig(req.body)
        res.json({ data: req.body, message: "Config updated!" });
    } catch (error) {
        log(`Failed to read config: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
})

// Guestbooks CRUD
app.get("/guestbooks", async (req, res) => {
    try {
        const dbData = await readDatabase();
        let guestbooks = [...dbData.guestbooks];
        // if (req.query.sort === "true") {
        // guestbooks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        // }
        // const limit = parseInt(req.query.limit) || 10;
        // const page = parseInt(req.query.page) || 1;
        // const startIndex = (page - 1) * limit;
        // guestbooks = guestbooks.slice(startIndex, startIndex + limit);
        res.json({ data: guestbooks, total: guestbooks.length });
    } catch (error) {
        log(`Failed to read guestbooks: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

// Add guestbook
app.post("/guestbooks", async (req, res) => {
    try {
        const dbData = await readDatabase();
        const guestbooks = [...dbData.guestbooks];
        const newEntry = { id: guestbooks.length + 1, createdAt: new Date().toISOString(), status: "created", ...req.body };
        dbData.guestbooks.push(newEntry);
        await writeDatabase(dbData);
        res.json({ message: "Guestbook entry added!", data: newEntry });
    } catch (error) {
        log(`Failed to post guestbook: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

// Delete guestbook
app.delete("/guestbooks/:id", async (req, res) => {
    try {
        const dbData = await readDatabase();
        const index = dbData.guestbooks.findIndex((entry) => entry.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ message: "Guestbook entry not found" });
        }
        dbData.guestbooks.splice(index, 1);
        await writeDatabase(dbData);
        res.json({ message: "Guestbook entry deleted!" });
    } catch (error) {
        log(`Failed to delete guestbook: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

// Projects CRUD
app.get("/projects", async (req, res) => {
    try {
        const dbData = await readDatabase();
        let projects = [...dbData.projects];
        const totalProjects = projects.length;
        if (req.query.sort === "true") {
            projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const startIndex = (page - 1) * limit;
        projects = projects.slice(startIndex, startIndex + limit);
        res.json({ data: projects, total: totalProjects });
    } catch (error) {
        log(`Failed to read projects: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

// Add project
app.post("/projects", async (req, res) => {
    try {
        const dbData = await readDatabase();
        const projects = [...dbData.projects];
        const newEntry = { id: projects.length + 1, createdAt: new Date().toISOString(), status: "created", ...req.body };
        dbData.projects.push(newEntry);
        await writeDatabase(dbData);
        res.json({ message: "Project added!", data: newEntry });
    } catch (error) {
        log(`Failed to post project: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

// Get project
app.get("/projects/:id", async (req, res) => {
    try {
        const dbData = await readDatabase();
        const project = dbData.projects.find((project) => project.id === parseInt(req.params.id));
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (error) {
        log(`Failed to read project: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

// Delete project
app.delete("/projects/:id", async (req, res) => {
    try {
        const dbData = await readDatabase();
        const index = dbData.projects.findIndex((project) => project.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ message: "Project not found" });
        }
        dbData.projects.splice(index, 1);
        await writeDatabase(dbData);
        res.json({ message: "Project deleted!" });
    } catch (error) {
        log(`Failed to delete project: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

// Articles CRUD
app.get("/articles", async (req, res) => {
    try {
        const dbData = await readDatabase();
        let articles = [...dbData.articles];
        const totalArticles = articles.length;
        if (req.query.sort === "true") {
            articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const startIndex = (page - 1) * limit;
        articles = articles.slice(startIndex, startIndex + limit);
        res.json({ data: articles, total: totalArticles });
    } catch (error) {
        log(`Failed to read articles: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

app.post("/articles", async (req, res) => {
    try {
        const dbData = await readDatabase();
        const articles = [...dbData.articles];
        const newEntry = { id: articles.length + 1, createdAt: new Date().toISOString(), status: "created", ...req.body };
        dbData.articles.push(newEntry);
        await writeDatabase(dbData);
        res.json({ message: "Article added!", data: newEntry });
    } catch (error) {
        log(`Failed to post article: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

app.get("/articles/:id", async (req, res) => {
    try {
        const dbData = await readDatabase();
        const article = dbData.articles.find((article) => article.id === parseInt(req.params.id));
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.json(article);
    } catch (error) {
        log(`Failed to read article: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

// Posts CRUD
app.get("/posts", async (req, res) => {
    try {
        const dbData = await readDatabase();
        res.json(dbData.posts);
    } catch (error) {
        log(`Failed to read posts: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

app.post("/posts", async (req, res) => {
    try {
        const dbData = await readDatabase();
        dbData.posts.push(req.body);
        await writeDatabase(dbData);
        res.json({ message: "Post added!", data: req.body });
    } catch (error) {
        log(`Failed to add post: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

app.get("/posts/:id", async (req, res) => {
    try {
        const dbData = await readDatabase();
        const post = dbData.posts.find((post) => post.id === parseInt(req.params.id));
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        log(`Failed to read post: ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});


// Start server
const startServer = async () => {
    await initializeDatabase();
    await initializeConfig();
    app.listen(PORT, () => {
        log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();
