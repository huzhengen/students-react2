import React from 'react'
import './MainPage.css'
import { useHistory } from 'react-router-dom';
import StudentsList from "../StudentsList/StudentsList";
import {useState} from "react";
import {BASE_URL, headers, upload} from "../../config";

function MainPage() {
    const [sortInfo, setSorting] = useState({
        criteria: 'full_name',
        descending: ''
    });

// Why not redux, but hooks. I was unfamiliar with Redux.
// Just the other day I figured out what it is. What does the dispatch mean,
// state that props, store, what are selectors, etc.

    const [query, setQuery] = useState('');
    const [studentsDefault, setStudentsDefault] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [avatars, setAvatars] = useState([]);

    const [isLoaded, setIsLoaded] = useState({
        isLoaded: false,
        error: null
    });

    const [isAvatarsLoaded, setIsAvatarsLoaded] = useState({
        isAvatarsLoaded: false,
        error: null
    });

    const fetchData = async (url, handler, errorHandler) => {
        return await fetch(url, {
            method: "GET",
            headers: headers } )
            .then(res => res.json())
            .then(
                (result) => { handler(result) },
                (error) => { errorHandler(error) }
            )
    }

    const updateInput = async (query) => {
        const filtered = studentsDefault.filter(data => {
            return data.student.full_name.toLowerCase().includes(query.toLowerCase())
        })
        setQuery(query);
        setStudentsList(filtered);
    }
    
    const sortingHandler = (e) => {
        console.log('sort-e', e.target.name, e.target.value, e.target.checked)
        const key = e.target.name
        if (key === 'descending') {
            setSorting({...sortInfo, [key]: e.target.checked})
        } else {
            setSorting({...sortInfo, [key]: e.target.value})
        }
        console.log(sortInfo)
    }

    const studentsHandler = (result) => {
        const students = !result.students ? null
          : result.students
        console.log(students)
        setStudentsDefault(students)
        setStudentsList(students)
        setIsLoaded({
            isLoaded: true,
        });
    }

    const studentErrorHandler = (error) => {
        setIsLoaded({
            isLoaded: true,
            error
        });
    }

    const avatarsHandler = (result) => {
        console.log(1111111111)
        console.log( result)
        const avatars = !result.avatars ? null
          : result.avatars
        setAvatars(avatars)
        setIsAvatarsLoaded({
            isAvatarsLoaded: true,
        });
    }

    const avatarErrorHandler = (error) => {
        setIsAvatarsLoaded({
            isAvatarsLoaded: true,
            error
        });
    }

    const history = useHistory();
    React.useEffect( () => {
        fetchData(BASE_URL, studentsHandler, studentErrorHandler)
        fetchData( BASE_URL + upload, avatarsHandler, avatarErrorHandler)
    },[]);


    return (
        <main>
            <div className='page-primary-info'>
                <h1 className='page-primary-info__head-name'>Students</h1>
                <button className='app-button' id='add-new-student-button'
                        onClick={() => history.push('/addStudent')}>
                    <div className='app-button_plus_sign'>
                        <div className='app-button_rectangle' />
                        <div className='app-button_rectangle_rotated' />
                    </div>
                    <span>Add student</span>
                </button>
            </div>
            <div className='search-block'>
                <input type='search' className='search-bar'
                       placeholder='Search by name'
                       value={query}
                       onChange={(event) => updateInput(event.target.value)}
                />
                <div className='search-block__sorting'>
                    <select id={'sort-criteria-field'}
                            name={'criteria'}
                            className={'search-block__sorting_by-category'}
                            onChange={(event) =>
                                sortingHandler(event)}
                    >
                        <option defaultValue value="full_name">Name</option>
                        <option value="rating">Rating</option>
                        <option value="age">Age</option>
                        <option value="fav_colour">Color</option>
                    </select>

                    <input type='checkbox' className={'search-block__sorting_by-ascending'} name={'descending'}
                           onChange={(event) => sortingHandler(event)}
                    >
                    </input>

                </div>
            </div>
            <div className={'fields_names'}>
                <span className={'fields_names__name'}>FULL NAME</span>
                <span className={'fields_names__speciality'}>Specialty</span>
                <span className={'fields_names__group'}>Group</span>
                <span className={'fields_names__age'}>Age</span>
                <span className={'fields_names__rating'}>Rating</span>
            </div>
            <StudentsList descending={sortInfo.descending}
                          criteria={sortInfo.criteria}
                          isLoaded={isLoaded}
                          avatars={isAvatarsLoaded.isAvatarsLoaded ? avatars : []}
                          students={studentsList ? studentsList : studentsDefault}/>

        </main>
    )
}

export default MainPage