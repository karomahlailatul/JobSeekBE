const Pool = require("../config/db");
const selectAll = () => {
  return Pool.query(`select * from job_apply`);
};

const selectAllSearch = (querysearch) => {
  return Pool.query(`select * from job_apply  ${querysearch} `);
};

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select * from job_apply  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `);
};

const selectPaginationJobApply_Users_Job_Recruiter = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(
    `select  job_apply.id , job_apply.job_id , job_apply.users_id , job_apply.status ,job_apply.message , job_apply.created_on , job_apply.updated_on , job.name , job.position ,  job.system  , job.description , job.available , job.recruiter_id , job.created_on as job_created_on , job.updated_on as job_updated_on , recruiter.users_id , recruiter.position as recruiter_position  , recruiter.company  , recruiter.email  , recruiter.address  , recruiter.logo  , recruiter.phone  , recruiter.description as recruiter_description , recruiter.created_on as recruiter_created_on , recruiter.updated_on as recruiter_updated_on , users.name as users_name , users.email as users_email , users.gender , users.phone as users_phone  , users.date_of_birth  , users.picture  , users.job_desk as users_job_desk  , users.system as users_system  , users.location as users_location , users.created_on as users_created_on   , users.updated_on  as users_updated_on   from job_apply   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `
  );
};

const selectJobApply = (id) => {
  return Pool.query(`select * from job_apply where id='${id}'`);
};

const selectUsers = (users_id) => {
  return Pool.query(`select * from users where id='${users_id}'`);
};

const selectJob = (job_id) => {
  return Pool.query(`select * from job where id='${job_id}'`);
};

const insertJobApply = (id, job_id, users_id, status, message) => {
  return Pool.query(`insert into job_apply ( id, job_id , users_id , status ,message  ) values ('${id}', '${job_id}', '${users_id}', '${status}', '${message}'  )`);
};

const updateJobApply = (id, job_id, users_id, status, message) => {
  return Pool.query(`update job_apply set job_id = '${job_id}' , users_id = '${users_id}' , status = '${status}', message = '${message}'  WHERE id = '${id}'`);
};

const deleteJobApply = (id) => {
  return Pool.query(`delete from job_apply where id='${id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM job_apply");
};

module.exports = {
  selectAll,
  selectAllSearch,
  selectPagination,
  selectPaginationJobApply_Users_Job_Recruiter,
  selectJobApply,
  selectUsers,
  selectJob,
  insertJobApply,
  updateJobApply,
  deleteJobApply,
  countData,
};
