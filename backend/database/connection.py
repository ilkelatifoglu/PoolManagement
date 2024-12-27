from flask import current_app
from flaskext.mysql import MySQL

mysql = MySQL()

def get_cursor():
    return mysql.get_db().cursor()

def commit_db():
    return mysql.get_db().commit()