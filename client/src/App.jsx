// import { useState, useEffect } from "react";

// function App() {
//     const [students, setStudents] = useState([]);
//     const [name, setName] = useState("");
//     const [editingId, setEditingId] = useState(null);

//     const getStudents = async () => {
//         const response = await fetch("http://localhost:5000/students");
//         const data = await response.json();
//         setStudents(data);
//     };

//     const editStudent = (student) => {
//         setEditingId(student.id);
//         setName(student.name);
//     };

//     const addStudent = async () => {
//         await fetch("http://localhost:5000/students", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 name: name,
//             }),
//         });

//         await getStudents();
//         setName("");
//     };

//     const updateStudent = async () => {
//         await fetch(`http://localhost:5000/students/${editingId}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 name: name,
//             }),
//         });

//         await getStudents();
//         setName("");
//         setEditingId(null);
//     };

//     const deleteStudent = async (id) => {
//         await fetch(`http://localhost:5000/students/${id}`, {
//             method: "DELETE",
//         });

//         await getStudents();
//     };

//     useEffect(() => {
//         getStudents();
//     }, []);

//     return (
//         <>
//             <h1>Student Management</h1>

//             <input
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//             />

//             <button
//                 onClick={editingId === null ? addStudent : updateStudent}
//             >
//                 {editingId === null
//                     ? "Add Student"
//                     : "Update Student"}
//             </button>

//             {students.map((student) => (
//                 <div key={student.id}>
//                     {student.name}

//                     <button
//                         onClick={() => editStudent(student)}
//                     >
//                         Edit
//                     </button>

//                     <button
//                         onClick={() => deleteStudent(student.id)}
//                     >
//                         Delete
//                     </button>

//                 </div>
//             ))}

//         </>
//     );
// }

// export default App;

import { useState, useEffect } from "react";

function App() {
    // ======================
    // Authentication States
    // ======================
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ======================
    // Student States
    // ======================
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    // ======================
    // Helper
    // ======================

    const getToken = () => localStorage.getItem("token");

    // ======================
    // Register
    // ======================

    const register = async () => {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        alert(data.message);
    };

    // ======================
    // Login
    // ======================

    const login = async () => {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);

            setIsLoggedIn(true);

            getStudents();

            alert("Login Successful");
        } else {
            alert(data.message);
        }
    };

    // ======================
    // Logout
    // ======================

    const logout = () => {
        localStorage.removeItem("token");

        setIsLoggedIn(false);

        setStudents([]);
    };

    // ======================
    // Get Students
    // ======================

    const getStudents = async () => {
        const token = getToken();

        const response = await fetch("http://localhost:5000/students", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            setIsLoggedIn(false);
            return;
        }

        const data = await response.json();

        setStudents(data);
    };

    // ======================
    // Add Student
    // ======================

    const addStudent = async () => {
        const token = getToken();

        await fetch("http://localhost:5000/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
            }),
        });

        setName("");

        getStudents();
    };

    // ======================
    // Edit Student
    // ======================

    const editStudent = (student) => {
        setEditingId(student.id);
        setName(student.name);
    };

    // ======================
    // Update Student
    // ======================

    const updateStudent = async () => {
        const token = getToken();

        await fetch(`http://localhost:5000/students/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
            }),
        });

        setEditingId(null);
        setName("");

        getStudents();
    };

    // ======================
    // Delete Student
    // ======================

    const deleteStudent = async (id) => {
        const token = getToken();

        await fetch(`http://localhost:5000/students/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        getStudents();
    };

    // ======================
    // Auto Login
    // ======================

    useEffect(() => {
        const token = getToken();

        if (token) {
            setIsLoggedIn(true);
            getStudents();
        }
    }, []);

    // ======================
    // LOGIN SCREEN
    // ======================

    if (!isLoggedIn) {
        return (
            <div style={{ padding: "20px" }}>
                <h1>JWT Authentication</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />
                <br />

                <button onClick={register}>
                    Register
                </button>

                <button
                    onClick={login}
                    style={{ marginLeft: "10px" }}
                >
                    Login
                </button>
            </div>
        );
    }

    // ======================
    // STUDENT SCREEN
    // ======================

    return (
        <div style={{ padding: "20px" }}>
            <h1>Student Management</h1>

            <button onClick={logout}>
                Logout
            </button>

            <br />
            <br />

            <input
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button
                onClick={
                    editingId === null
                        ? addStudent
                        : updateStudent
                }
            >
                {editingId === null
                    ? "Add Student"
                    : "Update Student"}
            </button>

            <hr />

            {students.map((student) => (
                <div key={student.id}>
                    {student.name}

                    <button
                        onClick={() => editStudent(student)}
                        style={{ marginLeft: "10px" }}
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => deleteStudent(student.id)}
                        style={{ marginLeft: "10px" }}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default App;