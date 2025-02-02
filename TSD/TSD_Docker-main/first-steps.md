# First Steps - Let's start thinking 🟢

First, choose how you want to work in today's class: ☁️ or 💻

::: details Work in the cloud - GitHub Codespaces

Requirements: GitHub account

1. Create a fork for [the repository with materials](https://github.com/drmikeman/tsd-docker-workshop/fork)
2. [Add and run Codespace for this fork](https://github.com/codespaces/new) - enter the name of the repository, leave the other settings default

:::

::: details Work on your computer - Docker Desktop

Requirements: installed [Docker Desktop](https://www.docker.com/products/docker-desktop/)

1. Clone the repository containing source code of these tasks:

```bash
git clone git@github.com:drmikeman/tsd-docker-workshop.git
```

:::

## Building the image and running the container

1. **Build the Docker image**

    After configuring the Dockerfile, you can build the Docker image using the following command:

    ```bash
    docker build -t image-name .
    ```

    Replace `image-name` with the name you want to use for the Docker image, e.g. `docker-workshop`

2. **Run the Docker container**

    After building the Docker image, you can run the Docker container using the following command:

    ```bash
    docker run -p 8080:8080 -d image-name
    ```

    This command runs the Docker container, mapping the container's port 8080 to the host's port 8080.

    `-d` means that the container is running in the background.

3. **Open the running application**

    Open `localhost:8080` in your browser (or click the appropriate button in Codespaces).

If everything works, you will see the same materials you are reading now, running in your own container! :tada:

::: tip Challenge 1: Docker tutorial 101

Run the `dockersamples/101-tutorial` image, which also contains a web application, this time running on port 80.

As a supplement to this workshop (after the class), you can try to go through the tutorial contained in this application.

:::

::: tip Challenge 2: Image list

Check what images you currently have in the local repository.
Which one is the biggest?

:::

::: tip Challenge 3: Application change

Change the title of the application in the  `.vuepress/config.ts` file to something different than it is now.

```javascript{3}
export default {
  lang: 'en-EN',
  title: 'Docker - workshops',
  description: 'Technologies in Software Development',
  ...
```

Try to build a new image, run the container, and check if the update went ok.

:::

The container cannot be run because the specified port is already blocked.

Let's stop the old container:

1. **Get the id of the running container**

    ```bash
    docker ps
    ```

2. **Stop the container with the given id**

    ```bash
    docker stop container-id
    ```

3. **You can also remove the container**

    ```bash
    docker rm container-id
    ```


Complete the challenge. Did the app update now?

## Dockerfile and its modifications

Analyze the `Dockerfile` file, which served to build the first of the images:

```Dockerfile
# Choose the base image
FROM node:18

# Create and set a working directory in the container
WORKDIR /app

# Copy files package.json and package-lock.json
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy rest of the files
COPY . .

# Build the project
RUN yarn build

# Choose the port which will be listened
EXPOSE 8080

# Run the application
CMD ["yarn", "dev"]
```

If something is not clear to you - raise your hand! I will try to explain in person.

Our application runs in developer mode.
It turns out that there is no need to build the application before running it.

Remove the unnecessary line from the  `Dockerfile` file:

```Dockerfile{5}
# Copy rest of the files
COPY . .

# Build the project
RUN yarn build

# Choose the port which will be listened
EXPOSE 8080
```

Build a new image, this time providing the name with the tag, e.g.  `docker-workshop:small`.

::: tip Challenge 4: Comparison of container layers

Compare the layers of both containers:  `docker-workshop` and  `docker-workshop:small` .
You can use the  `docker history image-name` command.

How much space did we save on the lack of the building process?

:::

By the way, this challenge is worth checking how much the application's code "weighs".

## Running a single command in a container

Let's try running a simple command directly in the container, e.g.  `echo "hello"`.

List the list of containers (running and stopped)

```bash
docker ps -a
```

If the container is running, we can call a command in it using the  `exec` command:

```bash
docker exec container-id echo "hello"
```

If the container has been stopped or we don't have any container yet (but the image exists), we can use  `run` in the interactive version:

```bash
docker run -it image-name echo "hello"
```

In both cases, the word  `hello` should appear in the console.

It's worth understanding the differences between these methods.

## Let's play inside the container

Sometimes it is worth connecting to the container using the console.
Then we can perform various types of commands inside the container, as if we were doing it in our system, for example:

- navigating through folders,
- creating and modifying files,
- running programs,
- installing applications.

```bash
docker run -it image-name /bin/sh
```

::: tip Challenge 5: Add a file in the container

Add a file directly in the container, e.g.  `touch new_file.md` .
Check if it is visible in the container itself.

Run the container again. Has the file been preserved?

Note! The result will be different when we run the stopped container (`docker start container-id`), and when we create a new container (`docker run image-name`).

:::

## New tool in the image

Let's add a new tool,  `tree` to the image:

```bash
apt-get update && apt-get install -y tree
```

::: tip Challenge 6: Order of steps in Dockerfile

Think about where to add the above command to the Dockerfile file.
Does it matter?

:::

Run the updated image and check if the `tree` command works.

## Pushing the image to Docker Hub (Docker Desktop)

If you are using Docker Desktop and have a [Docker Hub account](https://hub.docker.com/), you can try to push the image to Docker Hub:

1. **Add a new name for the image**

    ```bash
    docker tag image-name username/image-name .
    ```

    The image we want to push must have a tag starting with the username.
    The `tag` command allows you to give a new name to an existing image.

2. **Log in to Docker Hub in the console**

    ```bash
    docker login
    ```

    Enter your authentication data (username and password).

3. **Log in to Docker Hub in the browser and create a repository**

    Log in to your account on [Docker Hub](https://hub.docker.com/).
    Add a new repository with the same name as the created image.
    Mark the repository as public.

4. **Push the image to Docker Hub**

    ```bash
    docker push username/image-name
    ```

5. **Wait for the image to be sent to Docker Hub**

    Now the image should be available in your Docker Hub repository.
