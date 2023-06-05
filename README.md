# Greenfield Products API Service

The goal of this project was to work with an inherited legacy front-end e-commerce web portal, and build out a specific API micro-service to be used by the front-end client. The micro-service was to be a RESTful API that would need to handle web-scale traffic and was containerized using Docker and deployed to an Amazon EC2 instance.

- For the purposes of this project, web-scale traffic was defined as:
  - <2000ms of latency 
  - <1% error rate
  - At a minimum of 100 Request/second 

An ETL process was required before beginning the project, as the entire product catalog consisted of 6 CSVs, all of which had to be sanitized and normalized, and represented ~5GBs worth of data or 49M+ records. The ETL process required an in-depth use of Node streams in order to:
  - Creating a readStream for each CSV, since it was impossible to open all of it in memory
  - Piping in a CSV parser with specific configurations for the readStream
  - Loading a custom Transform function-- extending the Transform class in Node in order to normalize all rows and columns
  - Piping to a writeStream with my clean files

Ultimately the ETL process, along with copying all the required CSV files into the Docker container, and loading it into my Posgres instance took 9mins to fully complete. 

The service was then incrementally optimized through indexing techniques and connection pooling while being stress-tested in development with Artillery. I found that on my local machine, I could easily top out at 100 RPS, with the required latency and error rates. However, I wanted to see how much I could push this in my deployed instance, where I optimized further by, ensuring my SQL quieries were performant and sargable, utilizing a cache-aside strategy with Redis, and finally using Nginx as a load balancer. 

# Tech Stack

- TypeScript
- Node.js
- Express
- PostgreSQL
- Docker
- Redis
- Nginx
- Swagger UI
- Artillery

# Routes built

| Method | Endpoint | Purpose | Response Code |
| :----: | :------- | :------ | :-----------: |

# Results
