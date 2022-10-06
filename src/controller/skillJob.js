const { v4: uuidv4 } = require("uuid");
const skillJobModel = require("../models/skillJob");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const skillJobController = {
    getPaginationskillJob: async (req, res) => {
        try {
            // console.log("test");
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search;
            let querysearch = "";
            let totalData = "";
            if (search === undefined) {
                querysearch = ` inner join job on skill_job.job_id = job.id inner join skill on skill_job.skill_id = skill.id`;
                totalData = parseInt((await skillJobModel.selectAllSearch(querysearch)).rowCount);
            } else {
                querysearch = ` inner join job on skill_job.job_id = job.id inner join skill on skill_job.skill_id = skill.id where job.name ilike '%${search}%' `;
                totalData = parseInt((await skillJobModel.selectAllSearch(querysearch)).rowCount);
            }
            const sortby = "skill_job." + ( req.query.sortby || "created_on" );
            const sort = req.query.sort || "desc";
            const result = await skillJobModel.selectPagination({ limit, offset, sortby, sort, querysearch });
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
    getSkillJob: async (req, res) => {
        try {
            const id = req.params.id;

            const checkskillJob = await skillJobModel.selectSkillJob(id);

            try {
                if (checkskillJob.rowCount == 0) throw "Skill Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const result = checkskillJob;
            // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
            commonHelper.response(res, result.rows, 200, null);
        } catch (error) {
            res.send(createError(404));
        }
    },
    insertSkillJob: async (req, res) => {
        try {
            const id = uuidv4().toLocaleLowerCase();

            const { job_id , skill_id } = req.body;
            
            const checkJob = await skillJobModel.selectJob(job_id); 

            try {
                if (checkJob.rowCount == 0) throw "Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const checkSkill = await skillJobModel.selectSkill(skill_id);

            try {
                if (checkSkill.rowCount == 0) throw "Skill has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            await skillJobModel.insertSkillJob( id, job_id , skill_id );
            commonHelper.response(res, null, 201, "New Skill Job Created");
            
        } catch (error) {
            res.send(createError(400));
        }
    },
    updateSkillJob: async (req, res) => {
        try {
            const id = req.params.id;

            const { job_id , skill_id } = req.body;

            const checkskillJob = await skillJobModel.selectSkillJob(id);

            try {
                if (checkskillJob.rowCount == 0) throw "Skill Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }
            
            const checkJob = await skillJobModel.selectJob(job_id); 

            try {
                if (checkJob.rowCount == 0) throw "Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const checkSkill = await skillJobModel.selectSkill(skill_id);

            try {
                if (checkSkill.rowCount == 0) throw "Skill has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

        
            await skillJobModel.updateSkillJob( id, job_id , skill_id  );
            commonHelper.response(res, null, 201, "Job Apply Updated");
        } catch (error) {
            res.send(createError(400));
        }
    },
    deleteSkillJob: async (req, res) => {
        try {
            const id = req.params.id;

            const checkskillJob = await skillJobModel.selectSkillJob(id);

            try {
                if (checkskillJob.rowCount == 0) throw "Skill Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            skillJobModel.deleteSkillJob(id);
            commonHelper.response(res, null, 200, "Skill Job Deleted");
        } catch (error) {
            res.send(createError(404));
        }
    },
    getPaginationSkillJob_Job_Skill: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search;
            let querysearch = "";
            let totalData = "";
            if (search === undefined) {
                querysearch = `inner join job on skill_job.job_id = job.id inner join skill on skill_job.skill_id = skill.id   `;
                totalData = parseInt((await skillJobModel.selectAll()).rowCount);
            } else {
                querysearch = `inner join job on skill_job.job_id = job.id inner join skill on skill_job.skill_id = skill.id where job.name ilike '%${search}%' `;
                totalData = parseInt((await skillJobModel.selectAllSearch(querysearch)).rowCount);
            }
            const sortby = "skill_job." + ( req.query.sortby || "created_on" );
            const sort = req.query.sort || "desc";
            const result = await skillJobModel.selectPaginationSkillJob_Job_Skill({ limit, offset, sortby, sort, querysearch });
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

module.exports = skillJobController;
