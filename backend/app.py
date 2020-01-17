from flask import Flask, render_template, redirect, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Song, Album, Artist, User, Recommendation
from config import DATABASE_NAME, SECRET_KEY, JWT_SECRET_KEY

app = Flask(__name__)
CORS(app)
jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql:///{DATABASE_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = SECRET_KEY
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
app.config['JWT_HEADER_TYPE'] = ''
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
            return jsonify(msg="Login successful.",
                           access_token=access_token), 200
        else:
            return jsonify(msg="Incorrect username/password."), 400
    except Exception as e:
        print(e)
        return jsonify(str(e)), 400


@app.route('/users/<username>', methods=["GET", "PATCH"])
def get_user(username):
    if request.method == "GET":
        try:
            user = User.get_by_username(username).serialize()
            return jsonify(user), 200
        except Exception as e:
            print(e)
            return jsonify(msg="Could not get user by username."), 400
    else:
        data = request.get_json()
        try:
            user = User.get_by_username(username)
            user.first_name = data['first_name']
            user.last_name = data['last_name']
            user.email = data['email']

            db.session.add(user)
            db.session.commit()

            return jsonify(user.serialize()), 200
        except Exception as e:
            print(e)
            return jsonify(msg="Could not make changes to the user."), 400

##############################################################################
# RECOMMENDATION ROUTES


@app.route('/recommend', methods=["GET", "POST"])
@jwt_required
def recommend_song():
    data = request.get_json()

    if not data['to_user']:
        return jsonify({"msg": "Missing to_user parameter"}), 400
    if not data['from_user']:
        return jsonify({"msg": "Missing from_user parameter"}), 400
    if not data['song_id']:
        return jsonify({"msg": "Missing song_id parameter"}), 400

    to_user = data['to_user']
    from_user = data['from_user']
    song_id = data['song_id']
    message = data['message']

    try:
        new_recommendation = Recommendation(to_user=to_user,
                                            from_user=from_user,
                                            song_id=song_id,
                                            message=message)
        db.session.add(new_recommendation)
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({"msg": "Something went wrong making the rec."}), 400

##############################################################################
# SONG ROUTES


@app.route('/songs', methods=["GET", "POST"])
@jwt_required
def show_songs():
    if request.method == "GET":
        songs = Song.query.order_by(Song.artist_id).all()
        serialized = [s.serialize() for s in songs]
        return jsonify(songs=serialized)
    else:
        data = request.get_json()

        if not data['title']:
            return jsonify({"msg": "Missing title parameter"}), 400
        if not data['artist']:
            return jsonify({"msg": "Missing artist parameter"}), 400
        if not data['album']:
            return jsonify({"msg": "Missing album parameter"}), 400

        title = data['title']
        artist = Artist.get_by_name(data['artist'])
        album = Album.get_by_title(data['album'])

        try:
            if not artist.id > 0:
                return jsonify({"msg": "Artist not found."}), 400
            if not album.id > 0:
                return jsonify({"msg": "Album not found."}), 400

            artist_id = artist.id
            album_id = album.id
            new_song = Song(title=title, artist_id=artist_id,
                            album_id=album_id)

            db.session.add(new_song)
            db.session.commit()

            return jsonify({"msg": "Song added successfully."}), 201
        except Exception as e:
            print(e)
            return jsonify(msg="Could not add song to database."), 400


##############################################################################
# ALBUM ROUTES


@app.route('/albums', methods=["GET", "POST"])
@jwt_required
def show_albums():
    if request.method == "GET":
        albums = Album.query.order_by(Album.title).all()
        serialized = [a.serialize() for a in albums]
        return jsonify(albums=serialized)
    else:
        data = request.get_json()

        if not data['title']:
            return jsonify({"msg": "Missing title parameter"}), 400
        if not data['year']:
            return jsonify({"msg": "Missing year parameter"}), 400
        if not data['artist']:
            return jsonify({"msg": "Missing artist parameter"}), 400

        title = data['title']
        year = data['year']
        artist = Artist.get_by_name(data['artist'])

        try:
            if not artist.id > 0:
                return jsonify({"msg": "Artist not found."}), 400

            artist_id = artist.id
            new_album = Album(title=title, year=year, artist_id=artist_id)

            db.session.add(new_album)
            db.session.commit()

            return redirect('/albums')
        except Exception as e:
            print(e)
            return jsonify(msg="Could not add album to database."), 400


##############################################################################
# ARTIST ROUTES


@app.route('/artists', methods=["GET", "POST"])
@jwt_required
def show_artists():
    if request.method == "GET":
        artists = Artist.query.order_by(Artist.name).all()
        serialized = [a.serialize() for a in artists]
        return jsonify(artists=serialized)
    else:
        data = request.get_json()

        if not data['name']:
            return jsonify({"msg": "Missing name parameter"}), 400

        name = data['name']
        logo_url = data['logoUrl']

        try:
            new_artist = Artist(name=name, logo_url=logo_url)

            db.session.add(new_artist)
            db.session.commit()

            return redirect('/artists')
        except Exception as e:
            print(e)
            return jsonify(msg="Could not add album to database."), 400


##############################################################################
# HOME ROUTE AND ERROR HANDLERS
@app.route('/')
def index():
    return render_template('index.html')
