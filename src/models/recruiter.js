const Pool = require('../config/db')
const selectAll = () => {
    return Pool.query(`select * from recruiter`);
}
const selectAllSearch = (querysearch) => {
    return Pool.query(`select * from recruiter  ${querysearch} `);
}

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select * from recruiter ${querysearch} order by ${sortby} ${sort} limit ${limit} offset ${offset}`)
}

const selectRecruiter = (id) => {
    return Pool.query(`select * from recruiter where id='${id}'`);
}

const insertRecruiter = (
    id, users_id , position, company , email, address, phone, logo , description
) => {
    return Pool.query(`insert into recruiter ( id, users_id , position, company , email, address, phone, logo , description )   values ( '${id}' , '${users_id}' , '${position}', '${company}' , '${email}'  , '${address}'  , '${phone}'  , '${logo}' , '${description}' ) `)
}

const insertRecruiterOnRegister = (
    id, users_id , position, company 
) => {
    return Pool.query(`insert into recruiter ( id, users_id , position, company )  values ( '${id}' , '${users_id}' , '${position}', '${company}' ) `)
}

const updateRecruiter = (
    id, users_id , position, company , email, address, phone, logo , description
) => {
    return Pool.query(`update recruiter set  users_id = '${users_id}' , position = '${position}' , company = '${company}' , email = '${email}' , address = '${address}' , phone = '${phone}' , logo = '${logo}' ,   description = '${description}'   where id = '${id}' `)
}

const updateRecruiterNoLogo = (
    id, users_id , position, company , email, address, phone , description
) => {
    return Pool.query(`update recruiter set  users_id = '${users_id}' , position = '${position}' , company = '${company}' , email = '${email}' , address = '${address}' , phone = '${phone}' ,  description = '${description}'   where id = '${id}' `)
}

const deleteRecruiter = (id) => {
    return Pool.query(`delete from recruiter where id='${id}'`)
}

const selectUsers = (users_id) => {
    return Pool.query(`select * from users where users.id='${users_id}'`)
}

const countData = () => {
    return Pool.query("SELECT COUNT(*) FROM recruiter");
}

const deleterecruiterSelected = (id) => {
    return Pool.query(`delete from recruiter where id in (${id})`)
}


module.exports = {
    selectAll,
    selectAllSearch,
    selectPagination,
    selectRecruiter,
    insertRecruiter,
    insertRecruiterOnRegister,
    updateRecruiter,
    updateRecruiterNoLogo,
    deleteRecruiter,
    selectUsers,
    countData,
    deleterecruiterSelected,
}