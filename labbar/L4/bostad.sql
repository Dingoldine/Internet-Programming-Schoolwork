use rumman; 

drop table bostader; # Om det finns en tidigare databas

create table bostader(
lan varchar(64),
objekttyp varchar(64),
adress varchar(64),
area float,
rum int,
pris float,
avgift float
);

alter table bostader CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

insert into bostader values ('Stockholm','Bostadsrätt','Polhemsgatan 1',30,1,1000000,1234);

insert into bostader values ('Stockholm','Bostadsrätt','Polhemsgatan 2',60,2,2000000,2345);

insert into bostader values ('Stockholm','Villa','Storgatan 1',130,5,1000000,3456);

insert into bostader values ('Stockholm','Villa','Storgatan 2',160,6,1000000,3456);

insert into bostader values ('Uppsala','Bostadsrätt','Gröna gatan 1',30,1,500000,1234);

insert into bostader values ('Uppsala','Bostadsrätt','Gröna gatan 2',60,2,1000000,2345);

insert into bostader values ('Uppsala','Villa','Kungsängsvägen 1',130,5,1000000,3456);

insert into bostader values ('Uppsala','Villa','Kungsängsvägen 2',160,6,1000000,3456);

insert into bostader values ('Stockholm', 'Villa', 'Vallmovägen 11',180,8,10000000,1234);

insert into bostader values ('Stockholm', 'Villa', 'Blåklintsvägen 7',140,6,8000000,1000);

insert into bostader values ('Stockholm', 'Bostadsrätt', 'Proffesorslingan 12',40,3,5000000,2000);

insert into bostader values ('Göteborg', 'Bostadsrätt', 'Glenngatan 78',70,4,6000000,2000);

insert into bostader values ('Stockholm','Bostadsrätt','Farstavägen 108',55,3,3000000,2456);

insert into bostader values ('Stockholm','Bostadsrätt','Trångsundstorg 1',25,1,1500000,1000);

insert into bostader values ('Stockholm','Villa','Rondovägen 1',100,4,4000000,1000);

SELECT * FROM bostader
