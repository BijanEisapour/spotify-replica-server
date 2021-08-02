const ErrorMessage = {
    AUTHENTICATION_FAILED: 'Authentication failed.',
    USER_ID_REQUIRED: "The user's id is required.",
    USER_NOT_FOUND: 'Cannot find the user.',
    USER_ALL_CREDENTIALS_REQUIRED: 'All credentials are required.',
    USER_ALREADY_EXISTS: 'There is already a user with these credentials in the database.',
    SONG_ID_REQUIRED: "The song's id is required.",
    SONG_NOT_FOUND: 'Cannot find the song.',
    PLAYLIST_NAME_REQUIRED: "The playlist's name is required.",
    PLAYLIST_ID_REQUIRED: "The playlist's id is required.",
    PLAYLIST_NOT_FOUND: 'Cannot find the playlist.',
    PAGE_SIZE_NOT_VALID: 'The page size is not valid.',
    PAGE_NUMBER_NOT_VALID: 'The page number is not valid.',
    SORTER_NOT_VALID: 'The sorter is not valid.',
    SEARCH_PHRASE_NOT_VALID: 'Search phrase is not valid.',
    DATABASE: 'There is a problem with database connection.',
    SOMETHING_WENT_WRONG: 'Something went wrong.',
};

module.exports = {ErrorMessage};
