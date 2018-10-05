use ellora; # Byt till din egen

drop table tables; # Radera om redan finns
drop table orders;
drop table items;
drop table reservations;
drop table customers;

#Table that can be booked
create table tables (
	id int NOT NULL AUTO_INCREMENT,
       availible boolean,
       size int,
	PRIMARY KEY (id)
);

#An order by a customer 
create table orders (
	id int NOT NULL AUTO_INCREMENT,
       customerID int,      #Foreign key, connecting customer
       amount float,
       itemID int,         #Foreign key, connecting item
       quantity int,
       dt datetime,
       resolved boolean,
	PRIMARY KEY (id),
       FOREIGN KEY (customerID) REFERENCES customers(id),
       FOREIGN KEY (itemID) REFERENCES items(id)
);

#Dishes for sale
create table items (
       id int NOT NULL AUTO_INCREMENT,
       name varchar(64),
       price float,
       PRIMARY KEY (id)
);

#A reservation by a customer
create table reservations(
	id int NOT NULL AUTO_INCREMENT,
       table int,       #Foreign key, connecting table
       arrival datetime,
       departure datetime,
       customerID int,  #Foreign key, connecting customer
	PRIMARY KEY (id),
       FOREIGN KEY (customerID) REFERENCES customers(id),
       FOREIGN KEY (table) REFERENCES tables(id)
);
#A customer
create table customers (
       id int NOT NULL AUTO_INCREMENT,
       name varchar(64),
       email varchar(64),
       PRIMARY KEY (id)
);

create table reviews (
       id int NOT NULL AUTO_INCREMENT,
       name varchar(64),
       email varchar(64)
       stars int NOT NULL,
       dt datetime,
       review varchar(1000),
       PRIMARY KEY (id)
};