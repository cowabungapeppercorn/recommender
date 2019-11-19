'''Artist model tests.'''

# to run these tests, enter the following in your terminal:
#
# python -m unittest test_albums_model.py

import os
from unittest import TestCase
from models import db, Artist
from config import TEST_DATABASE_NAME

os.environ['DATABASE_URL'] = f'postgresql:///{TEST_DATABASE_NAME}'

from app import app

db.drop_all()
db.create_all()


class ArtistModelTestCase(TestCase):

    def setUp(self):
        Artist.query.delete()

        artist_1 = Artist(
            name="Nick Danger",
            logo_url="nickdanger.jpg"
        )

        artist_2 = Artist(
            name="The River Funk",
            logo_url="riverfunk.jpg"
        )

        db.session.add(artist_1)
        db.session.add(artist_2)
        db.session.commit()

        self.artist_1 = artist_1
        self.artist_2 = artist_2

    def tearDown(self):
        db.session.rollback()

    def test_artist_model(self):
        artists = Artist.query.all()
        a1 = Artist.query.filter_by(name=self.artist_1.name).first()
        a2 = Artist.query.filter_by(name=self.artist_2.name).first()

        self.assertEqual(a1.name, "Nick Danger")
        self.assertEqual(a1.logo_url, "nickdanger.jpg")
        self.assertEqual(len(a1.songs), 0)

        self.assertEqual(a2.name, "The River Funk")
        self.assertEqual(a2.logo_url, "riverfunk.jpg")
        self.assertEqual(len(a2.songs), 0)

        self.assertIn(a1, artists)
        self.assertEqual(len(artists), 2)

    def test_serialize(self):
        a1 = Artist.query.filter_by(name=self.artist_1.name).first()
        a2 = Artist.query.filter_by(name=self.artist_2.name).first()

        a1_serialized = {
            "id": 5,
            "name": "Nick Danger",
            "logo_url": "nickdanger.jpg"
        }

        a2_serialized = {
            "id": 6,
            "name": "The River Funk",
            "logo_url": "riverfunk.jpg"
        }

        self.assertEqual(a1.serialize(), a1_serialized)
        self.assertEqual(a2.serialize(), a2_serialized)
