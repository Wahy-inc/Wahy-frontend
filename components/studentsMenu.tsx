'use client'

import * as React from "react"
import { Field } from "./ui/field";
import { Label } from "./ui/label";
import Select from "react-select";

interface studentData { student_id: number, full_name_arabic: string, full_name_english: string }

type StudentOption = { value: number; label: string };
type StudentMenuProps = {
    onStudentSelect: (studentId: number) => void;
}

export default function StudentMenu({onStudentSelect}: StudentMenuProps) {
    const [studentName, setStudentName] = React.useState<StudentOption | null>(null)
    const studentsArray = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students') as string) as Array<studentData> : [];
    const [filteredArray, setFilteredArray] = React.useState<Array<{id: number, name: string}>>([]);
    
    React.useEffect(() => {
        const en = studentsArray.map((stu) => ({
            'id': stu.student_id,
            'name': stu.full_name_english
        }))
        const ar = studentsArray.map((stu) => ({
            'id': stu.student_id,
            'name': stu.full_name_arabic
        }))
        setFilteredArray([...en, ...ar])
    }, [])
    
    const handleSearchStudent = (selectedOption: StudentOption | null) => {
        setStudentName(selectedOption || null);
        if (selectedOption && onStudentSelect) {
            onStudentSelect(selectedOption.value);
        }
    }

    return (
        <div>
            <Field orientation="vertical" className='w-full inline'>
                <Label htmlFor='stu_name'>Student Name</Label>
                <Select<StudentOption>
                    options={filteredArray.map((e)=>({value: e.id, label: e.name}))}
                    isSearchable
                    isClearable
                    onChange={handleSearchStudent}
                    value={studentName}></Select>
            </Field>
        </div>
    )
}