import men_img from "../../../../images/men.png"
import addyads_img from "../../../../images/addylogo.png";
import {Link} from "react-router-dom"
import jsondata from "../../../../locales/data/initialdata.json";
import {validationSchemas} from "../../../../utils/commonUtils.js";
import {useFormik} from "formik";
import Button from "../../../common/components/Button";
import React, {useEffect} from 'react'


const UserInfo = ({formData, setFormData, setShowTab}) => {

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            industry: "",
            contactNo: "",
            fullName: ""
        },
        validationSchema: validationSchemas.register,
        onSubmit: (values) => {
            setFormData({
                ...formData,
                fullName: values.fullName,
                username: values.username,
                email: values.email,
                industry: values.industry,
                contactNo: values.contactNo
            });
            setShowTab(2);
        },
    });

    useEffect(() => {
        if (formData) {
            formik.setFieldValue("username", formData.username);
            formik.setFieldValue("email", formData.email);
            formik.setFieldValue("industry", formData.industry);
            formik.setFieldValue("contactNo", formData.contactNo);
            formik.setFieldValue("fullName", formData.fullName);
        }
    }, [formData]);


    const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    return (
        <>
            <section className='Container'>

                <div className="login_wrapper">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12 ">
                            <div className='addy_container bg_color'>
                                <div className='login_outer'>

                                    <div className='reach_user_outer'>
                                        <img src={men_img} className='girl_img_width'/>
                                        <h2 className='mt-5'>Reach your users with new tools. Reach your users with new
                                            tools. Reach your users with new tools.</h2>
                                        <p>Efficiently unleash cross-media information without cross-media value.
                                            Quickly maximize.Efficiently unleash cross-media information without
                                            cross-media value. Quickly maximize.Efficiently unleash cross-media.</p>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className='addy_container'>
                                <div className="addy_outer">
                                    <div className="addy_img">
                                        <div className='logo_outer'><img src={addyads_img} height="90px" width="238px"/>
                                        </div>
                                        <h2 className='cmn_fontFamily'>Create New Account</h2>
                                    </div>
                                    <div className='login_form'>

                                        <form onSubmit={formik.handleSubmit}>

                                            <div className='form-group'>
                                                <label>Full Name</label>

                                                <input
                                                    name="fullName"
                                                    className="form-control mt-1"
                                                    type='text'
                                                    placeholder='Full Name'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.fullName}
                                                />

                                                {formik.touched.fullName && formik.errors.fullName ? (
                                                    <p className="error_message">{formik.errors.fullName}</p>
                                                ) : null}

                                            </div>


                                            <div className='form-group'>
                                                <label>{jsondata.username}</label>

                                                <input
                                                    name="username"
                                                    className="form-control mt-1"
                                                    type='text'
                                                    placeholder='Username'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.username}
                                                />

                                                {formik.touched.username && formik.errors.username ? (
                                                    <p className="error_message">{formik.errors.username}</p>
                                                ) : null}

                                            </div>

                                            <div className='form-group'>
                                                <label>{jsondata.email}</label>
                                                <input
                                                    name="email"
                                                    className="form-control mt-1"
                                                    type='email'
                                                    placeholder='Email'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.email}
                                                />

                                                {formik.touched.email && formik.errors.email ? (
                                                    <p className="error_message">{formik.errors.email}</p>
                                                ) : null}

                                            </div>

                                            <div className='rememberPass_outer mt-2'>

                                                <div className='form-group'>
                                                    <label>{jsondata.industry}</label>
                                                    <input
                                                        name="industry"
                                                        className="form-control mt-1"
                                                        type='text'
                                                        placeholder='Industry'
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.industry}
                                                    />

                                                    {formik.touched.industry && formik.errors.industry ? (
                                                        <p className="error_message">{formik.errors.industry}</p>
                                                    ) : null}

                                                </div>

                                                <div className='form-group'>
                                                    <label>{jsondata.contactNo}</label>
                                                    <input
                                                        name="contactNo"
                                                        className="form-control mt-1"
                                                        type='number'
                                                        placeholder='Contact No'
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        onKeyDown={blockInvalidChar}
                                                        value={formik.values.contactNo}
                                                    />

                                                    {formik.touched.contactNo && formik.errors.contactNo ? (
                                                        <p className="error_message">{formik.errors.contactNo}</p>
                                                    ) : null}

                                                </div>

                                                <Button type={"Submit"} text={jsondata.next}/>
                                            </div>
                                        </form>
                                        <h3 className='cmn_heading'>{jsondata.alreadyAccount} <Link to="/login"><span
                                            className='sign_up'>{jsondata.login}</span></Link></h3>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default UserInfo;