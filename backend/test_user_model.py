'''User model tests.'''

# to run these tests, enter the following in your terminal:
#
# python -m unittest test_user_model.py

from unittest import TestCase
from models import db, User
from config import TEST_DATABASE_NAME
from app import app

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql:///{TEST_DATABASE_NAME}'

db.drop_all()
db.create_all()

class UserModelTestCase(TestCase):

    def setUp(self):
        User.query.delete()

        user_1 = User.register("slam", "slam")
        user_2 = User.register("cowabunga", "peppercorn")

        db.session.add(user_1)
        db.session.add(user_2)
        db.session.commit()

        self.user_1 = user_1
        self.user_2 = user_2

    def tearDown(self):
        db.session.rollback()

    def test_user_model(self):
        users = User.query.all()
        u1 = User.query.filter_by(username=self.user_1.username).first()
        u2 = User.query.filter_by(username=self.user_2.username).first()

        self.assertEqual(u1.username, "slam")
        self.assertIsInstance(u1.password, str)
        self.assertNotEqual(u1.password, "slam")

        self.assertEqual(u2.username, "cowabunga")
        self.assertIsInstance(u2.password, str)
        self.assertNotEqual(u2.password, "peppercorn")

        self.assertIn(u1, users)
        self.assertIn(u2, users)
        self.assertEqual(len(users), 2)
