import { useState, useEffect } from "react";

function App() {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    const getStudents = async () => {
        const response = await fetch("http://localhost:5000/students");
        const data = await response.json();
        setStudents(data);
    };

    const editStudent = (student) => {
        setEditingId(student.id);
        setName(student.name);
    };

    const addStudent = async () => {
        await fetch("http://localhost:5000/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
            }),
        });

        await getStudents();
        setName("");
    };

    const updateStudent = async () => {
        await fetch(`http://localhost:5000/students/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
            }),
        });

        await getStudents();
        setName("");
        setEditingId(null);
    };

    const deleteStudent = async (id) => {
        await fetch(`http://localhost:5000/students/${id}`, {
            method: "DELETE",
        });

        await getStudents();
    };

    useEffect(() => {
        getStudents();
    }, []);

    return (
        <>
            <h1>Student Management</h1>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button
                onClick={editingId === null ? addStudent : updateStudent}
            >
                {editingId === null
                    ? "Add Student"
                    : "Update Student"}
            </button>

            {students.map((student) => (
                <div key={student.id}>
                    {student.name}

                    <button
                        onClick={() => editStudent(student)}
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => deleteStudent(student.id)}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </>
    );
}

export default App;