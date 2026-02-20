import jwt from "jsonwebtoken";
import { listUserById } from "../services/adminServices.js";

async function auth(req, res, next) {
    console.log("authenticating");
    if (!req.headers || !req.headers.authorization) return res.status(401).json({ error: "Authorization header missing" });

    const [type, token] = req.headers.authorization.split(' ');

    if (!type || !token) return res.status(401).json({ error: "Token or type missing" });

    if (type !== "Bearer") return res.status(401).json({ error: "Invalid authorization type" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = payload;
        const id = Number(req.user.id);
        const searchedUser = await listUserById(id);

        if (searchedUser.rowCount === 0) return res.status(401).json({ error: `Unable to authenticate: user id ${id} from token does not exist` });

        return next();
    } catch (e) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}

export default auth