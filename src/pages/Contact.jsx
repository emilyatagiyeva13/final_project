import { useRef } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import "../assets/scss/Contact.scss";

const Contact = () => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                'bokifa_service',     
                'template_j1l2hh9',    
                form.current,
                {
                    publicKey: 'naatN4-h-nKeKDQWm', 
                }
            )
            .then(
                () => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Your request has been sent successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    form.current.reset();
                },
                (error) => {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to send message: ' + error.text,
                        icon: 'error',
                        confirmButtonText: 'Try Again'
                    });
                }
            );
    };

    return (
        <>
            <form ref={form} onSubmit={sendEmail} className="left-side d-flex flex-column align-items-center">
                <h1>Send a Request</h1>
                <span>Complete the form below, select a subject, type your question or comment and we will get back to you as soon as possible.</span>

                <div className="subject-name-mail">
                    <div className="subject-input">
                        <div className="contact-header">
                            <span className="">SUBJECT</span>
                        </div>
                        <textarea
                            name="subject"
                            className="textarea-input"
                            cols={40}
                            rows={10}
                            placeholder="Type your subject or message here..."
                            required
                        ></textarea>
                    </div>

                    <div className="name-mail-input">
                        <div className="name-input">
                            <div className="name-header">
                                <span>YOUR NAME</span>
                            </div>
                            <input
                                type="text"
                                name="from_name"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="mail-input">
                            <div className="mail-header">
                                <span>YOUR EMAIL</span>
                            </div>
                            <input
                                type="email"
                                name="user_email"
                                placeholder="Enter your mail address"
                                required
                            />
                        </div>
                    </div>
                </div>



                <div className="btn-wrapper">
                    <button className="discover-btn my-3" >
                        <span>SEND REQUEST</span> <span><IoIosArrowForward />
                        </span>
                    </button>
                </div>


            </form>
        </>
    );
};

export default Contact;