////////////////////////////// ROTAS DE TAREFAS //////////////////////////////

const router = require("express").Router();
const pool = require("../db");
const auth = require("../middlewares/auth");

////////////////////////////// Rota GET para listar todas as tarefas //////////////////////////////
router.get("/listar", auth, async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const texto = "SELECT id, titulo, descricao, concluida, criado_em, atualizado_em FROM tarefas WHERE usuario_id = $1 ORDER BY criado_em DESC, id DESC";
        const params = [usuario_id];
        const result = await pool.query(texto, params);

        if (result.rowCount === 0) return res.status(200).json({ erro: "Não existem tarefas a serem listadas" });

        return res.status(200).json(result.rows);

    } catch (e) {

        return res.status(500).json({ erro: "erro ao buscar tarefas", detalhe: e.message, codigo: e.code, });

    }
});

////////////////////////////// Rota POST para criar uma nova tarefa //////////////////////////////
router.post("/criar", auth, async (req, res) => {
    const { titulo, descricao } = req.body;
    const usuario_id = req.usuario.id;

    if (!titulo || typeof titulo !== "string" || titulo.trim().length < 2) return res.status(400).json({erro: "Título é obrigatório e deve ter pelo menos 2 caracteres.",});

    try {
        let texto = "SELECT id FROM tarefas WHERE usuario_id = $1 AND titulo = $2";
        let param = [usuario_id, titulo.trim()];

        let result = await pool.query(texto, param);

        if (result.rowCount > 0) return res.status(500).json({ erro: "O titulo da tarefa não pode ser repetido." });

        texto = "INSERT INTO tarefas (usuario_id, titulo, descricao) VALUES ($1,$2,$3) RETURNING id, titulo, descricao, concluida, criado_em, atualizado_em";
        param = [usuario_id, titulo.trim(), descricao ?? null];

        result = await pool.query(texto, param);

        return res.status(201).json(result.rows[0]);

    } catch (e) {

        return res.status(500).json({ erro: "Erro ao criar tarefa", detalhe: e.message, codigo: e.code });

    }
});

////////////////////////////// Rota PATCH para atualizar titulo, descrição e status de uma tarefa //////////////////////////////

router.patch("/atualizar/:id", auth, async (req, res) => {
    const id = Number(req.params.id);
    const usuario_id = req.usuario.id;
    const { titulo, descricao, concluida } = req.body;

    if (!id) return res.status(400).json({ erro: "Id inválido" });

    if (!titulo && (typeof titulo !== "string" || titulo.trim().length < 2)) { return res.status(400).json({ erro: "Titulo deve ser string com pelo menos 2 caracteres" }); }

    if (!concluida && typeof concluida !== "boolean") { return res.status(400).json({ erro: "Concluida deve ser boolean" }); }

    try {
        let texto = "SELECT titulo,id FROM tarefas WHERE usuario_id = $1 AND id = $2";
        let params = [usuario_id,id];
        let result = await pool.query(texto,params);
        
        if (result.rowCount === 0) return res.status(404).json({ erro: "Tarefa não encontrada" }); 
        //else if (result.rows[0].titulo !== titulo && result.rows[0].id !== id) {
            //return res.status(500).json({erro: "Já existe uma tarefa diferente com esse titulo"})
        //};
        

        texto = `UPDATE tarefas SET titulo = COALESCE($1, titulo), descricao = COALESCE($2, descricao), concluida = COALESCE($3, concluida)
        WHERE id = $4 AND usuario_id = $5`;

        params = [
            titulo !== undefined ? titulo.trim() : null,
            descricao !== undefined ? descricao : null,
            concluida !== undefined ? concluida : null,
            id,
            usuario_id,
        ];

        result = await pool.query(texto, params);

        return res.status(200).json({message: "Tarefa atualizada com sucesso!"});

    } catch (e) {
        
        return res.status(500).json({erro: "Erro ao atualizar tarefa", detalhe: e});
    }
});

////////////////////////////// Rota DELETE para apagar uma tarefa já existente //////////////////////////////

router.delete("/deletar/:id", auth, async (req, res) => {
    const id = Number(req.params.id);
    const usuario_id = req.usuario.id;

    if (!id) return res.status(400).json({ erro: "Id inválido" });

    try {
        let texto = "SELECT id FROM tarefas WHERE id = $1 and usuario_id = $2";
        let params = [id, usuario_id];
        let result = await pool.query(texto,params);
        
        if (result.rowCount === 0) return res.status(500).json({ erro: "Tarefa não encontrada"});

        texto = "DELETE FROM tarefas WHERE id = $1";
        params = [id];
        result = await pool.query(texto,params);

        if (result.rowCount === 0) return res.status(404).json({ erro: "Erro interno ao deletar tarefa" });

        return res.status(201).json({message: "Tarefa deletada com sucesso!"})
        
    } catch (e) {
        return res.status(500).json({erro: "Erro ao deletar tarefa", detalhe: e});
    }
});

module.exports = router;