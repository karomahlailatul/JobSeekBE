const Pool = require("../config/db");
const selectAll = () => {
  return Pool.query(`select * from portfolio`);
};
const selectAllSearch = (querysearch) => {
  return Pool.query(`select * from portfolio  ${querysearch} `);
};

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select * from portfolio ${querysearch} order by ${sortby} ${sort} limit ${limit} offset ${offset}`);
};

const selectPortfolio = (id) => {
  return Pool.query(`select * from portfolio where id='${id}'`);
};

const insertPortfolio = (id, name, link, type, photo, description, users_id) => {
  return Pool.query(`insert into portfolio ( id, name, link, type, photo, description, users_id )   values ( '${id}' , '${name}' , '${link}', '${type}' , '${photo}' , '${description}' , '${users_id}' ) `);
};

const updatePortfolio = (id, name, link, type, photo, description, users_id) => {
  return Pool.query(`update portfolio set name = '${name}' , link = '${link}', type = '${type}' , photo = '${photo}' , description = '${description}' , users_id = '${users_id}' where id = '${id}' `);
};

const updatePortfolioNoPhoto = (id, name, link, type, description, users_id) => {
  return Pool.query(`update portfolio set name = '${name}' , link = '${link}', type = '${type}' , description = '${description}' , users_id = '${users_id}' where id = '${id}' `);
};

const deletePortfolio = (id) => {
  return Pool.query(`delete from portfolio where id='${id}'`);
};

const selectUsers = (users_id) => {
  return Pool.query(`select * from users where users.id='${users_id}'`);
};

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM portfolio");
};

const deletePortfolioSelected = (id) => {
  return Pool.query(`delete from portfolio where id in (${id})`);
};

module.exports = {
  selectAll,
  selectAllSearch,
  selectPagination,
  selectPortfolio,
  insertPortfolio,
  updatePortfolio,
  updatePortfolioNoPhoto,
  deletePortfolio,
  selectUsers,
  countData,
  deletePortfolioSelected,
};
