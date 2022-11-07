create table skill (
id              text    not null,
name            text    ,
created_on      timestamptz default CURRENT_TIMESTAMP not null	,
primary key     (id) 
);



create table users(
id 			    text 	not null,
email 			text 	not null,
password  		text 	not null,
username   text ,
name 			text    ,
gender 			text 	,
phone 			text 	,
date_of_birth 	date 	,
picture 		text 	,

job_desk 		text 	,
domicile 		text 	,
location 		text 	,
description     text 	,
 
role 			text not null ,
verify          text not null ,

created_on 		timestamp default CURRENT_TIMESTAMP not null	,
updated_on 		timestamp default CURRENT_TIMESTAMP not null	,

check 	        (role       in ('user', 'recruiter', 'admin')),

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





create table users_verification (
    id text not null ,
    users_id text ,
    token text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	users foreign key(users_id) 	references 	users(id) ON DELETE CASCADE,
primary key (id)
)



create table work_experience (
id text not null ,
position text ,
company text ,
started date ,
ended date ,
description text ,
users_id 		text	,
created_on timestamp default CURRENT_TIMESTAMP not null	,
constraint 	users foreign key(users_id) 	references 	users(id) ON DELETE CASCADE,
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
constraint 	users foreign key(users_id) 	references 	users(id) ON DELETE CASCADE,
primary key (id) 
);


create table skill_users (
id text not null ,

skill_id 		text	,
users_id 		text	,
created_on timestamp default CURRENT_TIMESTAMP not null	,
constraint 	skill foreign key(skill_id) 	references 	skill(id) ON DELETE CASCADE,
constraint 	users foreign key(users_id) 	references 	users(id) ON DELETE CASCADE,
primary key (id) 
);










create table recruiter(
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

constraint 	users foreign key(users_id) references 	users(id) ON DELETE CASCADE,

primary key (id) 
);




CREATE  FUNCTION update_updated_on_recruiter()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';



CREATE TRIGGER update_recruiter_updated_on
    BEFORE UPDATE
    ON
        recruiter
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_recruiter();












create table job(
id 				text 	not null,
name 			  	text ,
position		 		text ,
system        text ,
type            text ,


min_salary int,
max_salary int,
count_apply int,
experience_time int ,


description 			text ,
available   text,

recruiter_id text ,

promotion_until  timestamp , 

created_on 			timestamp default CURRENT_TIMESTAMP not null	,
updated_on 			timestamp default CURRENT_TIMESTAMP not null	,

check 		(system  	in ('on-site','remote')),
-- check 		(type     	in ('intership','full-time','full-time','freelance')),
check 		(available  	in ('on','off')),

constraint recruiter foreign key(recruiter_id) references recruiter(id) ON DELETE CASCADE,

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


create table skill_job (
id text not null ,
skill_id 		text	,
job_id 		text	,
created_on timestamp default CURRENT_TIMESTAMP not null	,
constraint 	skill foreign key(skill_id) 	references 	skill(id) ON DELETE CASCADE,
constraint 	job foreign key(job_id) 	references 	job(id) ON DELETE CASCADE,
primary key (id) 
);



create table job_apply(
id 				text 	not null,
job_id 			text	,
users_id 			text	,
message     text ,
status text ,
created_on 		timestamp default CURRENT_TIMESTAMP not null	,
updated_on      timestamp default CURRENT_TIMESTAMP not null	,

constraint job foreign key(job_id) references job(id) ON DELETE CASCADE,
constraint users foreign key(users_id) references users(id) ON DELETE CASCADE,

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






insert into skill ( id, name ) values 
('skill-1','HTML'),
('skill-2','CSS'),
('skill-3','JavaScript'),
('skill-4','PHP'),
('skill-5','NodeJs'),
('skill-6','ExpressJs'),
('skill-7','Git'),
('skill-8','SQL'),
('skill-9','MySQL'),
('skill-10','PostgreSQL'),
('skill-11','ReactJs'),
('skill-12','Laravel'),
('skill-13','NextJs'),
('skill-14','Python'),
('skill-15','Java'),
('skill-16','C++'),
('skill-17','C#'),
('skill-18','C');