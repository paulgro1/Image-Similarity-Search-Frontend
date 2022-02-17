# Aufsetzen des Frontends

### (1) Benötigte Software:

- node.js zur Nutzung von [npm](https://nodejs.org/en/download/) 
- Code Editor wie [VSCode](https://code.visualstudio.com/)

### (2) Klonen des Frontend-Repo:

Mit SSH: `git@gitlab.bht-berlin.de:image-similarity-search/image-similarity-search-frontend.git`  
Mit HTTPS: `https://gitlab.bht-berlin.de/image-similarity-search/image-similarity-search-frontend.git`

### (3) Installieren der nötigen Abhängigkeiten:

1. Kommandozeilenfenster öffnen.
2. Mit `cd` in den `iss-frontend`-Ordner des geklonten Projekts navigieren.
3. Nun werden die Abhängigkeiten installiert:

```shell
# Installieren der Abhängigkeiten
$ npm install
```

### (4) Starten und des Frontend Servers:

Nun kann der Server gestartet werden:

```shell
# Server starten
$ npm start
```

Durch Drücken von strg + c in der Kommandozeile kann der Prozess beendet werden.

### (5) Anmerkungen:

Falls die .env Datei neu angelegt werden muss:

Im Ordner `iss-frontend` die Datei .env mit folgendem Inhalt erstellen:

```txt
REACT_APP_BACKEND_HOST=localhost
REACT_APP_BACKEND_PORT=8080
REACT_APP_BACKEND_SERVER=http://${REACT_APP_BACKEND_HOST}:${REACT_APP_BACKEND_PORT}/

REACT_APP_SLIDER_VALUE_NN=30
REACT_APP_SLIDER_VALUE_CLUSTER=15
```

Wichtig: Jede neue Umgebungsvariable in .env muss mit "REACT_APP_" beginnen.

Weitere Anmerkungen und Hinweise zur Anwednung bitte der [README.md](README.md) entnehmen.
