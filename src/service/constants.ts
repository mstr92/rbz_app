export enum Constants {
    // API
    HOST = '129.27.153.16',
    PORT = '8008',
    PROTOCOL = 'https://',
    CHECK_SSL = "nocheck",
    API_KEY = 'ABCD1234',
    ONESIGNAL_APP_ID = 'c61624bb-71b9-442f-85aa-ce0ae06c4f51',
    // Names
    GENRE = 'genre',
    MOVIE = 'movie',
    ACTOR = 'actor',
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
    MIN_YEAR = 1960,
    MAX_YEAR = 2020,
    //Storage
    MOVIE_FAVOURITE = 'favouriteMovies',
    MOVIE_POSTER = 'posterMovies',
    MOVIE_HISTORY = 'movie_history',
    MOVIE_RATING = 'ratingMovies',
    MOVIE_REQUEST = 'movieRequest',
    MOVIE_WAIT = 'movieWait',
    BACKUP_SNYC = "backupSync",
    USER = 'user',
    UUID = "uuid",
    NOT_SHOW_INTRO = 'intro',
    MOVIE_CURRENT_RESPONSE = 'movieResponse',
    SHOW_MORE = 'show_more',
    //Error Messages
    ERROR_ENGINE = 'ERROR CALCULATING RECOMMENDATIONS!',
    ERROR_USERNAME_LENGTH = "Username must contain at least 3 characters",
    ERROR_USERNAME_CHARS = "Only letters and numbers are allow for username",
    ERROR_USERNAME_USE = "Username already in use",
    ERROR_USERNAME_EXIST = "Username does not exist",
    ERROR_USERNAME_INVALID = "Invalid username",
    ERROR_PASSWORD_LENGTH = "Password must contain at least 5 characters",
    ERROR_PASSWORD_CONFIRM = "Password confirmation does not match",
    ERROR_PASSWORD_INVALID = "Invalid password",
    ERROR_PASSWORD_WRONG = "Wrong Password",
    ERROR_MAIL_PATTERN = "Email address does not match pattern",
    ERROR_PASSWORD_USERNAME = "Wrong Username or Password"


}