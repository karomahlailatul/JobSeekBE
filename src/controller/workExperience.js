const { v4: uuidv4 } = require("uuid");
const workExperienceModel = require("../models/workExperience");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const workExperienceController = {
  getPaginationWorkExperience: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch = "";
      let totalData = "";
      if (search === undefined) {
        querysearch = ``;
        totalData = parseInt((await workExperienceModel.selectAll()).rowCount);
      } else {
        querysearch = `inner join users on work_experience.users_id = users.id where users.name ilike '%${search}%' `;
        totalData = parseInt(
          (await workExperienceModel.selectAllSearch(querysearch)).rowCount
        );
      }
      const sortby = "work_experience." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      const result = await workExperienceModel.selectPagination({
        limit,
        offset,
        sortby,
        sort,
        querysearch,
      });
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
  getWorkExperience: async (req, res) => {
    try {
      const id = req.params.id;

      const checkworkExperience =
        await workExperienceModel.selectWorkExperience(id);

      try {
        if (checkworkExperience.rowCount == 0)
          throw "Work Experience has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const result = checkworkExperience;
      // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertWorkExperience: async (req, res) => {
    try {
      const id = uuidv4().toLocaleLowerCase();

      const { position, company, started, ended, description, users_id } =
        req.body;
      // console.log(req.body.i);

      const checkUsers = await workExperienceModel.selectUsers(users_id);

      try {
        if (checkUsers.rowCount == 0) throw "Users has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await workExperienceModel.insertWorkExperience(
        id,
        position,
        company,
        started,
        ended,
        description,
        users_id
      );
      commonHelper.response(
        res,
        null,
        201,
        "New Work Experience Recipes Created"
      );
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateWorkExperience: async (req, res) => {
    try {
      const id = req.params.id;

      const { position, company, started, ended, description, users_id } =
        req.body;

      const checkWorkExperience =
        await workExperienceModel.selectWorkExperience(id);

      try {
        if (checkWorkExperience.rowCount == 0)
          throw "Work Experience has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const checkUsers = await workExperienceModel.selectUsers(users_id);
      try {
        if (checkUsers.rowCount == 0) throw "Users has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await workExperienceModel.updateWorkExperience(
        id,
        position,
        company,
        started,
        ended,
        description,
        users_id
      );
      commonHelper.response(res, null, 201, "Work Experience Updated");
    } catch (error) {
      res.send(createError(400));
    }
  },
  deleteWorkExperience: async (req, res) => {
    try {
      const id = req.params.id;

      const checkworkExperience =
        await workExperienceModel.selectWorkExperience(id);

      try {
        if (checkworkExperience.rowCount == 0)
          throw "Work Experience has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      workExperienceModel.deleteWorkExperience(id);
      commonHelper.response(res, null, 200, "Work Experience Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  },
};

module.exports = workExperienceController;
