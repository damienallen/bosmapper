![icon](https://github.com/damienallen/bosmapper/blob/main/client/public/assets/icon/favicon.png)

# bosmapper

## client

### Requirements

- node v16
- ionic cli (v5+)
- yarn (optional)

### Dev environment

After cloning the repository, install depenencies using `yarn install`.

Webpack is used to optimize and package static resources. It should be used either in watch mode (yarn start) or a manual build using yarn run build.

### Running the app

To run the app locally, can use the serve command:

```bash
npx cap serve
```

## server

FastAPI server powering the bosmapper backend

### Stack

- Docker
- Python
- FastAPI
- MongoDB

### Local development

Local development using docker uses the `make build` and `make up` commands inside the _server/_ directory.
