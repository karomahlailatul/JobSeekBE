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
        querysearch = ` inner join recruiter on job.recruiter_id = recruiter.id where job.name ilike '%${search}%' `;
        totalData = parseInt((await jobModel.selectAllSearch(querysearch)).rowCount);
      }
      const sortby = "job." + (req.query.sortby || "created_on");
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
      // const id = uuidv4().toLocaleLowerCase();

      const { id, name, position, system, type, description, available, recruiter_id } = req.body;

      const checkrecruiter = await jobModel.selectRecruiter(recruiter_id);

      try {
        if (checkrecruiter.rowCount == 0) throw "Recruiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await jobModel.insertJob(id, name, position, system, type, description, available, recruiter_id);
      commonHelper.response(res, null, 201, "New Job Created");
    } catch (error) {
      res.send(createError(400));
    }
  },
  insertJob_SkillJob: async (req, res) => {
    try {
      const id = uuidv4().toLocaleLowerCase();
      const job_id = id;

      const { name, position, system, type, description, available, recruiter_id, skill_list } = req.body;

      try {
        if (skill_list == "" || skill_list == null || skill_list == undefined) throw "Skill has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }


      const checkrecruiter = await jobModel.selectRecruiter(recruiter_id);

      try {
        if (checkrecruiter.rowCount == 0) throw "Recruiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await jobModel.insertJob(id, name, position, system, type, description, available, recruiter_id);

      await skill_list.map((item) => jobModel.insertSkillJobList((uuidv4()), job_id, item));

      commonHelper.response(res, null, 201, "New Job Created");
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateJob: async (req, res) => {
    try {
      const id = req.params.id;

      const { name, position, system, type, skill_id, description, available, recruiter_id } = req.body;

      const checkjob = await jobModel.selectJob(id);

      try {
        if (checkjob.rowCount == 0) throw "Job has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const checkSkill = await jobModel.selectSkill(skill_id);

      try {
        if (checkSkill.rowCount == 0) throw "Skill has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const checkrecruiter = await jobModel.selectRecruiter(recruiter_id);
      try {
        if (checkrecruiter.rowCount == 0) throw "Recruiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await jobModel.updateJob(id, name, position, system, type, skill_id, description, available, recruiter_id);
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
      commonHelper.response(res, null, 200, "Job Deleted Success");
    } catch (error) {
      res.send(createError(404));
    }
  },
  deleteJobSelected: async (req, res) => {
    try {
      const id = req.params.id;
      await jobModel.deleteJobSelected(id);
      commonHelper.response(res, null, 200, "Job Deleted Success");
    } catch (error) {
      res.send(createError(404));
    }
  },
  getPaginationJob_Recruiter_Skill: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 16;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch = "";
      if (search === undefined) {
        querysearch = `  inner join recruiter on job.recruiter_id = recruiter.id `;
      } else {
        querysearch = `  inner join recruiter on job.recruiter_id = recruiter.id  where job.name ilike '%${search}%' `;
      }
      const totalData = parseInt((await jobModel.selectAllSearch(querysearch)).rowCount);
      const sortby = "job." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      const result = await jobModel.selectPaginationJob_Recruiter_Skill({ limit, offset, sortby, sort, querysearch });
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
  getPaginationJob_Recruiter_Skill_ID: async (req, res) => {
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
  getPaginationJob_Recruiter_Skill_From_Recruiter: async (req, res) => {
    try {
      const id = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 16;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch = "";

      if (search === undefined) {
        querysearch = `  inner join recruiter on job.recruiter_id = recruiter.id where recruiter_id = '${id}' `;
      } else {
        querysearch = `  inner join recruiter on job.recruiter_id = recruiter.id  where job.name ilike '%${search}%' and recruiter_id = '${id}' `;
      }
      const totalData = parseInt((await jobModel.selectAllSearch(querysearch)).rowCount);
      const sortby = "job." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      const result = await jobModel.selectPaginationJob_Recruiter_Skill({ limit, offset, sortby, sort, querysearch });
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

module.exports = jobController;
