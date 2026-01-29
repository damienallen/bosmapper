![icon](https://github.com/damienallen/bosmapper/blob/main/client/public/favicon.png)

# bosmapper

## client

### Requirements

- node 24

### Dev environment

After cloning the repository, install depenencies using `npm install --prefix app/`.

Vite is used to optimize and package static resources. It should be used either in watch mode (`npm start`) or a manual build using `npm run build`.

### Running the app

To run the ui locally:

```bash
npm run start --prefix app/
```

## server

FastAPI server powering the bosmapper backend

### Stack

- Docker
- Python
- FastAPI
- MongoDB

### Local development

Local development using docker uses the `make build` and `make up` commands.
