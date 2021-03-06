'''Song routes tests.'''

# to run these tests, enter the following in your terminal:
#
# python -m unittest test_song_routes.py

from unittest import TestCase
from flask import json, jsonify
from models import db, User
from config import TEST_DATABASE_NAME
from app import app

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql:///{TEST_DATABASE_NAME}'
app.config['SQLALCHEMY_ECHO'] = False
app.config['TESTING'] = True

db.drop_all()
db.create_all()


class SongRoutesTestCase(TestCase):

    def setUp(self):
        User.query.delete()

        self.client = app.test_client()

        self.test_user = User(username="slam", password="slam")
        self.test_user_2 = User(username="cowabunga", password="peppercorn")

        db.session.add(User.register("slam", "slam"))
        db.session.add(User.register("cowabunga", "peppercorn"))
        db.session.commit()

    def tearDown(self):
        db.session.rollback()

    def test_get_all_songs_not_logged_in(self):
        with self.client as c:
            res = c.get('/songs')
            self.assertEqual(res.status_code, 401)
            self.assertRaises(AssertionError)

    def test_get_all_songs_logged_in(self):
        with self.client as c:
            with app.app_context():
                data = '{"username": "slam", "password": "slam"}'
                token_resp = c.post('/users/login',
                                    data=data,
                                    content_type="application/json",
                                    charset='UTF-8')
                token_dict = json.loads(token_resp.data.decode("utf-8"))
                token = token_dict['access_token']
                auth_header = {'Authorization': f'Bearer {token}'}
                res = c.get('/songs', headers=auth_header)
                data = json.loads(res.data.decode("utf-8"))['songs']
                self.assertEqual(len(data), 2)
