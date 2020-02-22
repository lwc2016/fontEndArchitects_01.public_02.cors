create table if not exists user_table(
    id int primary key auto_increment,
    name varchar(32) not null unique,
    nickName varchar(32) not null unique,
    avatar varchar(64) not null,
    password varchar(128) not null,
    createdTime datetime default Now()
);