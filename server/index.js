
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");


const app = express();
const prisma = new PrismaClient();
app.use(cors())
//every request passes through middleware before reaching your routes 
app.use(express.json());

const PORT = 5000;

// let students = [
//     { id: 1, name: "John" },
//     { id: 2, name: "Alice" },
//     { id: 3, name: "Mausam" }
// ];

// app.get("/students", (req, res) => {
//     res.json(students);
// });

app.get("/students", async (req, res) => {
    const students = await prisma.student.findMany();

    res.json(students);
});

app.get("/", (req, res) => {
    res.send("hello from backend");
});

// app.post("/students", (req, res) => {
//     console.log(req.body);

//     res.json({
//         message: "Student received!"
//     });
// });


// app.post("/students", (req, res) => {

//     if(!req.body.name){
//         return res.status(400).json({
//             message:"name field must not be empty"
//         })
//     }
//     const newStudent = {
//         id: students.length + 1,
//         name: req.body.name
//     };

//     students.push(newStudent);

//     res.json({
//         message: "Student added successfully!",
//         student: newStudent
//     });
// });

app.post("/students", async (req, res) => {
try{

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
    res.json(newStudent)
}
catch{
    res.status(500).json({
        message: "Something went wrong"
    })
}
})
app.put("/students/:id", async (req, res) => {
    try {

        const updatedStudent = await prisma.student.update({

            where: {
                id: Number(req.params.id)
            },

            data: {
                name: req.body.name
            }

        });
        res.json(updatedStudent)
    }
    catch (error) {

        res.status(404).json({
            message: "Something went wrong"
        });
    }

});

// app.put("/students/:id", (req, res) => {
//     const id = Number(req.params.id);

//     const student = students.find(student => student.id === id);

//     if (!student) {
//         return res.status(404).json({
//             message: "Student not found"
//         });
//     }

//     student.name = req.body.name;

//     res.json(student);
// });

app.delete("/students/:id", async (req, res) => {
    try {

        const deletedStudent = await prisma.student.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.json(deletedStudent);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }

});

// app.delete("/students/:id", (req, res) => {
//     const id = Number(req.params.id);

//     students = students.filter((student) => student.id !== id);

//     res.json(students);
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});