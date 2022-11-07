const skillModel = require("../models/skill");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const skillController = {
  getPaginationSkill: async (req, res) => {
    // console.log('coba');
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 1000;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch = "";
      if (search === undefined) {
        querysearch = ``;
      } else {
        querysearch = `where skill.name ilike '%${search}%' `;
      }
      const totalData = parseInt((await skillModel.selectAllSearch(querysearch)).rowCount);

      const sortby = req.query.sortby || "created_on";
      const sort = req.query.sort || "desc";
      const result = await skillModel.selectPagination({ limit, offset, sortby, sort, querysearch });
      // console.log(await skillModel.selectPagination());
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
  getSkill: async (req, res) => {
    try {
      const id = req.params.id;

      const checkskill = await skillModel.selectSkill(id);

      try {
        if (checkskill.rowCount == 0) throw "Skill has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const result = checkskill;
      // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertSkill: async (req, res) => {
    try {
      const role = req.payload.role;
      try {
        if (role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return commonHelper(res, null, 403, error);
      }
      // const id = uuidv4().toLocaleLowerCase();

      const {
        rows: [count],
      } = await skillModel.countData();
      const id = `skill-${Number(count.count) + 1}`;

      const { name } = req.body;
      // console.log(req.body.i);

      await skillModel.insertSkill(id, name);

      commonHelper.response(res, null, 201, "New Skill Created");
      // console.log(id, photo_id, name, description, category_id, users_id);
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateSkill: async (req, res) => {
    try {
      const role = req.payload.role;
      try {
        if (role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return commonHelper(res, null, 403, error);
      }
      const id = req.params.id;
      // const { product_id, quantity, discount, payment_id, status_payment, status_transaction, users_id } = req.body;

      const { name } = req.body;
      // console.log(req.body.i);

      const checkSkill = await skillModel.selectSkill(id);

      try {
        if (checkSkill.rowCount == 0) throw "Skill has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await skillModel.updateSkill(id, name);
      // console.log(await skillModel.updateskill(id, recipes_id, users_id));
      // console.log(id);
      commonHelper.response(res, null, 201, "Skill Updated");
    } catch (error) {
      res.send(createError(400));
    }
  },
  deleteSkill: async (req, res) => {
    try {
      const role = req.payload.role;
      try {
        if (role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return commonHelper(res, null, 403, error);
      }
      const id = req.params.id;

      const checkSkill = await skillModel.selectSkill(id);

      try {
        if (checkSkill.rowCount == 0) throw "Skill has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      skillModel.deleteSkill(id);
      commonHelper.response(res, null, 200, "Skill Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  },
};

module.exports = skillController;
