import webview
import os
import json

base = os.path.dirname(os.path.abspath(__file__))
html_webiste = os.path.join(base, "website.html")
song_file = os.path.join(base, "songs.json")


class Api:
    def load_songs(self):
        try:
            with open(song_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def save_songs(self, songs):
        with open(song_file, "w", encoding="utf-8") as f:
            json.dump(songs, f, ensure_ascii=False, indent=2)


window = webview.create_window("bug's music player", html_webiste, js_api=Api())
webview.start(http_server= True, debug= True)
