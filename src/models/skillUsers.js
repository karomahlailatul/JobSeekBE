const Pool = require("../config/db");
const selectAll = () => {
  return Pool.query(`select * from skill_users`);
};

const selectAllSearch = (querysearch) => {
  return Pool.query(`select * from skill_users  ${querysearch} `);
};

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select * from skill_users  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `);
};
const selectSkillUsers = (id) => {
  return Pool.query(`select * from skill_users where id='${id}'`);
};

const selectSkill = (recipes_id) => {
  return Pool.query(`select * from skill where id='${recipes_id}'`);
};

const selectUsers = (users_id) => {
  return Pool.query(`select * from users where id='${users_id}'`);
};

const insertSkillUsers = (id, skill_id, users_id) => {
  return Pool.query(`insert into skill_users ( id, skill_id,  users_id ) values ('${id}', '${skill_id}', '${users_id}'  )`);
};

const updateSkillUsers = (id, skill_id, users_id) => {
  return Pool.query(`update skill_users set skill_id = '${skill_id}' , users_id = '${users_id}' WHERE id = '${id}'`);
};

const deleteSkillUsers = (id) => {
  return Pool.query(`delete from skill_users where id='${id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM skill_users");
};

module.exports = {
  selectAll,
  selectAllSearch,
  selectPagination,
  selectSkillUsers,
  selectUsers,
  selectSkill,
  insertSkillUsers,
  updateSkillUsers,
  deleteSkillUsers,
  countData,
};
