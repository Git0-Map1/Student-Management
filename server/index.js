const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = "mysecretkey"; // Later move this to .env

// ======================
// Authentication Middleware
// ======================

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }
}

// ======================
// Home Route
// ======================

app.get("/", (req, res) => {
    res.send("Hello from Backend");
});

// ======================
// Student Routes (Protected)
// ======================

app.get("/students", authenticateToken, async (req, res) => {

    try {

        const students = await prisma.student.findMany();

        res.json(students);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

});

app.post("/students", authenticateToken, async (req, res) => {

    try {

        if (!req.body.name) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        const newStudent = await prisma.student.create({
            data: {
                name: req.body.name
            }
        });

        res.status(201).json(newStudent);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

});

app.put("/students/:id", authenticateToken, async (req, res) => {

    try {

        const updatedStudent = await prisma.student.update({

            where: {
                id: Number(req.params.id)
            },

            data: {
                name: req.body.name
            }

        });

        res.json(updatedStudent);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

});

app.delete("/students/:id", authenticateToken, async (req, res) => {

    try {

        const deletedStudent = await prisma.student.delete({

            where: {
                id: Number(req.params.id)
            }

        });

        res.json(deletedStudent);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

});

// ======================
// Register
// ======================

app.post("/register", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const existingUser = await prisma.user.findUnique({

            where: {
                email: email
            }

        });

        if (existingUser) {

            return res.status(409).json({
                message: "Email already exists"
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({

            data: {
                email: email,
                password: hashedPassword
            }

        });

        res.status(201).json({

            message: "User registered successfully",

            user: {
                id: newUser.id,
                email: newUser.email
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

});

// ======================
// Login
// ======================

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({

            where: {
                email: email
            }

        });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const token = jwt.sign(

            {
                id: user.id
            },

            JWT_SECRET,

            {
                expiresIn: "1h"
            }

        );

        res.json({

            message: "Login successful",

            token: token

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

});

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);

});