import { useState, useEffect } from "react";


function App(){
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");

    const getStudents = async () => {
        const response = await fetch("http://localhost:5000/students");
        const data = await response.json()
        setStudents(data)
    }   

    const addStudents = async () =>{
        const response = await fetch("http://localhost:5000/students",{
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({name: name})
        }
        )
        getStudents();
        setName("");
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
            <button onClick={addStudents}> Add Student </button>

           {students.map((student)=>(
                <div key = {student.id}>
                {student.name}
                </div>
           )
           )}
           
        </>

    )

}

export default App