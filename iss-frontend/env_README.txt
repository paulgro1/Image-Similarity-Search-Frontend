# set environment variables
- create .env file in root directory
- paste in file:
    REACT_APP_BACKEND_HOST=localhost
    REACT_APP_BACKEND_PORT=8080
    REACT_APP_BACKEND_SERVER=http://${REACT_APP_BACKEND_HOST}:${REACT_APP_BACKEND_PORT}/

Important: every variable in the .env file has to start with "REACT_APP_"