# Aufsetzen des Frontends

### (1) Benötigte Software:

- node.js zur Nutzung von [npm](https://nodejs.org/en/download/) 
- Code Editor wie [VSCode](https://code.visualstudio.com/)

### (2) Klonen des Frontend-Repo

Mit SSH: `git@gitlab.bht-berlin.de:image-similarity-search/image-similarity-search-frontend.git`  
Mit HTTPS: `https://gitlab.bht-berlin.de/image-similarity-search/image-similarity-search-frontend.git`

### (3) .env Datei

Nun kann der Ordner `iss-frontend` im Code-Editor geöffnet werden.
In diesem Ordner muss die Datei .env mit folgendem Inhalt erstellt werden.

```txt
REACT_APP_BACKEND_HOST=localhost
REACT_APP_BACKEND_PORT=8080
REACT_APP_BACKEND_SERVER=http://${REACT_APP_BACKEND_HOST}:${REACT_APP_BACKEND_PORT}/
```

Wichtig: Jede neue Umgebungsvariable in .env muss mit "REACT_APP_" beginnen.

### (4) Installieren der nötigen Abhängigkeiten

1. Kommandozeilenfenster öffnen.
2. Mit `cd` in den `iss-frontend`-Ordner des geklonten Projekts navigieren.
3. Nun werden die Abhängigkeiten installiert:

```shell
# Installieren der Abhängigkeiten
$ npm install
```

### (5) Starten und des Frontend Servers

Nun kann der Server gestartet werden:

```shell
# Server starten
$ npm start
```

Durch Drücken von strg + c in der Kommandozeile kann der Prozess beendet werden.

### (6) Anmerkungen

Für diesen Prototypen sind beim Bilder-Upload lediglich Bilder der Größe 336 x 448 px vorgesehen. Abweichende Maße können den Programmablauf stören.
