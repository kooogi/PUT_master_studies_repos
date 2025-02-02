# Let's go further - Brain breakers 🔵

## Project files on the host disk

To store files outside the container, we can use the volume mechanism.

Analyze the following instruction:

```bash
docker run --rm -p 8080:8080 -dt --volume $(pwd):/app --name workshop node:18
```

- `docker run`: the docker run command runs a new container based on the Docker image,
- `--rm`: after the container finishes running, it will be automatically deleted. This is useful for cleaning up after the container when it is no longer needed.
- `-dt`: these two parameters are combined as -d -t. The -d parameter means that the container will be run in the background (detach mode), so it will not be visible on the standard output. The -t parameter allows the allocation of a pseudo terminal, which enables to interact with the container.
- `--volume $(pwd):/app`: creates a mounting point in the container, connecting the local directory with the directory inside the container. In this case, we use $(pwd) to denote the current directory (in which the Docker command is run), and /app is the target path inside the container, where we will be mounting our current directory.
- `--name workshop`: gives the container a name. This makes it easier to refer to the container using this name instead of the long container identifier.
- `node-18`: the name that will be used to create the container. The same base image we used in the Dockerfile

This way can be useful for organizing the development environment.
Project files are on the host disk, but the container has access to them.
We can run our application within the container.

Run the above command.

Connect to the container's terminal:

```bash
docker exec -it workshop /bin/sh
```

Go to the  `/app` folder, install dependencies, and run the application:

```bash
cd app
yarn install
yarn dev
```

Everything should work as before.

Instead of "entering" the container, you can execute the dependency installing commands at its launch.

```bash
docker run --rm \
-p 8080:8080 -dt \
--volume $(pwd):/app \
-w /app \
--name workshop \
node:18 \
sh -c "yarn install && yarn dev"
```

::: tip Challenge 1: Modifying the file on the host side

Change the project name (in the config.ts file) using a graphic editor. Check if the running application immediately updated the title.
:::

## Docker Compose for running multiple containers at once

We will try to create an application consisting of two containers from scratch.
We will use Docker Compose for this.
The application will be written in Python.
The second container is Redis - an in-memory database.

1. **Create a new directory on the disk**. This will be your workspace. We can name it  `compose-app`.

    ```bash
    mkdir compose-app
    cd compose-app
    ```

2. **Create a Dockerfile**. This file defines your container's environment.

    ```bash
    # Use the official Python image as a base
    FROM python:3.8-slim-buster

    # Set the working directory in the container
    WORKDIR /app

    # Copy the files into the container
    COPY . .

    # Install required packages
    RUN pip install --no-cache-dir -r requirements.txt

    # Set an environment variable
    ENV NAME World

    # Open port 80
    EXPOSE 80

    # Run the application
    CMD ["python", "app.py"]
    ```

    Save this file as `Dockerfile` in the created directory.

3. **Create a `requirements.txt` file**. This file defines Python dependencies for your application.

    ```bash
    Flask==2.0.1
    Redis==3.5.3
    ```

    Save this file as `requirements.txt`.

4. **Create an `app.py` file**. This file defines your application.

    ```bash
    from flask import Flask
    from redis import Redis

    app = Flask(__name__)
    redis = Redis(host='db', port=6379)

    @app.route('/')
    def hello():
        redis.incr('hits')
        return 'Hello World! I have been seen %s times.\n' % redis.get('hits').decode('utf-8')

    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=80)
    ```

    Save this file as `app.py`.

5. **Create a `docker-compose.yml` file**. This file defines your application's services and how they are related.

    ```bash
    version: "3"
    services:
      web:
        build: .
        ports:
          - "5000:80"
        volumes:
          - .:/app
      db:
        image: "redis:alpine"
    ```

    Save this file as `docker-compose.yml`.

6. **Build and run the application** using Docker Compose.

    ```bash
    docker-compose up
    ```


After completing these steps, you should have a working application consisting of two services that communicate with each other.
You can test the application by typing `localhost:5000` in the browser. Each refresh of the page should increase the counter.

To run Docker Compose in the background, you can add the -d flag (short for "detached mode"), which runs containers in the background and leaves them running.
