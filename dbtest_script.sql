
DROP TABLE IF EXISTS rental;
DROP TABLE IF EXISTS movie_tags_tag;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS purchase;

DROP DATABASE IF EXISTS blockbusterdb;

CREATE DATABASE blockbusterdb;

\c blockbusterdb;


-- Table: tag

CREATE TABLE tag
(
  id serial NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

-- Table: role

CREATE TABLE role
(
  id serial NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

-- Table: movie

CREATE TABLE movie
(
  id serial NOT NULL,
  title character varying NOT NULL,
  description character varying NOT NULL,
  poster character varying NOT NULL,
  stock integer NOT NULL,
  trailer character varying NOT NULL,
  price numeric(5,2) NOT NULL,
  likes integer NOT NULL DEFAULT 0,
  availability boolean NOT NULL,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
  "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),
  "deletedAt" timestamp without time zone,
  CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


-- Table: "user"

CREATE TABLE "user"
(
  id serial NOT NULL,
  email character varying NOT NULL,
  username character varying NOT NULL,
  password character varying NOT NULL,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp without time zone DEFAULT now(),
  "updatedAt" timestamp without time zone DEFAULT now(),
  "deletedAt" timestamp without time zone,
  "roleId" integer,
  CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
  CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId")
      REFERENCES role (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);


-- Table: movie_tags_tag

CREATE TABLE movie_tags_tag
(
  "movieId" integer NOT NULL,
  "tagId" integer NOT NULL,
  CONSTRAINT "PK_a63fb1cc6083d9417e67029dece" PRIMARY KEY ("movieId", "tagId"),
  CONSTRAINT "FK_5c229532ab9c842d9f712c44a4d" FOREIGN KEY ("movieId")
      REFERENCES movie (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "FK_7f5d867068b30d8263854b3e98d" FOREIGN KEY ("tagId")
      REFERENCES tag (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE movie_tags_tag
  OWNER TO postgres;

-- Index: "IDX_5c229532ab9c842d9f712c44a4"

-- DROP INDEX "IDX_5c229532ab9c842d9f712c44a4";

CREATE INDEX "IDX_5c229532ab9c842d9f712c44a4"
  ON movie_tags_tag
  USING btree
  ("movieId");

-- Index: "IDX_7f5d867068b30d8263854b3e98"

-- DROP INDEX "IDX_7f5d867068b30d8263854b3e98";

CREATE INDEX "IDX_7f5d867068b30d8263854b3e98"
  ON movie_tags_tag
  USING btree
  ("tagId");

-- Table: rental

CREATE TABLE rental
(
  id serial NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
  returned boolean NOT NULL DEFAULT false,
  "userId" integer,
  "movieId" integer,
  CONSTRAINT "PK_a20fc571eb61d5a30d8c16d51e8" PRIMARY KEY (id),
  CONSTRAINT "FK_2f2be23e8f7d76f14807c7564e8" FOREIGN KEY ("movieId")
      REFERENCES movie (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_5c91d10c5ee7afddcb2dbbfbbd0" FOREIGN KEY ("userId")
      REFERENCES "user" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);

-- Table: purchase

CREATE TABLE purchase
(
  id serial NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
  "userId" integer,
  "movieId" integer,
  CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY (id),
  CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b" FOREIGN KEY ("userId")
      REFERENCES "user" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_d273db7e973c77b4c63c2efcee4" FOREIGN KEY ("movieId")
      REFERENCES movie (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);




INSERT INTO role (name)
    VALUES ('ADMIN'),('CLIENT');

INSERT INTO "user"(email, username, password, "isActive", "roleId")
    VALUES ('admin@admin.com','admin','$2b$10$yFvC2wic9FdfpLcfm6X11.zaV0iUJ5Lx2WPVm/dAxgKHeJon9CNwq',TRUE,1);


INSERT INTO movie(
            title, description, poster, stock, trailer, price, likes, availability)
    VALUES 
    ('Finding Nemo', 'Marlyn is a fish and is looking for Nemo', 'https://i.ibb.co/k8Dkx86/descarga-2.jpg', 5, 'https://www.youtube.com/watch?v=9oQ628Seb9w', 5.99, 50, TRUE),
    ('Finding Dory', 'Now Marlyn and Nemo are looking for Dory', 'https://i.ibb.co/Kyp82Br/descarga-3.jpg', 8, 'https://www.youtube.com/watch?v=JhvrQeY3doI', 6.99, 87, TRUE),
    ('21 Jump Street', 'The best police officers of their home', 'https://i.ibb.co/Nst027S/descarga.jpg', 2, 'https://www.youtube.com/watch?v=RLoKtb4c4W0', 5.99, 76 , TRUE),
    ('22 Jump Street', 'Now in the university', 'https://i.ibb.co/27SK47f/descarga-1.jpg', 1, 'https://www.youtube.com/watch?v=qP755JkDxyM', 6.99, 121 , TRUE);
