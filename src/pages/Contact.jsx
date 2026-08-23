import { IoIosArrowForward } from "react-icons/io";
import "../assets/scss/Contact.scss"

const Contact = () => {
    return (
        <>

            <div className="left-side d-flex flex-column align-items-center">
                <h1>Send a Request</h1>
                <span>Complete the form below, select a subject, type your question or comment and we will get back to you as soon as possible.</span>
                <div className="subject-name-mail">
                    <div className="subject-input">
                        <div className="contact-header">
                            <span className="">SUBJECT</span>
                        </div>

                        <textarea name="" id="" className="textarea-input" cols={40} rows={10}></textarea>
                    </div>

                    {/* NAME AND MAIL INPUT */}
                    <div className="name-mail-input">
                        {/* NAME input */}
                        <div className="name-input">
                            <div className="name-header">
                                <span>YOUR NAME</span>
                            </div>
                            <input type="text" placeholder="Enter your name" />
                        </div>

                        {/* MAIL input */}
                        <div className="mail-input">
                            <div className="mail-header">
                                <span>YOU EMAIL</span>
                            </div>
                            <input type="email" placeholder="Enter your mail address" />

                        </div>
                    </div>
                </div>


                {/* CONTACT US */}
                <div className="discover-now-btn btn">
                    <button className="d-flex align-items-center gap-3 discover-btn"> SEND REQUEST <span><IoIosArrowForward /></span> </button>
                </div>

            </div>
        </>
    )
}

export default Contact;