from flask_mail import Mail, Message
from flask import render_template, current_app

mail = Mail()

def send_password_reset_email(user_email, reset_token):
    msg = Message('Password Reset Request',
                  sender=current_app.config['MAIL_DEFAULT_SENDER'],
                  recipients=[user_email])
    
    frontend_url = current_app.config['FRONTEND_URL']
    msg.html = render_template('email/reset_password.html',
                             reset_token=reset_token,
                             frontend_url=frontend_url)
    
    mail.send(msg) 

def send_cancellation_email(recipient_name, recipient_email, cancellation_type, date, time, pool_name):
    """
    Send a cancellation notification email.
    
    Args:
        recipient_name (str): Name of the email recipient.
        recipient_email (str): Email address of the recipient.
        cancellation_type (str): "Training" or "Class".
        date (str): Date of the cancelled event.
        time (str): Time of the cancelled event.
        pool_name (str): Pool where the event was scheduled.
    """
    subject = f"{cancellation_type} Cancellation Notification"
    msg = Message(subject,
                  sender=current_app.config['MAIL_DEFAULT_SENDER'],
                  recipients=[recipient_email])
    
    msg.html = render_template('email/cancellation_notification.html',
                               recipient_name=recipient_name,
                               cancellation_type=cancellation_type,
                               date=date,
                               time=time,
                               pool_name=pool_name)
    
    mail.send(msg)