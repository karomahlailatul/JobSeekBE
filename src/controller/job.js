const { v4: uuidv4 } = require("uuid");
const jobModel = require("../models/job");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const jobController = {
    getPaginationJob: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search;
            let querysearch = "";
            let totalData = "";
            if (search === undefined) {
                querysearch = ``;
                totalData = parseInt((await jobModel.selectAll()).rowCount);
            } else {
                querysearch = ` inner join skill on job.skill_id = skill.id inner join recuiter on job.recuiter_id = recuiter.id where job.name ilike '%${search}%' `;
                totalData = parseInt((await jobModel.selectAllSearch(querysearch)).rowCount);
            }
            const sortby = "job." + ( req.query.sortby || "created_on" );
            const sort = req.query.sort || "desc";
            const result = await jobModel.selectPagination({ limit, offset, sortby, sort, querysearch });
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
    getJob: async (req, res) => {
        try {
            const id = req.params.id;

            const checkJob = await jobModel.selectJob(id);

            try {
                if (checkJob.rowCount == 0) throw "Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const result = checkJob;
            // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
            commonHelper.response(res, result.rows, 200, null);
        } catch (error) {
            res.send(createError(404));
        }
    },
    insertJob: async (req, res) => {
        try {
            const id = uuidv4().toLocaleLowerCase();

            const { name , position , domicile , type , skill_id, description , available , recuiter_id } = req.body;
            
            const checkRecipes = await jobModel.selectSkill(skill_id); 

            try {
                if (checkRecipes.rowCount == 0) throw "Skill has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const checkRecuiter = await jobModel.selectRecuiter(recuiter_id);

            try {
                if (checkRecuiter.rowCount == 0) throw "Recuiter has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            await jobModel.insertJob( id, name , position , domicile , type , skill_id, description , available , recuiter_id);
            commonHelper.response(res, null, 201, "New Job Created");
            
        } catch (error) {
            res.send(createError(400));
        }
    },
    updateJob: async (req, res) => {
        try {
            const id = req.params.id;

            const { name , position , domicile , type , skill_id, description , available , recuiter_id } = req.body;

            const checkjob = await jobModel.selectJob(id);

            try {
                if (checkjob.rowCount == 0) throw "Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }
            
            const checkRecipes = await jobModel.selectSkill(skill_id);

            try {
                if (checkRecipes.rowCount == 0) throw "Recipes has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const checkRecuiter = await jobModel.selectRecuiter(recuiter_id);
            try {
                if (checkRecuiter.rowCount == 0) throw "Users has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

        
            await jobModel.updateJob(id, name , position , domicile , type , skill_id, description , available , recuiter_id);
            commonHelper.response(res, null, 201, "Job Updated");
        } catch (error) {
            res.send(createError(400));
        }
    },
    deleteJob: async (req, res) => {
        try {
            const id = req.params.id;

            const checkjob = await jobModel.selectJob(id);

            try {
                if (checkjob.rowCount == 0) throw "Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            jobModel.deleteJob(id);
            commonHelper.response(res, null, 200, "Job Deleted");
        } catch (error) {
            res.send(createError(404));
        }
    },
    getPaginationJob_Recuiter_Skill: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 16;
            const offset = (page - 1) * limit;
            const search = req.query.search;
            let querysearch = "";
            let totalData = "";
            if (search === undefined) {
                querysearch = ` inner join skill on job.skill_id = skill.id  inner join recuiter on job.recuiter_id = recuiter.id `;
                totalData = parseInt((await jobModel.selectAll()).rowCount);
            } else {
                querysearch = ` inner join skill on job.skill_id = skill.id  inner join recuiter on job.recuiter_id = recuiter.id  where job.name ilike '%${search}%' `;
                totalData = parseInt((await jobModel.selectAllSearch(querysearch)).rowCount);
            }
            const sortby = "job." + ( req.query.sortby || "created_on" );
            const sort = req.query.sort || "desc";
            const result = await jobModel.selectPaginationJob_Recuiter_Skill({ limit, offset, sortby, sort, querysearch });
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
    getPaginationJob_Recuiter_Skill_ID: async (req, res) => {
      
          try {
            const id = req.params.id;

            const checkJob = await jobModel.selectJobFullData(id);

            try {
                if (checkJob.rowCount == 0) throw "Job has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const result = checkJob;
            // console.log(result)
            // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
            commonHelper.response(res, result.rows, 200, null);
        } catch (error) {
            res.send(createError(404));
        }
    
    },
};

module.exports = jobController;
