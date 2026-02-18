////////////////////////////// ROTAS DE AUTENTICAÇÃO DO USUÁRIO //////////////////////////////

const router = require("express").Router();
//const authController = require("../controllers/authController");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");


////////////////////////////// ROTA DE REGISTRO DO USUÁRIO //////////////////////////////

router.post("/registrar", async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ erro: "Nome, email ou senha invalidos" });

    try {
        const senha_hash = await bcrypt.hash(senha, 10);
        let texto = "SELECT nome FROM usuarios WHERE email = $1";
        let params = [email];
        let result = check_result = await pool.query(texto,params);

        if(result.rows.length > 0){
            return res.status(409).json({ erro: "Este email já está cadastrado no banco de dados (email repetido)" });
        }

        texto = "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)";
        params = [nome, email, senha_hash];
        result = await pool.query(texto,params);

        if (result.rowCount === 0) {
            return res.status(201).json("Não foi possível criar o usuário por erro interno do banco de dados");
        }
        
        res.status(201).json({message: "Usuário cadastrado com sucesso"});
    } catch (e) {
        res.status(500).json({ erro: "Erro interno do servidor ao tentar registrar usuário", detalhe: e });
    }
});

////////////////////////////// ROTA DE LOGIN DO USUÁRIO //////////////////////////////

router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {return res.status(401).json({ erro: "Email e senha são necessários para realizar o login" });};

    try {
        const texto = "SELECT id,nivel_permissao, senha_hash FROM usuarios WHERE email = $1";
        const params = [email];
        const result = await pool.query(texto,params);

        if (result.rowCount === 0) {return res.status(401).json({ erro: "Não há nenhum usuário registrado com esse email" });}

        const {id,nivel_permissao, senha_hash } = result.rows[0];

        const valido = await bcrypt.compare(senha, senha_hash);

        if (!valido) return res.status(401).json({ erro: "Senha inválida" });

        const token = jwt.sign({id,nivel_permissao}, process.env.JWT_SECRET, { expiresIn: `1d`  });

        res.status(200).json({ token });
    } catch (e) {
        res.status(500).json({ erro: "Erro interno do sistema", codigo: e.code, message: e.message });
    }
});

module.exports = router;