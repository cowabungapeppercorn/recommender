'''Song model tests.'''

# to run these tests, enter the following in your terminal:
#
# python -m unittest test_songs_model.py

import os
from unittest import TestCase
from models import db, Song, Artist, Album
from config import TEST_DATABASE_NAME

os.environ['DATABASE_URL'] = f'postgresql:///{TEST_DATABASE_NAME}'

from app import app

db.drop_all()
db.create_all()


class SongModelTestCase(TestCase):

    def setUp(self):
        Song.query.delete()
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

        album = Album(
            title="bigh",
            year=2019,
            artist_id=artist_id
        )

        db.session.add(album)
        db.session.commit()

        db_album = Album.query.filter_by(title="bigh").first()
        album_id = db_album.id

        song_1 = Song(
            title="Eessennet",
            artist_id=artist_id,
            album_id=album_id
        )

        song_2 = Song(
            title="bigh",
            artist_id=artist_id,
            album_id=album_id
        )

        db.session.add(song_1)
        db.session.add(song_2)
        db.session.commit()

        self.song_1 = song_1
        self.song_2 = song_2

        self.client = app.test_client()

    def tearDown(self):
        db.session.rollback()

    def test_song_model(self):
        songs = Song.query.all()
        s1 = Song.query.filter_by(title=self.song_1.title).first()
        s2 = Song.query.filter_by(title=self.song_2.title).first()

        self.assertEqual(s1.title, "Eessennet")
        self.assertEqual(s1.artist.name, "Nick Danger")
        self.assertEqual(s1.album.title, "bigh")

        self.assertEqual(s2.title, "bigh")
        self.assertEqual(s2.artist.name, "Nick Danger")
        self.assertEqual(s2.album.title, "bigh")

        self.assertIn(s1, songs)
        self.assertEqual(len(songs), 2)

    def test_serialize(self):
        s1 = Song.query.filter_by(title=self.song_1.title).first()
        s2 = Song.query.filter_by(title=self.song_2.title).first()

        db_artist = Artist.query.filter_by(name=self.song_2.artist.name).first()
        db_album = Album.query.filter_by(title=self.song_2.album.title).first()

        artist_id = db_artist.id
        album_id = db_album.id

        s1_serialized = {
            "title": "Eessennet",
            "artist_id": artist_id,
            "album_id": album_id,
            "id": 1
        }

        s2_serialized = {
            "title": "bigh",
            "artist_id": artist_id,
            "album_id": album_id,
            "id": 2
        }

        self.assertEqual(s1.serialize(), s1_serialized)
        self.assertEqual(s2.serialize(), s2_serialized)
