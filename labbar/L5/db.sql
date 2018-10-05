use rume; # Byt till din egen

drop table securities; # Radera om redan finns
drop table orders;
drop table trades;

create table securities (
	id int NOT NULL AUTO_INCREMENT,
       name varchar(64),
	PRIMARY KEY (id)
);

create table orders (
	id int NOT NULL AUTO_INCREMENT,
       name varchar(64),
       type varchar(64),
       price float,
       amount int,
       uid varchar(64),
	PRIMARY KEY (id)
);

create table trades (
	id int NOT NULL AUTO_INCREMENT,
       name varchar(64),
       price float,
       amount int,
       dt datetime,
       buyer varchar(64),
       seller varchar(64),
	PRIMARY KEY (id)
);
