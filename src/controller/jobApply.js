const { v4: uuidv4 } = require("uuid");
const jobApplyModel = require("../models/jobApply");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const jobApplyController = {
    getPaginationJobApply: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search;
            let querysearch = "";
            let totalData = "";
            if (search === undefined) {
                querysearch = ``;
                totalData = parseInt((await jobApplyModel.selectAll()).rowCount);
            } else {
                querysearch = ` inner join job on job_apply.job_id = job.id inner join users on job_apply.users_id = users.id where job.name ilike '%${search}%' `;
                totalData = parseInt((await jobApplyModel.selectAllSearch(querysearch)).rowCount);
            }
            const sortby = "job_apply." + ( req.query.sortby || "created_on" );
            const sort = req.query.sort || "desc";
            const result = await jobApplyModel.selectPagination({ limit, offset, sortby, sort, querysearch });
            const totalPage = Math.ceil(totalData / limit);
            const pagination = {
                currentPage: page,
                limit: limit,
                totalData: totalData,
                totalPage: totalPage,
            };
            commonHelper.response(res, result.rows, 200, null, pagination);
        } catch (error) {
            res.send(createError(404));
        }
    },
    getJobApply: async (req, res) => {
        try {
            const id = req.params.id;

            const checkjobApply = await jobApplyModel.selectJobApply(id);

            try {
                if (checkjobApply.rowCount == 0) throw "Job Apply has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const result = checkjobApply;
            // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
            commonHelper.response(res, result.rows, 200, null);
        } catch (error) {
            res.send(createError(404));
        }
    },
    insertJobApply: async (req, res) => {
        try {
            const id = uuidv4().toLocaleLowerCase();

            const { job_id , users_id , status } = req.body;
            
            const checkJob = await jobApplyModel.selectJob(job_id); 

            try {
                if (checkJob.rowCount == 0) throw "Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const checkUsers = await jobApplyModel.selectUsers(users_id);

            try {
                if (checkUsers.rowCount == 0) throw "Users has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            await jobApplyModel.insertJobApply( id, job_id , users_id , status );
            commonHelper.response(res, null, 201, "New Job Apply Created");
            
        } catch (error) {
            res.send(createError(400));
        }
    },
    updateJobApply: async (req, res) => {
        try {
            const id = req.params.id;

            const { job_id , users_id , status } = req.body;

            const checkjobApply = await jobApplyModel.selectJobApply(id);

            try {
                if (checkjobApply.rowCount == 0) throw "jobApply has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }
            
            const checkJob = await jobApplyModel.selectJob(job_id); 

            try {
                if (checkJob.rowCount == 0) throw "Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const checkUsers = await jobApplyModel.selectUsers(users_id);

            try {
                if (checkUsers.rowCount == 0) throw "Users has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

        
            await jobApplyModel.updateJobApply( id, job_id , users_id , status );
            commonHelper.response(res, null, 201, "Job Apply Updated");
        } catch (error) {
            res.send(createError(400));
        }
    },
    deleteJobApply: async (req, res) => {
        try {
            const id = req.params.id;

            const checkjobApply = await jobApplyModel.selectJobApply(id);

            try {
                if (checkjobApply.rowCount == 0) throw "Job Apply has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            jobApplyModel.deleteJobApply(id);
            commonHelper.response(res, null, 200, "Job Apply Deleted");
        } catch (error) {
            res.send(createError(404));
        }
    },
    getPaginationJobApply_Users_Job_Recuiter_Skill: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search;
            let querysearch = "";
            let totalData = "";
            if (search === undefined) {
                querysearch = `inner join job on job_apply.job_id = job.id inner join skill on job.skill_id = skill.id inner join recuiter on job.recuiter_id = recuiter.id inner join users on job_apply.users_id = users.id  `;
                totalData = parseInt((await jobApplyModel.selectAll()).rowCount);
            } else {
                querysearch = `inner join job on job_apply.job_id = job.id inner join skill on job.skill_id = skill.id inner join recuiter on job.recuiter_id = recuiter.id inner join users on job_apply.users_id = users.id   where job.name ilike '%${search}%' `;
                totalData = parseInt((await jobApplyModel.selectAllSearch(querysearch)).rowCount);
            }
            const sortby = "job_apply." + ( req.query.sortby || "created_on" );
            const sort = req.query.sort || "desc";
            const result = await jobApplyModel.selectPaginationJobApply_Users_Job_Recuiter_Skill({ limit, offset, sortby, sort, querysearch });
            const totalPage = Math.ceil(totalData / limit);
            const pagination = {
                currentPage: page,
                limit: limit,
                totalData: totalData,
                totalPage: totalPage,
            };
            commonHelper.response(res, result.rows, 200, null, pagination);
        } catch (error) {
            res.send(createError(404));
        }
    },
};

module.exports = jobApplyController;
