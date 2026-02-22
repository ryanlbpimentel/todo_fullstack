import jwt from "jsonwebtoken";

function generateToken(id, permission_level) {
    const token = jwt.sign({ id, permission_level }, process.env.JWT_SECRET, { expiresIn: `1h` });
    return token;
}

export default generateToken;