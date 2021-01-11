from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .secret import CLIENT_SECRET,CLIENT_ID
from requests import post, get, put

BASE_URL = "https://api.spotify.com/v1/me/"
def get_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key)
    if len(user_tokens)>0:
        return user_tokens[0]
    return None    

def update_or_create_tokens(session_key, access_token, refresh_token, token_type, expires_in):
    tokens = get_user_tokens(session_key)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_key, access_token = access_token, refresh_token = refresh_token, token_type=token_type, expires_in = expires_in)
        tokens.save()

def check_authentication(session_key):
    token = get_user_tokens(session_key)
    if token:
        expiry = token.expires_in
        if expiry<=timezone.now():
            refresh_token(session_key)
        return True
    return False

def refresh_token(session_key):
    refresh_token = get_user_tokens(session_key).refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type':'refresh_token',
        'refresh_token': refresh_token,
        'client_id':CLIENT_ID,
        'client_secret':CLIENT_SECRET

    }).json()
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    update_or_create_tokens(session_key, access_token, refresh_token, token_type, expires_in)

def exexute_spotify_api_call(session_key, endpoint, post_ = False, put_ = False):
    token = get_user_tokens(session_key)
    
    header = {'Content-Type':'application/json', 
                'Authorization':"Bearer "+token.access_token}
    if post_:
        response = post(BASE_URL + endpoint, headers = header)
    elif put_:
        response = put(BASE_URL + endpoint, headers = header)
        print(response.json())
    else:
        response = get(BASE_URL + endpoint, {}, headers = header)
    try:
        return response.json()
    except:
        return {"error":"issue with request"}


def play_song(session_key):
    return exexute_spotify_api_call(session_key, 'player/play', put_=True)

def pause_song(session_key):
    return exexute_spotify_api_call(session_key, 'player/pause', put_=True)

def skip_song(session_key):
    return exexute_spotify_api_call(session_key, 'player/next', post_=True)