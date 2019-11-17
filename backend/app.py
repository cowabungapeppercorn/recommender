from flask import Flask, render_template, redirect, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Song, Album, Artist, User
from forms import AddSongForm, AddArtistForm, AddAlbumForm
from config import DATABASE_NAME, SECRET_KEY, JWT_SECRET_KEY

app = Flask(__name__)
CORS(app)
jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = F'postgresql:///{DATABASE_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = SECRET_KEY
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)

connect_db(app)

# UNCOMMENT TO CREATE DB TABLES
# db.create_all()


##############################################################################
# USER ROUTES


@app.route('/users/register', methods=["POST"])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']

    if not username:
        return jsonify(msg="Missing username parameter"), 400
    if not password:
        return jsonify(msg="Missing password parameter"), 400

    try:
        user = User.register(username, password)
        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=username)
        return (jsonify(msg="User created.", access_token=access_token),
                201)

    except Exception:
        return jsonify(msg="Username already exists."), 400


@app.route('/users/login', methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']

        if not data['username']:
            return jsonify({"msg": "Missing username parameter"}), 400
        if not data['password']:
            return jsonify({"msg": "Missing password parameter"}), 400

        if User.authenticate(username, password):
            access_token = create_access_token(identity=username)
            return jsonify(msg="Login successful.", access_token=access_token), 200
        else:
            return jsonify(msg="Incorrect username/password."), 400
    except Exception as e:
        print(e)
        return jsonify(str(e)), 400


@app.route('/users/<username>')
def get_user(username):
    try:
        user = User.get_by_username(username).serialize()
        return jsonify(user), 200
    except Exception as e:
        print(e)
        return jsonify(msg="Could not get user by username."), 400

##############################################################################
# SONG ROUTES


@app.route('/songs')
@jwt_required
def show_songs():
    songs = Song.query.order_by(Song.artist_id).all()
    serialized = [s.serialize() for s in songs]
    return jsonify(songs=serialized)


@app.route('/songs/add', methods=["GET", "POST"])
def add_song():
    form = AddSongForm()
    form.artist.choices = [(artist.id, artist.name) for artist
                           in Artist.query.order_by(Artist.name).all()]
    form.album.choices = [(album.id, album.title) for album
                          in Album.query.order_by(Album.title).all()]

    if form.validate_on_submit():
        title = form.title.data
        artist = form.data['artist']
        album = form.data['album']
        new_song = Song(title=title, artist_id=artist, album_id=album)

        db.session.add(new_song)
        db.session.commit()

        return redirect('/songs')

    else:
        form.artist.choices = [(artist.id, artist.name) for artist
                               in Artist.query.order_by(Artist.name).all()]
        form.album.choices = [(album.id, album.title) for album
                              in Album.query.order_by(Album.title).all()]

        return render_template('new_song.html', form=form)

##############################################################################
# ALBUM ROUTES


@app.route('/albums')
def show_albums():

    albums = Album.query.order_by(Album.title).all()
    serialized = [a.serialize() for a in albums]
    return jsonify(albums=serialized)


@app.route('/albums/add', methods=["GET", "POST"])
def new_album():
    form = AddAlbumForm()
    form.artist.choices = [(artist.id, artist.name) for artist
                           in Artist.query.all()]

    if form.validate_on_submit():
        title = form.title.data
        year = form.year.data
        artist = form.data["artist"]
        new_album = Album(title=title, year=year, artist_id=artist)

        db.session.add(new_album)
        db.session.commit()

        return redirect('/albums')

    else:
        form.artist.choices = [(artist.id, artist.name) for artist
                               in Artist.query.order_by(Artist.name).all()]

        return render_template('new_album.html', form=form)

##############################################################################
# ARTIST ROUTES


@app.route('/artists')
def show_artists():

    artists = Artist.query.order_by(Artist.name).all()
    serialized = [a.serialize() for a in artists]
    return jsonify(artists=serialized)


@app.route('/artists/add', methods=["GET", "POST"])
def add_artist():
    form = AddArtistForm()

    if form.validate_on_submit():
        name = form.name.data
        logo_url = form.logo_url.data
        new_artist = Artist(name=name, logo_url=logo_url)

        db.session.add(new_artist)
        db.session.commit()

        return redirect('/artists')

    else:
        return render_template('new_artist.html', form=form)


##############################################################################
# HOME ROUTE AND ERROR HANDLERS
@app.route('/')
def index():
    return render_template('index.html')
