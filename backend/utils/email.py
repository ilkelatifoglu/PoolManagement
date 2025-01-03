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