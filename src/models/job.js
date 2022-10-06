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

const selectPaginationJob_Recruiter_Skill = ({ limit, offset, sortby, sort, querysearch }) => {
    return Pool.query(`select job.id , job.name , job.position , job.domicile , job.description , job.available , job.recruiter_id , job.created_on , job.updated_on , recruiter.users_id , recruiter.position as recruiter_position  , recruiter.company  , recruiter.email  , recruiter.address  , recruiter.logo  , recruiter.phone  , recruiter.description as recruiter_description , recruiter.created_on as recruiter_created_on , recruiter.updated_on as recruiter_updated_on  from job   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
}

const selectJob = (id) => {
    return Pool.query(`select * from job where id='${id}'`);
}


const selectJobFullData = (id) => {
    return Pool.query(`select job.id , job.name , job.position , job.domicile , job.description , job.available , job.recruiter_id , job.created_on , job.updated_on , recruiter.users_id , recruiter.position as recruiter_position  , recruiter.company  , recruiter.email  , recruiter.address  , recruiter.logo  , recruiter.phone  , recruiter.description as recruiter_description , recruiter.created_on as recruiter_created_on , recruiter.updated_on as recruiter_updated_on  from job   inner join recruiter on job.recruiter_id = recruiter.id where job.id='${id}'`);
}


const selectRecruiter = (recruiter_id) => {
    return Pool.query(`select * from recruiter where id='${recruiter_id}'`)
}

const insertJob = (
    id, name , position , domicile , type , description , available , recruiter_id
) => {
    return Pool.query(`insert into job ( id, name , position , domicile , type , description , available , recruiter_id  ) values ('${id}', '${name}', '${position}', '${domicile}', '${type}',  '${description}', '${available}', '${recruiter_id}'  )`)
}

const updateJob = (
    id, name , position , domicile , type , description , available , recruiter_id
) => {
    return Pool.query(`update job set name = '${name}' , position = '${position}' , domicile = '${domicile}' , type = '${type}' ,  description = '${description}' , available = '${available}' , recruiter_id = '${recruiter_id}' WHERE id = '${id}'`)
}

const deleteJob = (id) => {
    return Pool.query(`delete from job where id='${id}'`)
}

const deleteJobSelected = (id) => {
    return Pool.query(`delete from job where id in (${id})`)
}


const countData = () => {
    return Pool.query("SELECT COUNT(*) FROM job");
};

module.exports = {
    selectAll,
    selectAllSearch,
    selectPagination,
    selectPaginationJob_Recruiter_Skill,
    selectJob,
    selectJobFullData,
    selectRecruiter,
    insertJob,
    updateJob,
    deleteJob,
    deleteJobSelected,
    countData
}


