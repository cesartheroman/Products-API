FROM postgres:15.2-alpine

ADD scripts/1_init.sql /docker-entrypoint-initdb.d

ADD scripts/2_copy.sql /docker-entrypoint-initdb.d

ADD scripts/3_indexing.sql /docker-entrypoint-initdb.d

RUN chmod a+r /docker-entrypoint-initdb.d/*