require("dotenv").config();
const express = require("express");
const pool = require("./db");
const app = express();
const tarefasRoutes = require("./routes/tarefas");
const authRoutes = require("./routes/auth");
const port = process.env.PORT || 3001;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use("/tarefas",tarefasRoutes);
app.use("/auth",authRoutes);

app.get("/status", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ mensagem: "API e BANCO vivos " });
  } catch (e) {
    res.status(500).json({
      mensagem: "API viva, mas BANCO falhou",
      balco: false,
    });
  }
});

app.listen(port, () =>
  console.log("Servidor HTTP rodando na porta local 3001"),
);