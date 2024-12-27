from flask import current_app, g
from flaskext.mysql import MySQL
import pymysql

mysql = MySQL()

def get_db():
    if 'db' not in g:
        g.db = mysql.connect()
    return g.db

def get_cursor():
    if 'cursor' not in g:
        g.cursor = get_db().cursor(pymysql.cursors.DictCursor)
    return g.cursor

def commit_db():
    db = get_db()
    db.commit()

def close_db(e=None):
    db = g.pop('db', None)
    cursor = g.pop('cursor', None)
    
    if cursor is not None:
        cursor.close()
    
    if db is not None:
        db.close()

def init_app(app):
    mysql.init_app(app)
    app.teardown_appcontext(close_db)