create table skill (
id              text    not null,
name            text    ,
created_on      timestamp default CURRENT_TIMESTAMP not null	,
primary key     (id) 
);



create table users(
id 			    text 	not null,
email 			text 	not null,
password  		text 	not null,
name 			text    ,
gender 			text 	,
phone 			text 	,
date_of_birth 	date 	,
picture 		text 	,

job_desk 		text 	,
domicile 		text 	,
location 		text 	,
description     text 	,
 
role 			text 	not null ,

created_on 		timestamp default CURRENT_TIMESTAMP not null	,
updated_on 		timestamp default CURRENT_TIMESTAMP not null	,

check 	        (role       in ('user', 'recuiter', 'admin')),

primary key (id) 
);



CREATE  FUNCTION update_updated_on_users()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER update_users_updated_on
    BEFORE UPDATE
    ON
        users
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_users();








create table work_experience (
id text not null ,
position text ,
company text ,
started date ,
ended date ,
description text ,
users_id 		text	,
created_on timestamp default CURRENT_TIMESTAMP not null	,
constraint 	users foreign key(users_id) 	references 	users(id),
primary key (id) 
);


create table portfolio (
id text not null ,
name text ,
link text ,
type text ,
photo text ,
description  text,
users_id 		text	,
created_on timestamp default CURRENT_TIMESTAMP not null	,
constraint 	users foreign key(users_id) 	references 	users(id),
primary key (id) 
);


create table skill_users (
id text not null ,

skill_id 		text	,
users_id 		text	,
created_on timestamp default CURRENT_TIMESTAMP not null	,
constraint 	skill foreign key(skill_id) 	references 	skill(id),
constraint 	users foreign key(users_id) 	references 	users(id),
primary key (id) 
);










create table recuiter(
id text not null,

users_id 		text	,

position text ,
company text ,
email text ,
address text ,
logo text ,
phone text ,
description text ,

created_on timestamp default CURRENT_TIMESTAMP not null,
updated_on timestamp default CURRENT_TIMESTAMP not null,

constraint 	users foreign key(users_id) 	references 	users(id),

primary key (id) 
);




CREATE  FUNCTION update_updated_on_recuiter()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER update_recuiter_updated_on
    BEFORE UPDATE
    ON
        recuiter
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_recuiter();












create table job(
id 				text 	not null,
name 			  	text ,
position		 		text ,
domicile        text ,
type            text ,

skill_id        text ,

description 			text ,
available   text,

recuiter_id text ,

created_on 			timestamp default CURRENT_TIMESTAMP not null	,
updated_on 			timestamp default CURRENT_TIMESTAMP not null	,

check 		(domicile  	in ('on-site','remote')),
check 		(type     	in ('full-time','part-time')),
check 		(available  	in ('on','off')),

constraint skill foreign key(skill_id) references skill(id),
constraint recuiter foreign key(recuiter_id) references recuiter(id),

primary key (id)
);



CREATE  FUNCTION update_updated_on_job()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER update_job_updated_on
    BEFORE UPDATE
    ON
        job
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_job();







create table job_apply(
id 				text 	not null,
job_id 			text	,
users_id 			text	,
status text ,
created_on 		timestamp default CURRENT_TIMESTAMP not null	,
updated_on      timestamp default CURRENT_TIMESTAMP not null	,

constraint job foreign key(job_id) references job(id),
constraint users foreign key(users_id) references users(id),

primary key (id)
);



CREATE  FUNCTION update_updated_on_job_apply()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER update_job_apply_updated_on
    BEFORE UPDATE
    ON
        job_apply
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_job_apply();


