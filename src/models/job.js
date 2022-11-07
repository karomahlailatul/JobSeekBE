const Pool = require("../config/db");
const selectAll = () => {
  return Pool.query(`select * from job`);
};

const selectAllSearch = (querySearch) => {
  return Pool.query(`select
    count(*)
    from job
    inner join
    recruiter on
    job.recruiter_id = recruiter.id
    inner join
    users on
    recruiter.users_id = users.id
    inner join 
    skill_job on 
    job_id = job.id
    inner join 
    skill on
    skill_id = skill.id 
    ${querySearch} 
    GROUP BY job.id `);
};

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select * from job  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `);
};

const selectPaginationJob_FullData = ({ limit, offset, sortby, sort, querySearch }) => {
  return Pool.query(`select
    job.id,
    job.name,
    job.position,
    job.system,
    job.type,
    job.description,
    job.min_salary,
    job.max_salary,
    job.count_apply,
    job.experience_time,
    job.available,
    job.recruiter_id,
    job.promotion_until,
    job.created_on,
    job.updated_on,
    string_agg(distinct recruiter.users_id ,';') as recruiter_users_id,
    string_agg(distinct recruiter.position ,';') as recruiter_position,
    string_agg(distinct recruiter.company ,';') as recruiter_company,
    string_agg(distinct recruiter.email ,';') as recruiter_email,
    string_agg(distinct recruiter.address ,';') as recruiter_address,
    string_agg(distinct recruiter.logo ,';') as recruiter_logo,
    string_agg(distinct recruiter.phone ,';') as recruiter_phone,
    string_agg(distinct recruiter.description ,';') as recruiter_description,
    string_agg(distinct users.name ,';') as users_name,
    string_agg(distinct users.email ,';') as users_email,
    string_agg(distinct users.gender ,';') as users_gender,
    string_agg(distinct users.phone ,';') as users_phone,
    string_agg(distinct to_char(users.date_of_birth, 'yyyy-mm-dd') ,'') as users_date_of_birth,
    string_agg(distinct users.picture ,';') as users_picture,
    string_agg(distinct users.job_desk ,';') as users_job_desk,
    string_agg(distinct users.domicile ,';') as users_domicile,
    string_agg(distinct users.location ,';') as users_location,
    string_agg(distinct users.description ,';') as users_description,
    string_agg(distinct to_char(users.created_on, 'yyyy-mm-dd') ,';') as users_created_on,
    array_agg(skill_job.skill_id) as skill_id,
    array_agg(skill.name) as skill_name
    from job
    inner join
    recruiter on
    job.recruiter_id = recruiter.id
    inner join
    users on
    recruiter.users_id = users.id
    inner join 
    skill_job on 
    job_id = job.id
    inner join 
    skill on
    skill_id = skill.id 
    ${querySearch} 
    GROUP BY job.id 
    order by ${sortby} ${sort} 
    limit ${limit} offset ${offset}`);
};

const selectJob = (id) => {
  return Pool.query(`select * from job where id='${id}'`);
};

const selectJobFullData = (id) => {
  return Pool.query(`
    select
    job.id,
    job.name,
    job.position,
    job.system,
    job.type,
    job.description,
    job.min_salary,
    job.max_salary,
    job.count_apply,
    job.experience_time,
    job.available,
    job.recruiter_id,
    job.promotion_until,
    job.created_on,
    job.updated_on,
    string_agg(distinct recruiter.users_id ,';') as recruiter_users_id,
    string_agg(distinct recruiter.position ,';') as recruiter_position,
    string_agg(distinct recruiter.company ,';') as recruiter_company,
    string_agg(distinct recruiter.email ,';') as recruiter_email,
    string_agg(distinct recruiter.address ,';') as recruiter_address,
    string_agg(distinct recruiter.logo ,';') as recruiter_logo,
    string_agg(distinct recruiter.phone ,';') as recruiter_phone,
    string_agg(distinct recruiter.description ,';') as recruiter_description,
    string_agg(distinct users.name ,';') as users_name,
    string_agg(distinct users.email ,';') as users_email,
    string_agg(distinct users.gender ,';') as users_gender,
    string_agg(distinct users.phone ,';') as users_phone,
    string_agg(distinct to_char(users.date_of_birth, 'yyyy-mm-dd') ,'') as users_date_of_birth,
    string_agg(distinct users.picture ,';') as users_picture,
    string_agg(distinct users.job_desk ,';') as users_job_desk,
    string_agg(distinct users.domicile ,';') as users_domicile,
    string_agg(distinct users.location ,';') as users_location,
    string_agg(distinct users.description ,';') as users_description,
    string_agg(distinct to_char(users.created_on, 'yyyy-mm-dd') ,';') as users_created_on,
    array_agg(skill_job.skill_id) as skill_id,
    array_agg(skill.name) as skill_name
    from job
    inner join
    recruiter on
    job.recruiter_id = recruiter.id
    inner join
    users on
    recruiter.users_id = users.id
    inner join 
    skill_job on 
    job_id = job.id
    inner join 
    skill on
    skill_id = skill.id
    where job.id='${id}'
    GROUP BY job.id `);
};

const selectRecruiter = (recruiter_id) => {
  return Pool.query(`select * from recruiter where id='${recruiter_id}'`);
};

const insertJob = (id, name, position, system, type, description, available, recruiter_id, min_salary, max_salary, count_apply, experience_time, promotionMaxDate) => {
  return Pool.query(`insert into job ( 
        id, name, position, system, type, description, available, recruiter_id, min_salary, max_salary, count_apply, experience_time, promotion_until
        ) values (
            '${id}', '${name}', '${position}', '${system}', '${type}', '${description}', '${available}', '${recruiter_id}', '${min_salary}', '${max_salary}', '${count_apply}', '${experience_time}', ${promotionMaxDate} 
            )`);
};

const updateJob = (id, name, position, system, type, description, available, recruiter_id, min_salary, max_salary, experience_time, promotion_until) => {
  return Pool.query(`update job set 
    name = '${name}' , 
    position = '${position}' , 
    system = '${system}' , 
    type = '${type}' ,  
    description = '${description}' , 
    available = '${available}' , 
    recruiter_id = '${recruiter_id}' ,
    min_salary = '${min_salary}', 
    max_salary = '${max_salary}', 
    experience_time = '${experience_time}' , 
    promotion_until = ${promotion_until} 
    WHERE id = '${id}'`);
};

const deleteJob = (id) => {
  return Pool.query(`delete from job where id='${id}'`);
};

const deleteJobSelected = (id) => {
  return Pool.query(`delete from job where id in (${id})`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM job");
};

const insertSkillJobList = (id_skill_job, job_id, item) => {
  return Pool.query(`insert into skill_job ( id, job_id , skill_id  ) values ('${id_skill_job}', '${job_id}', '${item}')`);
};

const deleteSkillJobList = (id) => {
  return Pool.query(`delete from skill_job where job_id='${id}'`);
};

const checkAllTableDatabase = () => {
  return Pool.query(`SELECT concat(table_name ,'.',column_name) as key_table FROM information_schema.columns WHERE table_schema = 'public' `);
};

const checkTableTypeDatabase = (table_name, column_name) => {
  return Pool.query(` SELECT
    column_name,
    data_type,
    character_maximum_length AS max_length,
    character_octet_length AS octet_length
    FROM
    information_schema.columns
    WHERE
    table_schema = 'public' AND 
    table_name = '${table_name}' AND
    column_name = '${column_name}' `);
};

module.exports = {
  selectAll,
  selectAllSearch,
  selectPagination,
  selectPaginationJob_FullData,
  selectJob,
  selectJobFullData,
  selectRecruiter,
  insertJob,
  updateJob,
  deleteJob,
  deleteJobSelected,
  countData,
  insertSkillJobList,
  deleteSkillJobList,
  checkAllTableDatabase,
  checkTableTypeDatabase,
};
