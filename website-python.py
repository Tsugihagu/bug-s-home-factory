import webview
import os

current_file = os.path.dirname(os.path.abspath(__file__))
html_webiste = os.path.join(current_file, "website.html")

webview.create_window("bug's home factory", html_webiste)
webview.start()
