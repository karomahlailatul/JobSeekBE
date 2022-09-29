const Pool = require('../config/db')
const selectAll = () => {
    return Pool.query(`select * from job`);
}

const selectAllSearch = (querysearch) => {
    return Pool.query(`select * from job  ${querysearch} `);
}

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select * from job  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
}

const selectPaginationJob_Recuiter_Skill = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select job.id , job.name , job.position , job.domicile , job.skill_id , job.description , job.available , job.recuiter_id , job.created_on , job.updated_on , recuiter.users_id , recuiter.position as recuiter_position  , recuiter.company  , recuiter.email  , recuiter.address  , recuiter.logo  , recuiter.phone  , recuiter.description as recuiter_description , recuiter.created_on as recuiter_created_on , recuiter.updated_on as recuiter_updated_on , skill.name as skill_name  from job   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
}

const selectJob = (id) => {
    return Pool.query(`select * from job where id='${id}'`);
}


const selectJobFullData = (id) => {
    return Pool.query(`select job.id , job.name , job.position , job.domicile , job.skill_id , job.description , job.available , job.recuiter_id , job.created_on , job.updated_on , recuiter.users_id , recuiter.position as recuiter_position  , recuiter.company  , recuiter.email  , recuiter.address  , recuiter.logo  , recuiter.phone  , recuiter.description as recuiter_description , recuiter.created_on as recuiter_created_on , recuiter.updated_on as recuiter_updated_on , skill.name as skill_name  from job  inner join skill on job.skill_id = skill.id  inner join recuiter on job.recuiter_id = recuiter.id where job.id='${id}'`);
}


const selectSkill = (skill_id) => {
    return Pool.query(`select * from skill where id='${skill_id}'`)
}

const selectRecuiter = (recuiter_id) => {
    return Pool.query(`select * from recuiter where id='${recuiter_id}'`)
}

const insertJob = (
    id, name , position , domicile , type , skill_id, description , available , recuiter_id
) => {
    return Pool.query(`insert into job ( id, name , position , domicile , type , skill_id, description , available , recuiter_id  ) values ('${id}', '${name}', '${position}', '${domicile}', '${type}', '${skill_id}', '${description}', '${available}', '${recuiter_id}'  )`)
}

const updateJob = (
    id, name , position , domicile , type , skill_id, description , available , recuiter_id
) => {
    return Pool.query(`update job set name = '${name}' , position = '${position}' , domicile = '${domicile}' , type = '${type}' , skill_id = '${skill_id}' , description = '${description}' , available = '${available}' , recuiter_id = '${recuiter_id}' WHERE id = '${id}'`)
}

const deleteJob = (id) => {
    return Pool.query(`delete from job where id='${id}'`)
}

const countData = () => {
    return Pool.query("SELECT COUNT(*) FROM job");
};

module.exports = {
    selectAll,
    selectAllSearch,
    selectPagination,
    selectPaginationJob_Recuiter_Skill,
    selectJob,
    selectJobFullData,
    selectRecuiter,
    selectSkill,
    insertJob,
    updateJob,
    deleteJob,
    countData
}


