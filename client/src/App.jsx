import { useState, useEffect } from "react";


function App(){
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");

    const getStudents = async () => {
        const response = await fetch("http://localhost:5000/students");
        const data = await response.json()
        setStudents(data)
    }

    useEffect(() => {
    getStudents();

    }, []);

    return(
        <>
            <h1>Student Management</h1>
            <input 
                value = {name}
                onChange = {(e)=>(setName(e.target.value))}
                />
            <button> Add Student </button>

           {students.map((student)=>(
                <div key = {student.id}>
                {studend.name}
                </div>
           )
           )}
           
        </>

    )

}

export default App