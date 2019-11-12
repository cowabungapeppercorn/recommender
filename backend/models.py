from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt


db = SQLAlchemy()
bcrypt = Bcrypt()

DEFAULT_IMAGE = 'https://s3.amazonaws.com/bit-photos/large/7194791.jpeg'


class Artist(db.Model):
    __tablename__ = 'artists'

    albums = db.relationship("Album", backref="artist")

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    logo_url = db.Column(db.Text, nullable=True, default=DEFAULT_IMAGE)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "logo_url": self.logo_url
        }


class Song(db.Model):
    __tablename__ = 'songs'

    artist = db.relationship("Artist", backref="songs")
    album = db.relationship("Album", backref="songs")

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(150), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id',
                          ondelete='CASCADE'), nullable=False)
    album_id = db.Column(db.Integer, db.ForeignKey('albums.id',
                         ondelete='CASCADE'), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "artist_id": self.artist_id,
            "album_id": self.album_id
        }


class Album(db.Model):
    __tablename__ = 'albums'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(150), nullable=False)
    year = db.Column(db.String(4), nullable=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id',
                          ondelete='CASCADE'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "year": self.year,
            "artist_id": self.artist_id
        }


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password
        }

    @classmethod
    def get_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def register(cls, username, password):
        """Register user w/ hashed password and return user."""

        hashed = bcrypt.generate_password_hash(password)
        hashed_utf8 = hashed.decode("utf8")

        return cls(username=username, password=hashed_utf8)

    @classmethod
    def authenticate(cls, username, password):
        u = User.query.filter_by(username=username).first()

        if u and bcrypt.check_password_hash(u.password, password):
            return True
        else:
            return False


def connect_db(app):
    """Connect to database"""
    db.app = app
    db.init_app(app)
