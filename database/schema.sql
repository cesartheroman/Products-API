DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR (255),
  slogan VARCHAR (255),
  description TEXT,
  category VARCHAR (255),
  default_price INTEGER
);

DROP TABLE IF EXISTS features;

CREATE TABLE features (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products,
  feature VARCHAR (255) NOT NULL,
  value VARCHAR (255) NOT NULL
);

DROP TABLE IF EXISTS styles;

CREATE TABLE styles (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products,
  name VARCHAR (255) NOT NULL,
  sale_price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  default_style boolean
);

DROP TABLE IF EXISTS related;

CREATE TABLE related (
  id SERIAL PRIMARY KEY,
  current_product_id INTEGER NOT NULL,
  related_product_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  style_id INTEGER REFERENCES styles,
  url TEXT,
  thumbnail_url TEXT
);