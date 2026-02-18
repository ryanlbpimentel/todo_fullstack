////////////////////////////// MIDDLEWARE DE AUTENTICAÇÃO DO USUÁRIO //////////////////////////////

const jwt = require("jsonwebtoken");

function auth(req,res,next){
    console.log("autenticando");
    const [tipo, token] = req.headers.authorization.split(' ');

    if (!tipo || !token) return res.status(401).json({erro : "Token ou Tipo ausente"});
    
    if (tipo !== "Bearer" || token === null) return res.status(401).json({erro: "Tipo inconsistente ou token ausente"});

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;

        return next();
    } catch (e){
        return res.status(401).json("Token inválido ou expirado")
    }
}

module.exports = auth;