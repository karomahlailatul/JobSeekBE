const Pool = require("../config/db");
const selectAll = () => {
  return Pool.query(`select * from skill_job`);
};

const selectAllSearch = (querysearch) => {
  return Pool.query(`select * from skill_job  ${querysearch} `);
};

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select * from skill_job   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `);
};

const selectPaginationSkillJob_Job_Skill = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select *  from skill_job   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `);
};

const selectSkillJob = (id) => {
  return Pool.query(`select * from skill_job where id='${id}'`);
};

const selectSkill = (skill_id) => {
  return Pool.query(`select * from skill where id = '${skill_id}'`);
};

const selectJob = (job_id) => {
  return Pool.query(`select * from job where id='${job_id}'`);
};

const insertSkillJob = (id, job_id, skill_id) => {
  return Pool.query(`insert into skill_job ( id, job_id , skill_id  ) values ('${id}', '${job_id}', '${skill_id}'  )`);
};

const updateSkillJob = (id, job_id, skill_id) => {
  return Pool.query(`update skill_job set job_id = '${job_id}' , skill_id = '${skill_id}' WHERE id = '${id}'`);
};

const deleteSkillJob = (id) => {
  return Pool.query(`delete from skill_job where id='${id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM skill_job");
};

module.exports = {
  selectAll,
  selectAllSearch,
  selectPagination,
  selectPaginationSkillJob_Job_Skill,
  selectSkillJob,
  selectSkill,
  selectJob,
  insertSkillJob,
  updateSkillJob,
  deleteSkillJob,
  countData,
};
