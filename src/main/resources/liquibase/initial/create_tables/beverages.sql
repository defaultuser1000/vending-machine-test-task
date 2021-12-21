-- changeset
-- id:20211211-02 author:zakrzhevskiy-as

-- Create Sequence -----------------------------------------------

CREATE SEQUENCE beverages_id_seq START 1;

-- Table Definition ----------------------------------------------

CREATE TABLE beverages (
    id bigint DEFAULT nextval('beverages_id_seq'::regclass) PRIMARY KEY,
    available_volume double precision NOT NULL,
    beverage_type character varying(255) NOT NULL,
    created timestamp without time zone default current_timestamp NOT NULL,
    modified timestamp without time zone default current_timestamp NOT NULL
);