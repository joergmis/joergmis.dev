+++
title = 'Teamcity Prometheus Metrics'
date = 2021-04-05T19:41:29+02:00
tags = ['grafana','metrics','prometheus']
+++

At my current job we use TeamCity for our CI/CD pipeline. Starting with TeamCity 2019.2, it provides metrics in prometheus format which integrates well with Grafana. Below is a test setup to play around with grafana and the metrics expose by teamcity.

You need to have docker and docker-compose installed.

## Start the containers

Create a directory and add a file `docker-compose.yml` with the following content:

```yaml
version: "3.7"

services:
  teamcity:
    image: jetbrains/teamcity-server:2020.2.3
    restart: always
    ports:
    - 8111:8111

  teamcity-agent:
    image: jetbrains/teamcity-agent:2020.2.3-linux-sudo
    restart: always
    privileged: true
    depends_on:
    - teamcity
    environment:
    - SERVER_URL=teamcity:8111
    - AGENT_NAME=teamcity-agent
    - DOCKER_IN_DOCKER=start

  grafana:
    image: grafana/grafana:7.3.6
    restart: always
    ports:
    - 3000:3000

  prometheus:
    image: prom/prometheus:v2.21.0
    restart: always
    ports:
    - 9090:9090
    volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command: --config.file=/etc/prometheus/prometheus.yml
```

Run `docker-compose up -d` to start the containers. Then, navigate to `localhost:8111` and setup TeamCity. After you have configured the instance, you need to create a token for prometheus to be able to access the `/app/metrics` endpoint. Navigate to you profile -> access tokens and create the token.

Replace the `TOKEN` below with the one that you generated and paste the code into a file called `prometheus.yml` in the same directory as the `docker-compose.yml`.

```yaml
global:
  scrape_interval: 10s
  scrape_timeout: 10s

scrape_configs:
- job_name: 'teamcity'
  metrics_path: '/app/metrics'
  params:
    experimental: ['true']
  scheme: http
  bearer_token: 'TOKEN'
  static_configs:
  - targets: ['teamcity:8111']
```

To restart prometheus and use the new configuration, execute `docker-compose up --force-recreate -d prometheus` or use `docker ps` to find the container ID and then restart with `docker restart $CONTAINER_ID`.

## Setup Grafana

Navigate to `localhost:3000` and login using `admin` / `admin`. Go to settings and configure a new datasource of type prometheus. The url is `prometheus:9090`, use the default access. Save and test the settings and you are good to go! You can start adding dashboards or explore the exposed metrics in the Explore panel.

## Notes

For sake of simplicity the example is not using https or persistent storage. You might want to address those points in a production setup.
