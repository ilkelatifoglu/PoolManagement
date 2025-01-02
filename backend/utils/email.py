from flask_mail import Mail, Message
from flask import render_template
from flask import current_app

mail = Mail()

def send_password_reset_email(user_email, reset_token):
    msg = Message('Password Reset Request',
                  sender=current_app.config['MAIL_USERNAME'],
                  recipients=[user_email])
    
    # Using template for email body
    msg.html = render_template('email/reset_password.html',
                             reset_token=reset_token)
    
    mail.send(msg) 