'''User model tests.'''

# to run these tests, enter the following in your terminal:
#
# python -m unittest test_user_model.py

from unittest import TestCase
from models import db, User
from config import TEST_DATABASE_NAME
from app import app

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql:///{TEST_DATABASE_NAME}'
app.config['SQLALCHEMY_ECHO'] = False


class UserModelTestCase(TestCase):

    def setUp(self):
        db.create_all()
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
        db.drop_all()

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

    def test_serialize(self):
        u1 = User.query.filter_by(username=self.user_1.username).first()
        u2 = User.query.filter_by(username=self.user_2.username).first()

        u1_serialized = {
            "username": "slam",
            "id": 1
        }

        u2_serialized = {
            "username": "cowabunga",
            "id": 2
        }

        self.assertEqual(u1.serialize(), u1_serialized)
        self.assertEqual(u2.serialize(), u2_serialized)

    def test_get_by_username(self):
        u1 = User.get_by_username("slam")
        u2 = User.get_by_username("cowabunga")

        self.assertEqual(u1.username, "slam")
        self.assertEqual(u2.username, "cowabunga")
        self.assertEqual(u1.id, 1)
        self.assertEqual(u2.id, 2)
        self.assertIsInstance(u1, User)
        self.assertIsInstance(u2, User)

    def test_authenticate(self):
        self.assertTrue(User.authenticate("slam", "slam"))
        self.assertTrue(User.authenticate("cowabunga", "peppercorn"))
