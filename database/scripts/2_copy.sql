COPY products FROM '/data/clean_products.csv' DELIMITER ',' CSV;

COPY features FROM '/data/clean_features.csv' DELIMITER ',' CSV;

COPY related FROM '/data/clean_related.csv' DELIMITER ',' CSV;

COPY styles FROM '/data/clean_styles.csv' DELIMITER ',' CSV;

COPY skus FROM '/data/clean_skus.csv' DELIMITER ',' CSV;

COPY photos (styles_id,url,thumbnail_url) FROM '/data/clean_photos.csv' DELIMITER ',' CSV;

SELECT setval('products_product_id_seq', (SELECT MAX(product_id) FROM products)+1);