const Pool = require('../config/db')
const selectAll = () => {
    return Pool.query(`select * from recuiter`);
}
const selectAllSearch = (querysearch) => {
    return Pool.query(`select * from recuiter  ${querysearch} `);
}

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select * from recuiter ${querysearch} order by ${sortby} ${sort} limit ${limit} offset ${offset}`)
}

const selectRecuiter = (id) => {
    return Pool.query(`select * from recuiter where id='${id}'`);
}

const insertRecuiter = (
    id, users_id , position, company , email, address, phone, logo , description
) => {
    return Pool.query(`insert into recuiter ( id, users_id , position, company , email, address, phone, logo , description )   values ( '${id}' , '${users_id}' , '${position}', '${company}' , '${email}'  , '${address}'  , '${phone}'  , '${logo}' , '${description}' ) `)
}

const insertRecuiterOnRegister = (
    id, users_id , position, company 
) => {
    return Pool.query(`insert into recuiter ( id, users_id , position, company )  values ( '${id}' , '${users_id}' , '${position}', '${company}' ) `)
}

const updateRecuiter = (
    id, users_id , position, company , email, address, phone, logo , description
) => {
    return Pool.query(`update recuiter set  users_id = '${users_id}' , position = '${position}' , company = '${company}' , email = '${email}' , address = '${address}' , phone = '${phone}' , logo = '${logo}' ,   description = '${description}'   where id = '${id}' `)
}

const updateRecuiterNoLogo = (
    id, users_id , position, company , email, address, phone , description
) => {
    return Pool.query(`update recuiter set  users_id = '${users_id}' , position = '${position}' , company = '${company}' , email = '${email}' , address = '${address}' , phone = '${phone}' ,  description = '${description}'   where id = '${id}' `)
}

const deleteRecuiter = (id) => {
    return Pool.query(`delete from recuiter where id='${id}'`)
}

const selectUsers = (users_id) => {
    return Pool.query(`select * from users where users.id='${users_id}'`)
}

const countData = () => {
    return Pool.query("SELECT COUNT(*) FROM recuiter");
}

const deleterecuiterSelected = (id) => {
    return Pool.query(`delete from recuiter where id in (${id})`)
}


module.exports = {
    selectAll,
    selectAllSearch,
    selectPagination,
    selectRecuiter,
    insertRecuiter,
    insertRecuiterOnRegister,
    updateRecuiter,
    updateRecuiterNoLogo,
    deleteRecuiter,
    selectUsers,
    countData,
    deleterecuiterSelected,
}