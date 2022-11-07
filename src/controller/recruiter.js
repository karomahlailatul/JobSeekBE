// const { v4: uuidv4 } = require("uuid");
const recruiterModel = require("../models/recruiter");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const { authenticateGoogle, uploadToGoogleDrive, deleteFromGoogleDrive } = require("../middlewares/googleDriveService");

const recruiterController = {
  getPaginationRecruiter: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const search = req.query.search;
      let querysearch = "";

      if (search === null || search === undefined) {
        querysearch = ``;
      } else {
        querysearch = `inner join users on recruiter.users_id = users.id where users.name ilike '%${search}%' `;
      }
      const totalData = parseInt((await recruiterModel.selectAllSearch(querysearch)).rowCount);

      const sortby = "recruiter." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      const result = await recruiterModel.selectPagination({
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
  getRecruiter: async (req, res) => {
    try {
      const id = req.params.id;

      const checkrecruiter = await recruiterModel.selectRecruiter(id);
      try {
        if (checkrecruiter.rowCount == 0) throw "Recruiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const result = checkrecruiter;

      // client.setEx(`product/${id}`, 60 * 60, JSON.stringify(result.rows))
      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertRecruiter: async (req, res) => {
    try {
      //  const id = uuidv4().toLocaleLowerCase();
      if (!req.file) {
        return commonHelper.response(res, null, 404, "Logo has not found");
      } else {
        const auth = authenticateGoogle();
        const response = await uploadToGoogleDrive(req.file, auth);
        const logo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

        const { users_id, position, company, email, address, phone, description } = req.body;
        const id = users_id;
        const checkUsers = await recruiterModel.selectUsers(users_id);

        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await recruiterModel.insertRecruiter(id, users_id, position, company, email, address, phone, logo, description);
        commonHelper.response(res, null, 201, "New Recruiter Created");
      }
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateRecruiter: async (req, res) => {
    try {
      const id = req.params.id;

      // const checkrecruiter = await recruiterModel.selectRecruiter(id);

      const {
        rowCount,
        rows: [checkRecruiter],
      } = await recruiterModel.selectRecruiter(id);

      // console.log(checkRecruiter.logo)
      try {
        if (rowCount == 0) throw "recruiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      if (req.file) {
        const auth = authenticateGoogle();

        if (checkRecruiter.picture != null || checkRecruiter.picture != undefined) {
          await deleteFromGoogleDrive(checkRecruiter.picture, auth);
        }

        // Upload to Drive
        const response = await uploadToGoogleDrive(req.file, auth);
        const logo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

        const { users_id, position, company, email, address, phone, description } = req.body;

        const checkUsers = await recruiterModel.selectUsers(users_id);

        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await recruiterModel.updateRecruiter(id, users_id, position, company, email, address, phone, logo, description);

        commonHelper.response(res, null, 201, "Recruiter Update");
      } else {
        const { users_id, position, company, email, address, phone, description } = req.body;

        const checkUsers = await recruiterModel.selectUsers(users_id);

        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await recruiterModel.updateRecruiterNoLogo(id, users_id, position, company, email, address, phone, description);

        commonHelper.response(res, null, 201, "Recruiter Update");
      }
    } catch (error) {
      res.send(createError(400));
    }
  },
  deleteRecruiter: async (req, res) => {
    try {
      const id = req.params.id;

      const checkrecruiter = await recruiterModel.selectRecruiter(id);
      try {
        if (checkrecruiter.rowCount == 0) throw "Recruiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await recruiterModel.deleteRecruiter(id);
      commonHelper.response(res, null, 200, "Recruiter Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertRecruiterOnRegister: async (req, res) => {
    try {
      // const id = uuidv4().toLocaleLowerCase();
      const { users_id, position, company } = req.body;

      const id = users_id;

      const checkUsers = await recruiterModel.selectUsers(users_id);

      try {
        if (checkUsers.rowCount == 0) throw "Users has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await recruiterModel.insertRecruiterOnRegister(id, users_id, position, company);
      commonHelper.response(res, null, 201, "New Recruiter Created");
    } catch (error) {
      res.send(createError(400));
    }
  },
};

module.exports = recruiterController;
