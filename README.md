# Greenfield Products API Service

The goal of this project was to work with a legacy front-end web portal, built by another engineering team, and build out a specific API service to be used by the front-end client. This API service was to be a RESTful API that would need to handle web-scale traffic as well as the entire dataset product catalog (~5GBs worth of data or 49M+ records). An ETL process was required before beginning the project, in order to pass in the appropriate data to a Postgres database. The service was then incrementally optimized through indexing techniques and connection pooling. The API service was containerized using Docker and deployed to an Amazon EC2 instance.

# Tech Stack

- TypeScript
- Node.js
- Express
- PostgreSQL
- Docker

# Routes built

| Method | Endpoint | Purpose | Response Code |
| :----: | :------- | :------ | :-----------: |

# Results
