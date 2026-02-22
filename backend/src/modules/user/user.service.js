import { verifyEmail, registerUser } from "./user.repository.js";
import { hashPassword, comparePassword } from "../../shared/utils/hash.js";
import { isValidEmail } from "../../shared/utils/validation.js";
import generateToken from "../../shared/utils/token.js";


export async function registerUserService({ name, email, password }) {
    if (!name || !email || !password) throw new Error("Name, email and password are required to register", 400);
    if (!isValidEmail(email)) throw new Error("Invalid email format", 400);

    const password_hash = await hashPassword(password);
    if (!password_hash) throw new Error("Error hashing password", 500);

    const verify = await verifyEmail(email);
    if (verify) throw new Error("User already exists", 409);

    const user = await registerUser(name, email, password_hash);
    if (!user) throw new Error("Unable to register user due to internal DB error", 500);

    return user;
}

export async function loginUserService({ email, password }) {
    if (!email || !password) throw new Error("Email and password are required to login", 400);
    if (!isValidEmail(email)) throw new Error("Invalid email format");

    const verify = await verifyEmail(email);
    if (!verify) throw new Error("No user registered with this email");

    const { id, permission_level, password_hash } = verify;

    const valido = await comparePassword(password, password_hash);
    if (!valido) throw new Error("Invalid password");

    const token = generateToken(id, permission_level);
    if (!token) throw new Error("Unable to login due to internal DB error");

    return token;
}  