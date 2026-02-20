import {verifyEmail, registerUser as registerUserService} from "../services/authServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUser(req,res){
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email or password invalid" });

    try {
        const password_hash = await bcrypt.hash(password, 10);  
        const verify = await verifyEmail(email);
        console.log("teste")
        if(verify.rows.length > 0){
            return res.status(409).json({ error: "This email is already registered" });
        }

        const register = await registerUserService(name,email,password_hash);

        if (register.rowCount === 0) {
            return res.status(201).json({ error: "Unable to create user due to internal DB error" });
        }
        
        res.status(201).json({ message: "User successfully registered" });
    } catch (e) {
        res.status(500).json({ error: "Internal server error while registering user", detail: e });
    }
}

export async function loginUser(req,res) {
    const { email, password } = req.body;

    if (!email || !password) {return res.status(401).json({ error: "Email and password are required to login" });};

    try {
        const verify = await verifyEmail(email);
        console.log(verify.rows[0]);
        if (verify.rows.length === 0) {return res.status(401).json({ error: "No user registered with this email" });}
        
        const {id, permission_level, password_hash } = verify.rows[0];
        
        const valido = await bcrypt.compare(password, password_hash);
        
        if (!valido) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({id,permission_level}, process.env.JWT_SECRET, { expiresIn: `1h`  });

        res.status(200).json({ token });
    } catch (e) {
        res.status(500).json({ error: "Internal system error", code: e.code, message: e.message });
    }
}  