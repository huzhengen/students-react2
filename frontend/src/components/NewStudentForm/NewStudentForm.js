import "./NewStudentForm.css"
import React from "react";
import {Form, Input, Button, InputNumber } from "antd"
import {useHistory} from "react-router-dom";
import {BASE_URL, headers, upload} from "../../config";

// Forms. There are libraries that make it easier to work with forms: storing values,
// processing data when submitting a form, etc. The most popular of these is formic.
// I chose antd forms because the documentation provided a convenient and simple example
// load the file with its display, and I was also curious about the alternatives
// formicu, because monopoly is bad. As long as there is a choice, products will evolve.

// upd: when editing, I gave up the ant uploader altogether and created new elements

// Axios vs fetch api. The library is an extra load on the server, although axios requires
// less code, its methods are more intuitive and it handles errors from the server normally

export default function NewStudentForm () {

    const specialities = ["Mathematics", "Mathematics and CN", "FIIT", "Mechanics", "Applied Informatics"];
    const groups = {
        "Mathematics": ["МТ-101", "МТ-202", "МТ-203", "МТ-401"],
        "Mathematics and CN" : ["КН-101", "КН-102", "КН-103", "КН-201", "КН-202", "КН-303", "КН-401"],
        "FIIT": ["ФТ-101", "ФТ-102", "ФТ-203", "ФТ-401"],
        "Mechanics": ["МХ-101", "МХ-102", "МХ-103", "МХ-201", "МХ-202", "МХ-203", "МХ-301", "МХ-302", "МХ-401"],
        "Applied Informatics": ["ПИ-101", "ПИ-102", "ПИ-201", "ПИ-301", "ПИ-401"],
    };

    const [ form ] = Form.useForm();

    const [pickedSpeciality, setSpeciality] = React.useState("");

    const [avatarState, setAvatarState] = React.useState({
        name: "",
        isLoaded: false,
        base64: ""
    });

    const [width, setWidth]   = React.useState(window.innerWidth);
    const updateDimensions = () => {
        setWidth(window.innerWidth);
    }

    React.useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const history = useHistory();

    const onFinish = values => {
        let responsePath = "/responseSuccess"
            fetch(BASE_URL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(values)
        } )
            .then(resp => resp.json())
            .then(resp => {
                if (resp.code !== 200) {
                    responsePath = "/responseFail"
                }
                history.push(responsePath, { code: resp.code, message: resp.message })
            })

            fetch(BASE_URL + upload, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({id: avatarState.name, avatar: avatarState.base64})
            } )
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.code !== 200) {
                        error.message({ code: resp.code, message: resp.message })
                    }
                })
            .catch(err => error.message({ code: resp.code, message: resp.message }))
    };

    const getBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const onPhotoChangeHandler = (event) => {
        getBase64(event.target.files[0]).then(res => {
            setAvatarState({isLoaded: true, base64: res, name: event.target.files[0].name})
        })
            .catch(err => alert(err))
    }

    return (
        <>
            <h1 className={'page-primary-info__head-name'}>New student</h1>
            <div className={'form'}>
                <Form
                    layout="vertical"
                    className={"student-form"}
                    name="student-form"
                    form={form}
                    onFinish={onFinish}

                    onValuesChange={(v) => v.speciality ? setSpeciality(v.speciality) : null}
                >
                    <Form.Item
                        name="photo_link"
                        rules={[
                            {
                                required: true,
                                message: "This field is required",
                            }
                        ]}
                    >
                        {! avatarState.isLoaded ?
                             <label className={'custom-upload'}>
                                 <input type="file" name="file"
                                        className={'avatar-uploader-original-file'}
                                        onChange={(e) =>
                                            onPhotoChangeHandler(e)}
                                        accept={'image/jpeg, image/png'}/>
                                 <div className={'avatar-area'} >ФИ</div>
                                 <div className={'upload'}>
                                     <p className={'upload-title'}>Upload avatar</p>
                                     <p className={'upload-avatar-size'}>500х500</p>
                                 </div>
                             </label>
                            :
                            <div className={'custom-upload'}>
                                <img className={'avatar-area'} src={avatarState.base64} alt={'user avatar'} />
                                <div className={'upload'}>
                                    <p className={'upload-title'}>Avatar uploaded</p>
                                    <p className={'upload-avatar-size'}>500х500</p>
                                </div>
                            </div>
                        }

                    </Form.Item>

                    <Form.Item  initialValue={0} />
                    <div className={"fields-container"}>
                        <Form.Item
                            label="FULL NAME"
                            name="full_name"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required",
                                },
                                () => ({
                                    validator(_, value) {
                                        if (!value || value.trim().split(" ").length === 2 &&
                                            value.trim().split(" ").every(value => value.match(/^[A-Z][a-z]*/))) {
                                            return Promise.resolve();
                                        }
                                        else if (!value || value.trim()
                                            .split(" ").some(value => !value.match(/^[A-Z][a-z]*/))) {
                                            return Promise.reject("Please enter data with a capital letter");
                                        }
                                        return Promise.reject("Enter the last name, first name");
                                    },
                                })
                            ]}
                        >
                            <Input placeholder="Иванов Иван Иванович" />
                        </Form.Item>

                        <Form.Item
                            label={"Email"}
                            name={"email"}
                            rules={[
                                {
                                    required: true,
                                    message: "This field is also required"
                                },
                                () => ({
                                    validator(_, value) {
                                        if (!value || value
                                            .match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject("Enter valid e-mail: mymail@example.com");
                                    },
                                })
                            ]}
                        >
                            <Input type={'email'} className={'fields_container__email'}
                                   placeholder={'ivanov@gmail.com'} />
                        </Form.Item>

                        <Form.Item
                            label="Age"
                            name="age"
                            rules={[
                                {
                                    required: true,
                                    message: "And this field is required",
                                },
                                () => ({
                                    validator(_, value) {
                                        if (!value || 18 <= value && value <= 100) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject("Please enter an age between 18 and 100 years old");
                                    },
                                }),
                            ]}
                        >
                            <InputNumber placeholder="18"/>
                        </Form.Item>

                        <Form.Item
                            label="Specialty"
                            name="speciality"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required",
                                }
                            ]}
                        >
                            <select className={"fields-container__speciality"}>
                                <option value="" hidden={true} defaultValue>Choose</option>
                                {specialities.map(spec => (<option key={spec} value={spec}>{spec}</option>))}
                            </select>

                        </Form.Item>

                        <Form.Item
                            label="Group"
                            name="group"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required",
                                },
                            ]}
                        >
                            <select className={"fields-container__speciality"}>
                                <option value="" hidden={true}>Choose</option>
                                {groups[pickedSpeciality] ?
                                    groups[pickedSpeciality].map(group => (<option key={group} value={group}>{group}</option>))
                                    : <option value="" hidden={true}>Choose</option>
                                }
                            </select>
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required",
                                }
                            ]}
                        >
                            <InputNumber placeholder="100"
                                         min={1}
                                         max={100}/>
                        </Form.Item>

                        <Form.Item
                            label="sex"
                            name="sex"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required",
                                }
                            ]}
                        >
                            <select className={"fields-container__sex"}>
                                <option value="" hidden={true} defaultValue>Choose</option>
                                <option value="m">Male</option>
                                <option value="f">Female</option>
                            </select>
                        </Form.Item>

                        <Form.Item
                            label="Favorite color"
                            name="fav_colour"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required",
                                }
                            ]}
                        >
                            {width <= 690 ?
                                <select className={"fields-container__color mobile"}>
                                    <option value="" hidden={true} defaultValue>Choose</option>
                                    <option value="red">red</option>
                                    <option value="orange">orange</option>
                                    <option value="yellow">yellow</option>
                                    <option value="green">green</option>
                                    <option value="blue">blue</option>
                                    <option value="black">black</option>
                                    <option value="lgbt">lgbt</option>
                                </select>
                            :
                                <div className={"colors desktop"}>
                                    <input type={"radio"} value={"red"} id={"red_color"}/>
                                    <label htmlFor={"red_color"} className={"color red"}/>

                                    <input type={"radio"}  value={"yellow"} id={"yellow_color"}/>
                                    <label htmlFor={"yellow_color"} className={"color yellow"}/>

                                    <input type={"radio"} value={"orange"} id={"orange_color"}/>
                                    <label htmlFor={"orange_color"} className={"color orange"}/>

                                    <input type={"radio"}  value={"green"} id={"green_color"}/>
                                    <label htmlFor={"green_color"} className={"color green"}/>

                                    <input type={"radio"}  value={"blue"} id={"blue_color"}/>
                                    <label htmlFor={"blue_color"} className={"color blue"}/>

                                    <input type={"radio"}  value={"black"} id={"black_color"}/>
                                    <label htmlFor={"black_color"} className={"color black"}/>

                                    <input type={"radio"} value={"lgbt"} id={"lgbt_color"}/>
                                    <label htmlFor={"lgbt_color"} className={"color lgbt"}/>
                                </div>
                            }
                        </Form.Item>

                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="app-button create">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
};