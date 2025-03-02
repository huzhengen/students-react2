import React from 'react'
import GoBackButton from "../Templates/Buttons/GoBackButton";
import NewStudentForm from "../NewStudentForm/NewStudentForm";

function NewStudentPage() {
    return <main>
        <GoBackButton title='Back to the list of students' />
        <NewStudentForm />
    </main>
}

export default NewStudentPage