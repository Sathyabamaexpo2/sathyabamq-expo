const JWT = require("jsonwebtoken");

const userAuth = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ err: "Authorization header required" });
        }

        const Token = authHeader.split(" ")[1];
        if (!Token) {
            return res.status(401).json({ err: "Token required" });
        }

        try {
            const decode = JWT.verify(Token,process.env.JWT_SECRET);
            console.log("Decoded Token:", decode);
            req.user = decode;
            next();
        } catch (err) {
            console.error("Token verification failed:", err);
            res.status(401).json({ err: "Token invalid" });
        }
    } catch (err) {
        console.error("Error in Auth middleware:", err);
        res.status(500).json({ err: "Server error" });
    }
};

module.exports = userAuth;