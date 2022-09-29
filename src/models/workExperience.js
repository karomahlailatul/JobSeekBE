const Pool = require('../config/db')
const selectAll = () => {
    return Pool.query(`select * from work_experience`);
}

const selectAllSearch = (querysearch) => {
    return Pool.query(`select * from work_experience  ${querysearch} `);
}

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select * from work_experience  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
}

const selectWorkExperience = (id) => {
    return Pool.query(`select * from work_experience where id='${id}'`);
}

const selectUsers = (users_id) => {
    return Pool.query(`select * from users where id='${users_id}'`)
}

const insertWorkExperience = (
    id,
    position, 
    company, 
    started, 
    ended, 
    description, 
    users_id 
) => {
    return Pool.query(`insert into work_experience ( id , position , company ,  started , ended ,  description , users_id ) values ('${id}', '${position}','${company}','${started}','${ended}','${description}', '${users_id}' )`)
}

const updateWorkExperience = (
    id,
    position, 
    company, 
    started, 
    ended, 
    description, 
    users_id 
) => {
    return Pool.query(`update work_experience set position = '${position}' , company = '${company}' , started = '${started}' , ended = '${ended}' , description = '${description}' , users_id = '${users_id}'  WHERE id = '${id}' `)

}

const deleteWorkExperience = (id) => {
    return Pool.query(`delete from work_experience where id='${id}'`)
}

const countData = () => {
    return Pool.query("SELECT COUNT(*) FROM work_experience");
};

module.exports = {
    selectAll,
    selectAllSearch,
    selectPagination,
    selectWorkExperience,
    selectUsers,
    insertWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    countData,
}


