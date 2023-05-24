CREATE INDEX features_product ON features (product_id);

CREATE INDEX styles_products ON styles (product_id);

CREATE INDEX photos_styles ON photos (styles_id);

CREATE INDEX skus_styles ON skus (styles_id);

CREATE INDEX related_products ON related (product_id)