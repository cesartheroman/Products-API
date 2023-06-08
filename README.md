# Pulsar Shop Products API Microservice

[![Pulsar Shop Products API Microservice][project-screenshot]][project-url]

### Summary

The goal of this project was to work with an inherited legacy front-end e-commerce web portal, and build out a specific API microservice to be used by the front-end client. The microservice was to be a RESTful API that would need to handle web-scale traffic.

- For the purposes of this project, web-scale traffic was defined as:
  - <2000ms of latency 
  - <1% error rate
  - At a minimum of 100 requests/second (RPS)
 
After various optimizations, this API microservice allows for real-world traffic loads of up to **500 RPS** in 2 of 4 read routes, and up to **1,000 RPS** on the rest, with an error rate of 0%.

An exhaustive break-down of my daily process, hurdles, and successes can be found in my [Notion Engineering Journal.](https://gusty-empress-623.notion.site/a54b3d61feb44377a95e01cba3902c83?v=1431d6a03e6b467bb0631d990609a852)

### System Architecture

![system-screenshot]

## Overview

### Tech Stack

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
    
    This allowed for a more highly available and higher load withstanding system since I wasn't only load testing one EC2 instance, but distributing it among 4. Ultimately this was became my official system architecture.

### Routes built

| Method | Endpoint | Purpose | Response Code |
| :--:   | :------- | :------ | :-----------: |
| GET | `/products/list` | Retrieves the list of products. | 200 |
| GET | `/products/:product_id` | Returns all product level information for a specified product by ID. | 200 |
| GET | `/products/:product_id/styles` | Returns all the styles available for the given product by ID. | 200 |
| GET | `/products/:product_id/related` | Returns the IDs of all the products related to the product specified by ID. | 200 |
| PUT | `/products/:product_id` | Updates a Product by ID. | 200 |
| POST | `/products` | Creates a new Product | 201 |
| DELETE | `/products/:product_id` | Deletes a Product by ID | 200 |

## Development Process

### Schema Design
Since I had 6 CSV files (`products`, `features`, `styles`, `related`, `photos`, and `skus`) that made up all of my product information to work with, and I knew the data shape the front-end was expecting, the first order of business was to create a data model schema that would conform to the data shape expected by the front end. 

<div align="center">
<img width="833" alt="schema-screenshot" src="https://github.com/cesartheroman/Products-API/assets/60380027/570923fb-b029-418c-b411-9beba48fbecd">
</div>

### Database Choice
Given that the data naturally lent itself to a relationship-driven schema, I knew choosing a Relational DB would be a good choice. I ultimately chose PostgreSQL for its powerful aggregator functions, as well as the ability to build out json objects as queries. 

### ETL Process
An ETL process was required before beginning the project since all of the data had to be sanitized and normalized, and represented ~5GBs worth of data or 49M+ records. Opening each individual CSV to work on proved impossible, given that each CSV had anywhere from 1 million to 26million rows and easily overwhelmed the RAM on my machine. Therefore, I was forced to do in-depth research on [Node Streams](https://nodejs.org/docs/latest-v18.x/api/stream.html) in order to:
  - Create a [readable Stream](https://nodejs.org/docs/latest-v18.x/api/stream.html#class-streamreadable) from each CSV, since it was impossible to open all of them in memory
  - Pipe in a [CSV parser](https://csv.js.org/) with specific configurations to open and read the CSV
  - Pipe in a custom transformer function-- extending the [Transform class](https://nodejs.org/docs/latest-v18.x/api/stream.html#class-streamtransform) in Node in order to normalize all rows and columns
  - Pipe to the [writable Stream](https://nodejs.org/docs/latest-v18.x/api/stream.html#class-streamwritable) with my clean CSV files

Once the "Extraction" and "Transformation" parts of the process were done, I needed to build out an automated way to "Load" my ~5GBs worth of data into Docker so that it would be accessible within the running instance of Postgres to then copy it into the database. Through a lot of trial and error, I found that I could utilize Docker's `/docker-entrypoint-initdb.d` entrypoint and updated my Dockerfile to load in 3 scripts: 
  - One to init my database schema
  - Another to copy over the CSV files into their appropriate tables
  - And the last one to creat the indexes, but that was included later once I had figured out which indexes to create when I began my optimization

With my ETL process finally complete, I was able to run my service locally using Docker-Compose!

### API Design
As I began to think about how to design my API: thinking about the routes, how to respond to those routes, and how to interact with my database, I found that I wanted to follow a layers architecture approach in my codebase. This would allow me to easily divide concerns and responsibilities into different files and directories, which would allow direction commmunication only between certain files. 

<div align="center">
  <img width="833" alt="schema-screenshot" src="https://github.com/cesartheroman/Products-API/assets/60380027/f65d8296-4e89-4194-8299-419bb8789235">
</div>

  - The Application layer would handle the basic setup of my server and the connection to my routes, as well as any middlewares and swagger specs later on.
  - The Routes layer defined all of my routes and served as the connection to the Controllers layer, as well as where I handled input validation using `express-validator`.
  - The Controllers layer is where all of the service's business logic would live for each of my endpoints, decide what HTTP codes to return to the client and also serve as the connection to the Model layer.
  - The Model layer housed all of my logic for interacting with my Postgres database (and Redis cache later on).
  - The Persistence layer is where my database lived, which is located in the `/database` directory, outside of the `/server` directory, which instantiates and exports the `Pg.Pool` interface as well as the `Redis.Client` interface.

## Performance Tuning + Optimizations Part 1 (Locally)

### Initial Benchmark
An initial test using Postman on the most computationally heavy query showed a **response time of >1 minute**! With this benchmark in mind, an initial goal was to **optimize my SQL query itself down to under 50ms and a stretch goal of 10ms.**
<img width="1137" alt="Screenshot 2023-06-07 at 5 00 28 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/8c879525-15ee-45c4-a37d-dc5ede74d5d3">

### Client vs Pool
I had intially use the `Pg.Client` class from `node-pg` since it was simple to set up and I began making one off manual tests using Postman, however, according to the [docs](https://node-postgres.com/apis/pool), by utilizing a Client vs a Pool I was in danger of quickly exhausting available, idle clients. This could have the negative effect of causing my server to timeout with an error or hang indefinitely. Additionally, when using `Pg.Pool`, you must release a client back to the pool after each request, thereby ensuring an available client at scale unless the machine itself is overwhelmed. 

This change from using `Pg.Client` to `Pg.Pool` led to an **increase of 375% in performance**
<img width="1270" alt="Screenshot 2023-06-07 at 5 33 49 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/cfa9ac81-4505-46c9-abf0-9b6520a9fd4b">

### Indexing
Once I had learned to properly query my database using connection pooling, I moved on to the biggest optimization of my queries: indexing. However, I knew I couldn't just index everything, since the overhead cost of creating those indexing would negate any performance I was hoping to achieve. With that mindset, I started to think about how to identify what to index, and Postgres' `EXPLAIN ANALYZE` function came to my rescue!

I wanted to understand what the cost of my queries were for each route:

GET `/products/list`:
<img width="1056" alt="Screenshot 2023-06-07 at 6 06 00 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/db65529f-c5df-43d3-b925-c3b35605ff11">

GET `/products/:product_id`:
<img width="1049" alt="Screenshot 2023-06-07 at 6 06 40 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/792ff2db-1eb9-4591-97b7-6d2e4752f535">

GET `/products/:product_id/styles`:
<img width="1103" alt="Screenshot 2023-06-07 at 6 03 59 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/6e5b77f8-bc28-4133-b5e9-e96790536326">

GET `/products/:product_id/related`:
<img width="960" alt="Screenshot 2023-06-07 at 6 07 21 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/55bb4ed5-852b-4c14-ac7f-1231c07eb24e">

After analyzing each of my queries, I realized that there were Sequence scans happening on all queries that weren't looking a product up by ID that were severely limiting my performance. I identified that this was happening on 5 specific relationships:

- `features` and `product_id`
- `styles` and `product_id`
- `photos` and `styles_id`
- `skus` and `styles_id`
- `related` and `product_id`

After creating these 5 indexes, I saw the following performance increases:
- **495% decrease in query time** on GET `/products/list`:
  <img width="1038" alt="Screenshot 2023-06-07 at 6 18 54 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/73db36d0-1de2-4f04-8a97-b625bd4bb3a8">
  
- **7,565% decrease in query time** on GET `/products/:product_id`:
<img width="1058" alt="Screenshot 2023-06-07 at 6 19 39 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/f26cc454-a7bc-4cd2-88e6-40b9fe059a59">

- **1,014,070% decrease in query time** on GET `/products/:product_id/styles`:
<img width="1153" alt="Screenshot 2023-06-07 at 6 24 54 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/5559e2bd-1e7a-48cc-8edd-70110bc211f1">

- **47,757% decrease in query time** on GET `/products/:product_id/related`:
<img width="962" alt="Screenshot 2023-06-07 at 6 27 19 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/0b3f8f7a-65ce-4d64-bca4-16521d95d18a">

All my queries were **WELL BELOW** the stated goal of 50ms and even faster than the stretch goal of 10ms. Now it was time to stress test locally before I deploy and start testing on an EC2 instance!

### Artillery 
Using Artillery to stress test my service, I was able to successfully go up to 100 RPS, but eventually crashed out at 1000 RPS as can be seen below:

<details>
<summary><b>100 RPS:</b> </summary>
<br>
<img width="1273" alt="Screenshot 2023-06-07 at 6 45 13 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/cbb5e605-ee6b-4849-b158-a7a69fcb7233">
</details>

<details>
<summary><b>1,000 RPS:</b> </summary>
<br>
<img width="1277" alt="Screenshot 2023-06-07 at 6 46 11 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/e56882c6-8d1e-4841-bba6-ca4ef8fd8564">
</details>

## Performance Tuning + Optimizations Part 2 (Deployment) w/Loader.io

### One EC2 Instance running Dockerized service
#### GET Products List:
<details>
  <summary>Redis Caching Only: <b>Topped out at 750RPS + 223ms latency</b> </summary>
<br>
<img width="1156" alt="Screenshot 2023-06-03 at 2 43 43 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/b7c67f08-dce7-41f0-9d0d-fcfa8bbf5e48">

</details>

<details>
<summary>Redis + Nginx: <b>Topped out at 750RPS + 1809ms latency</b> </summary>
<br>
<img width="1164" alt="Screenshot 2023-06-03 at 4 00 34 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/3d1e65d2-c0db-4cba-827d-686491ea03bd">
</details>

#### GET Product by ID:
<details>
<summary>Redis Caching Only: <b>Topped out at 200RPS + 14ms latency</b> </summary>
<br>
<img width="1191" alt="Screenshot 2023-06-03 at 2 52 16 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/e087c581-29b5-4353-9bff-e7693e41edca">
</details>

<details>
<summary>Redis + Nginx: <b>Topped out at 200RPS + 15ms latency</b> </summary>
<br>
 <img width="1179" alt="Screenshot 2023-06-03 at 4 09 59 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/057418a5-9064-4e30-a112-6444dfc3ddc3">

</details>
 
#### GET Product Styles:
<details>
<summary>Redis Caching Only: <b>Topped out at 200RPS + 17ms latency</b> </summary>
<br>
<img width="1180" alt="Screenshot 2023-06-03 at 3 00 09 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/6a8e417d-02cd-440f-ba6b-359605d74ff0">
</details>

<details>
<summary>Redis + Nginx: <b>Topped out at 100RPS + 18ms latency</b> </summary>
<br>
<img width="1188" alt="Screenshot 2023-06-03 at 4 14 08 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/0dfd1b6f-0106-4cb6-97f3-c338e12e0dff">
</details>

#### GET Related Product IDs:
<details>
<summary>Redis Caching Only: <b>Topped out at 750RPS + 1686ms latency</b> </summary>
<br>
<img width="1184" alt="Screenshot 2023-06-03 at 3 11 16 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/ca457f8b-2fa9-4bc1-b4dc-be07cd7d925e">
</details>

<details>
<summary>Redis + Nginx: <b>Topped out at 500PS + 1634ms latency</b> </summary>
<br>
<img width="1177" alt="Screenshot 2023-06-03 at 4 21 18 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/892d56db-5c85-42d7-af5a-8a8a7295f580">
</details>

### 4 EC2 Instances (2 servers, 1 Postgres + Redis server, 1 Nginx load balancer)
#### GET Products List:
<details>
<summary>Redis Caching Only: <b>Topped out at 1,000RPS + 758ms latency</b> </summary>
<br>
<img width="1164" alt="Screenshot 2023-06-07 at 8 15 01 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/06fd04d3-887b-40ff-826f-97d11f9152fc">
</details>

<details>
<summary>Redis + Nginx: <b>Topped out at 1,000RPS + 16ms latency</b> </summary>
<br>
<img width="1188" alt="Screenshot 2023-06-06 at 1 48 26 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/b6110edf-d16b-43ef-b284-d3916c90ec95">
</details>

#### GET Product by ID:
<details>
<summary>Redis Caching Only: <b>Topped out at 200RPS + 14ms latency</b> </summary>
<br>
<img width="1171" alt="Screenshot 2023-06-07 at 8 15 32 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/d09c588f-7309-441a-83ef-0e42efc5a7fd">
</details>

<details>
<summary>Redis + Nginx: <b>Topped out at 500RPS + 15ms latency</b> </summary>
<br>
<img width="1185" alt="Screenshot 2023-06-06 at 1 37 52 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/e355bebd-1248-4099-b1ad-93b978486d65">
</details>
 
#### GET Product Styles:
<details>
<summary>Redis Caching Only: <b>Topped out at 200RPS + 16ms latency</b> </summary>
<br>
<img width="1174" alt="Screenshot 2023-06-07 at 8 15 58 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/e0f0b0ba-d8f4-4f45-86e8-2db6c609b8f0">
</details>

<details>
<summary>Redis + Nginx: <b>Topped out at 500RPS + 19ms latency</b> </summary>
<br>
<img width="1200" alt="Screenshot 2023-06-06 at 2 03 31 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/932f7f2a-8c82-406a-bfeb-a8d1e908c66d">
</details>

#### GET Related Product IDs:
<details>
<summary>Redis Caching Only: <b>Topped out at 1,000RPS + 1837ms latency</b> </summary>
<br>
<img width="1179" alt="Screenshot 2023-06-07 at 8 13 52 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/6a86a5b0-f48a-443e-b639-23857abee49c">
</details>

<details>
<summary>Redis + Nginx: <b>Topped out at 1,000RPS + 30ms latency</b> </summary>
<br>
<img width="1162" alt="Screenshot 2023-06-06 at 2 12 18 PM" src="https://github.com/cesartheroman/Products-API/assets/60380027/2a137a4b-7156-40f0-9ecd-b4e31eb157b7">
</details>


## Results Observed

<!--However, I wanted to see how much I could push this in my deployed instance, where I optimized further by, ensuring my SQL quieries were performant and sargable, utilizing a cache-aside strategy with Redis, and finally using Nginx as a load balancer.
-->


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
