from flask import Flask, jsonify
from flaskext.mysql import MySQL
from flask_cors import CORS
from database.connection import mysql
from routes.user_routes import user_bp
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
mysql = MySQL()
CORS(app)

app.config['MYSQL_DATABASE_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_DATABASE_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_DATABASE_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DATABASE_DB'] = os.getenv('MYSQL_DATABASE')

mysql.init_app(app)

@app.route('/test')
def test():
    cursor = mysql.get_db().cursor()
    cursor.execute('SHOW DATABASES')
    result = cursor.fetchall()
    return jsonify({'databases': result})

app.register_blueprint(user_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)