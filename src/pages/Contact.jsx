import { useRef } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import "../assets/scss/Contact.scss";

const Contact = () => {
    const { t } = useTranslation("contact");
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
                        title: t('contact.alerts.success_title'),
                        text: t('contact.alerts.success_message'),
                        icon: 'success',
                        confirmButtonText: t('contact.buttons.ok')
                    });
                    form.current.reset();
                },
                (error) => {
                    Swal.fire({
                        title: t('contact.alerts.error_title'),
                        text: t('contact.alerts.error_message') + error.text,
                        icon: 'error',
                        confirmButtonText: t('contact.buttons.try_again')
                    });
                }
            );
    };

    return (
        <>
            <form ref={form} onSubmit={sendEmail} className="left-side d-flex flex-column align-items-center">
                <h1>{t('contact.title')}</h1>
                <span>{t('contact.subtitle')}</span>

                <div className="subject-name-mail">
                    <div className="subject-input">
                        <div className="contact-header">
                            <span>{t('contact.labels.subject')}</span>
                        </div>
                        <textarea
                            name="subject"
                            className="textarea-input"
                            cols={40}
                            rows={10}
                            placeholder={t('contact.placeholders.subject')}
                            required
                        ></textarea>
                    </div>

                    <div className="name-mail-input">
                        <div className="name-input">
                            <div className="name-header">
                                <span>{t('contact.labels.your_name')}</span>
                            </div>
                            <input
                                type="text"
                                name="from_name"
                                placeholder={t('contact.placeholders.your_name')}
                                required
                            />
                        </div>

                        <div className="mail-input">
                            <div className="mail-header">
                                <span>{t('contact.labels.your_email')}</span>
                            </div>
                            <input
                                type="email"
                                name="user_email"
                                placeholder={t('contact.placeholders.your_email')}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="btn-wrapper">
                    <button className="discover-btn my-3">
                        <span>{t('contact.buttons.send_request')}</span> 
                        <span><IoIosArrowForward /></span>
                    </button>
                </div>
            </form>
        </>
    );
};

export default Contact;