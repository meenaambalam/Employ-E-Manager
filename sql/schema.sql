DROP DATABASE IF EXISTS HumanResource_DB;

CREATE database HumanResource_DB;

USE HumanResource_DB;


CREATE TABLE department (
    id integer auto_increment not null,
    name varchar(30),
    primary key (id)
);

CREATE TABLE role(
    id integer auto_increment not null,
    title varchar(30),
    salary decimal,
    department_id integer,
    primary key (id)
);

CREATE TABLE employee (
    id integer auto_increment not null,
    first_name varchar(30),
    last_name varchar(30),
    role_id integer,
    manager_id integer,
    primary key (id)    

)

-- seed data
-- Department Table
insert into department (name) values ('Information Technology');
insert into department (name) values ('Operation Research');

-- Role Table
insert into role (title, salary, department_id)
values ('Senior Manager', 100000, 1);

insert into role (title, salary, department_id)
values ('Principal Engineer', 200000, 1);

insert into role (title, salary, department_id)
values ('Senior analyst', 150000, 2);

insert into role (title, salary, department_id)
values ('General Manager', 175000, 2);

-- Employee Table

insert into employee (first_name, last_name, role_id)
values ('John', 'Smith', 1);

insert into employee (first_name, last_name, role_id)
values ('Kylie', 'Johnson', 3);


