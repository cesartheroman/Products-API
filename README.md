# Pulsar Shop Products API Microservice

[![Pulsar Shop Products API Microservice][project-screenshot]][project-url]

### Summary

The goal of this project was to work with an inherited legacy front-end e-commerce web portal, and build out a specific API micro-service to be used by the front-end client. The micro-service was to be a RESTful API that would need to handle web-scale traffic.

- For the purposes of this project, web-scale traffic was defined as:
  - <2000ms of latency 
  - <1% error rate
  - At a minimum of 100 Request/second 
 
After various optimizations, this API microservice allows for real-world traffic loads of up to **500 requests/seconds** in 2 of 4 read routes, and up to **1,000 request/second** on the rest, with an error rate of 0%.

### System Architecture

![system-screenshot]

## Overview

### Built With

[![TypeScript][TypeScript-shield]][TypeScript-url]
[![Node.js][Node-shield]][Node-url]
[![ExpressJS][Express-shield]][Express-url]
[![Postgres][Postgres-shield]][Postgres-url]
[![Docker][Docker-shield]][Docker-url]
[![Redis][Redis-shield]][Redis-url]
[![Nginx][Nginx-shield]][Nginx-url]
[![AWS EC2][AWS-shield]][AWS-url]

I opted for 2 deployment methods for testing purposes:
 1. The first method utilized Docker-Compose to spin up containers that consisted of one container each for:
     - Node Server
     - Postgres DB
     - Redis DB
     - Nginx Load-balancer

    This allowed for a fast and consistent developer experience for both local testing and production testing. Additionally, this allowed my entire service to be easily deployed to one AWS EC2 t2.micro instance. 
    
 2. The second method consisted of spinning up 4 EC t2.micro instances, one each for:
    - Node server 1
    - Node server 2
    - 1 Nginx Load Balancing server
    - 1 PostgreSQL DB w/Redis server
    
    This allowed for a more highly available and higher load withstanding system since I wasn't only load testing one EC2 instance, but distributing it among 4.

### Routes built

| Method | Endpoint | Purpose | Response Code |
| :--:   | :------- | :------ | :-----------: |
| GET | `/products/list` | Retrieves the list of products. | 200 |
| GET | `/products/:product_id` | Returns all product level information for a specified product by ID. | 200 |
| GET | `/products/:product_id/styles` | Returns all the styles available for the given product by ID. | 200 |
| GET | `/products/:product_id/related` | Returns the IDs of all the products related to the product specified by ID. | 200 |
| PUT | `/products/:product_id` | Updates a Product by ID. | 200 |
| POST | `/products` | Created a new Product | 201 |
| DELETE | `/products/:product_id` | Deletes a Product by ID | 200 |

## Development Process

### Database Choice

### Schema Design

### ETL Process

An ETL process was required before beginning the project, as the entire product catalog consisted of 6 CSVs, all of which had to be sanitized and normalized, and represented ~5GBs worth of data or 49M+ records. The ETL process required an in-depth use of Node streams in order to:
  - Creating a readStream for each CSV, since it was impossible to open all of it in memory
  - Piping in a CSV parser with specific configurations for the readStream
  - Loading a custom Transform function-- extending the Transform class in Node in order to normalize all rows and columns
  - Piping to a writeStream with my clean files

Ultimately the ETL process, along with copying all the required CSV files into the Docker container, and loading it into my Posgres instance took 9mins to fully complete. 

The service was then incrementally optimized through indexing techniques and connection pooling while being stress-tested in development with Artillery. I found that on my local machine, I could easily top out at 100 RPS, with the required latency and error rates.

However, I wanted to see how much I could push this in my deployed instance, where I optimized further by, ensuring my SQL quieries were performant and sargable, utilizing a cache-aside strategy with Redis, and finally using Nginx as a load balancer. 

If you'd like to interact with the API, you can find the deployed version, fully documented with Swagger UI here: [Products-API](http://3.142.12.173/api-docs/#/)

Additionally, an exhaustive journaling of my thought process, hurdles, and successes can be found in my [Notion Engineering Journal](https://gusty-empress-623.notion.site/a54b3d61feb44377a95e01cba3902c83?v=1431d6a03e6b467bb0631d990609a852)

## Results Observed



<!-- MARKDOWN LINKS & IMAGES -->
[project-screenshot]: imgs/projectScreenshot.png
[project-url]: http://3.142.12.173/api-docs/
[system-screenshot]: imgs/systemArchitecture.png
[TypeScript-shield]: https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=TypeScript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Node-shield]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[Express-shield]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Nginx-shield]: https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white
[Nginx-url]:https://nginx.org/
[Postgres-shield]: https://img.shields.io/badge/Postgresql-0088CC?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/
[Docker-shield]: https://img.shields.io/badge/docker-003f8c?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[Redis-shield]: https://img.shields.io/badge/redis-E50000?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/
[AWS-shield]: https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white
[AWS-url]: https://aws.amazon.com/ec2/
