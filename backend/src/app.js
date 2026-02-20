import "dotenv/config";
import express from "express";
import pool from "./db.js";
import dbMiddleware from "./middlewares/dbCheck.js";
import taskRoutes from "./routes/task.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL("../swagger.json", import.meta.url))
);

const app = express();
app.use(express.json());

app.get("/status", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ message: "API and DB are alive" });
  } catch (e) {
    res.status(500).json({ message: "API is up but DB failed" });
  }
});


app.use(dbMiddleware)
app.use("/task",taskRoutes);
app.use("/auth",authRoutes);
app.use("/admin",adminRoutes);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log("Server is running on port " + port)
);