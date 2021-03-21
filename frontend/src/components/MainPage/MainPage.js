import React from 'react'
import './MainPage.css'
import { useHistory } from 'react-router-dom';
import StudentsList from "../StudentsList/StudentsList";
import {useState} from "react";

function MainPage() {
    const [sortInfo, setSorting] = useState({
        criteria: 'full_name',
        descending: ''
    });

    const [query, setQuery] = useState('');

    const sortingHandler = (e) => {
        const key = e.target.name
        if (key === 'descending') {
            setSorting({...sortInfo, [key]: e.target.checked})
        }
        else {
            setSorting({...sortInfo, [key]: e.target.value})
        }
    }

    const queryHandler = (e) => {
        setQuery(e.target.value)
    }

    const history = useHistory();

    return (
        <main>
            <div className='page-primary-info'>
                <h1 className='page-primary-info__head-name'>Студенты</h1>
                <button className='app-button' id='add-new-student-button'
                        onClick={() => history.push('/addStudent')}>
                    <div className='app-button_plus_sign'>
                        <div className='app-button_rectangle' />
                        <div className='app-button_rectangle_rotated' />
                    </div>
                    <span>Добавить студента</span>
                </button>
            </div>
            <div className='search-block'>
                <input type='search' className='search-bar'
                       placeholder='Поиск по имени'
                       value={query}
                       onChange={(event) => queryHandler(event)} />
                <div className='search-block__sorting'>
                    <select id={'sort-criteria-field'}
                            name={'criteria'}
                            className={'search-block__sorting_by-category'}
                            onChange={(event) =>
                                sortingHandler(event)}
                    >
                        <option selected value="full_name">Имя</option>
                        <option value="rating">Рейтинг</option>
                        <option value="age">Возраст</option>
                        <option value="fav_colour">Цвет</option>
                    </select>

                    <input type='checkbox' className={'search-block__sorting_by-ascending'} name={'descending'}
                           onChange={(event) => sortingHandler(event)}
                    >
                    </input>

                </div>
            </div>
            <div className={'fields_names'}>
                <span className={'fields_names__name'}>ФИО</span>
                <span className={'fields_names__speciality'}>Специальность</span>
                <span className={'fields_names__group'}>Группа</span>
                <span className={'fields_names__age'}>Возраст</span>
                <span className={'fields_names__rating'}>Рейтинг</span>
            </div>
            <StudentsList descending={sortInfo.descending} criteria={sortInfo.criteria} query={query}/>
        </main>
    )
}

export default MainPage