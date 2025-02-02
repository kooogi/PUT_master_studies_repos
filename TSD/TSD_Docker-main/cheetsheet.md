# Popular commands 💻

**Docker information**:
   - Docker version: `docker --version`
   - Docker system information: `docker info`
      - version, number of images, number of containers, plugins, etc.

**Docker Images**:
   - List of images: `docker images`
   - Download image: `docker pull [image_name]`
   - Build image: `docker build -t [image_name] .`
   - Remove image: `docker rmi [image_name]`
   - Image layers: `docker history [image_name]`

**Docker Containers**:
      - List of run containers: `docker ps`
      - List of all containers: `docker ps -a`
      - Run a container: `docker run [image_name]`
      - Stop container: `docker stop [container_id]`
      - Remove container: `docker rm [container_id]`
      - Enter container: `docker exec -it [container_id] /bin/bash`

**Docker Volumes**:
   - List of volumes: `docker volume ls`
   - Create a volume: `docker volume create [volume_name]`
   - Remove volume: `docker volume rm [volume_name]`

**Docker Networks**:
   - List of networks: `docker network ls`
   - Create a network: `docker network create [network_name]`
   - Remove network: `docker network rm [network_name]`

**Docker Compose** (if used):
   - Start services: `docker-compose up`
   - Stop services: `docker-compose down`

[Offical Docker cheatsheet](https://docs.docker.com/get-started/docker_cheatsheet.pdf)
