from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, PasswordField
from wtforms.validators import InputRequired, DataRequired, Email, Length


class AddAlbumForm(FlaskForm):
    title = StringField("title", validators=[InputRequired()])
    year = StringField("year")
    artist = SelectField("artist", coerce=int)


class AddArtistForm(FlaskForm):
    name = StringField("name")
    logo_url = StringField("logo url")


class AddUserForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('E-mail', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(),
                                                     Length(min=6)])
    image_url = StringField('(Optional) Image URL')
