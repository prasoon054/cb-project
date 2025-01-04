FROM postgres:15
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=200521
ENV POSTGRES_DB=cb_db
COPY ./init.sql /docker-entrypoint-initdb.d/
