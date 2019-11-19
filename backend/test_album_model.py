'''Album model tests.'''

# to run these tests, enter the following in your terminal:
#
# python -m unittest test_albums_model.py

import os
from unittest import TestCase
from models import db, Artist, Album
from config import TEST_DATABASE_NAME

os.environ['DATABASE_URL'] = f'postgresql:///{TEST_DATABASE_NAME}'

from app import app

db.drop_all()
db.create_all()


class AlbumModelTestCase(TestCase):

    def setUp(self):
        Album.query.delete()
        Artist.query.delete()

        artist = Artist(
            name="Nick Danger",
            logo_url="nickdanger.jpg"
        )

        db.session.add(artist)
        db.session.commit()

        db_artist = Artist.query.filter_by(name="Nick Danger").first()
        artist_id = db_artist.id

        album_1 = Album(
            title="bigh",
            year="2019",
            artist_id=artist_id
        )

        album_2 = Album(
            title="An Apple a Day Doesn't Fall Far From the Tree",
            year="2019",
            artist_id=artist_id
        )

        db.session.add(album_1)
        db.session.add(album_2)
        db.session.commit()

        self.album_1 = album_1
        self.album_2 = album_2

        self.client = app.test_client()

    def tearDown(self):
        db.session.rollback()

    def test_serialize(self):
        a1 = Album.query.filter_by(title=self.album_1.title).first()
        a2 = Album.query.filter_by(title=self.album_2.title).first()

        db_artist = Artist.query.filter_by(name=self.album_2.artist.name).first()
        artist_id = db_artist.id

        a1_serialized = {
            "title": "bigh",
            "year": "2019",
            "artist_id": artist_id,
            "id": 3
        }

        a2_serialized = {
            "title": "An Apple a Day Doesn't Fall Far From the Tree",
            "year": "2019",
            "artist_id": artist_id,
            "id": 4
        }

        self.assertEqual(a1.serialize(), a1_serialized)
        self.assertEqual(a2.serialize(), a2_serialized)

    def test_album_model(self):
        albums = Album.query.all()
        a1 = Album.query.filter_by(title=self.album_1.title).first()
        a2 = Album.query.filter_by(title=self.album_2.title).first()

        self.assertEqual(a1.title, "bigh")
        self.assertEqual(a1.year, "2019")
        self.assertEqual(a1.artist.name, "Nick Danger")

        self.assertEqual(a2.title,
                         "An Apple a Day Doesn't Fall Far From the Tree")
        self.assertEqual(a2.year, "2019")
        self.assertEqual(a2.artist.name, "Nick Danger")

        self.assertIn(a1, albums)
        self.assertEqual(len(albums), 2)
