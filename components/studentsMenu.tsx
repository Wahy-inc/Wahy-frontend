'use client'

import * as React from "react"
import { Input } from "./ui/input";
import { Field } from "./ui/field";
import { Label } from "./ui/label";

interface studentData { student_id: number, full_name_arabic: string, full_name_english: string }

export default function StudentMenu() {
    const [studentName, setStudentName] = React.useState<string>('')
    const studentsArray = [{ student_id: 1, full_name_arabic: 'احمد', full_name_english: 'Ahmed' },
{ student_id: 2, full_name_arabic: 'خالد', full_name_english: 'Khaled' },
{ student_id: 3, full_name_arabic: 'سارة', full_name_english: 'Sarah' }];
    const [filteredArray, setFilteredArray] = React.useState<Array<{id: number, name: string}>>([]);
    
    const handleSearchStudent = (input: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = input.target.value.trim();
        setStudentName(inputValue);
        
        if (inputValue) {
            const lowerInput = inputValue.toLowerCase();
            const filtered = studentsArray
                .filter((stu) => 
                    stu.full_name_arabic.toLowerCase().includes(lowerInput) || 
                    stu.full_name_english.toLowerCase().includes(lowerInput)
                )
                .map((stu) => ({
                    'id': stu.student_id,
                    'name': stu.full_name_arabic.toLowerCase().includes(lowerInput) 
                        ? stu.full_name_arabic 
                        : stu.full_name_english
                }))
            setFilteredArray(filtered)
        } else {
            const data = studentsArray.map((stu) => ({
                'id': stu.student_id,
                'name': stu.full_name_arabic
            }))
            setFilteredArray(data)
        }
    }

    return (
        <div>
            <Field orientation="vertical" className='w-full inline'>
                <Label htmlFor='stu_name'>Student Name</Label>
                <Input id='stu_name' name='stu_name' type='text' onChange={(e) => handleSearchStudent(e)}></Input>
            </Field>
            <div id="panel" className={`w-full h-48 overflow-y-auto mt-4 transition duration-150 p-4 border rounded z-50 absolute bg-white shadow-[0px_4px_30px_rgba(0,0,0,0.1)] ${studentName ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {filteredArray && filteredArray.length > 0 ? (
                    filteredArray.map((stu, index) => (
                        <div key={index} className="p-2 border-b last:border-b-0 transition duration-300 hover:bg-gray-200 cursor-pointer" onClick={() => setStudentName(stu.name)}>
                            {stu.name}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No students found</p>
                )}
            </div>
        </div>
    )
}