const { v4: uuidv4 } = require("uuid");
const portfolioModel = require("../models/portfolio");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const { authenticateGoogle, uploadToGoogleDrive, deleteFromGoogleDrive } = require("../middlewares/googleDriveService");

const portfolioController = {
  getPaginationPortfolio: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const search = req.query.search;
      let querysearch = "";

      if (search === null || search === undefined) {
        querysearch = ``;
      } else {
        querysearch = `inner join users on portfolio.users_id = users.id where users.name ilike '%${search}%' `;
      }
      const totalData = parseInt((await portfolioModel.selectAllSearch(querysearch)).rowCount);

      const sortby = "portfolio." + (req.query.sortby || "created_on");
      const sort = req.query.sort || "desc";
      const result = await portfolioModel.selectPagination({
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
  getPortfolio: async (req, res) => {
    try {
      const id = req.params.id;

      const checkportfolio = await portfolioModel.selectPortfolio(id);
      try {
        if (checkportfolio.rowCount == 0) throw "Portfolio has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const result = checkportfolio;

      // client.setEx(`product/${id}`, 60 * 60, JSON.stringify(result.rows))
      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertPortfolio: async (req, res) => {
    try {
      const id = uuidv4().toLocaleLowerCase();

      if (!req.file) {
        return commonHelper.response(res, null, 404, "Photo has not found");
      } else {
        const auth = authenticateGoogle();
        const response = await uploadToGoogleDrive(req.file, auth);
        const photo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

        const { name, link, type, description, users_id } = req.body;

        const checkUsers = await portfolioModel.selectUsers(users_id);

        // console.log(checkUsers)
        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await portfolioModel.insertPortfolio(id, name, link, type, photo, description, users_id);
        commonHelper.response(res, null, 201, "New Portfolio Created");
        // console.log(id, photo_id, name, description, category_id, users_id);
      }
    } catch (error) {
      res.send(createError(400));
    }
  },
  updatePortfolio: async (req, res) => {
    try {
      const id = req.params.id;

      const checkPortofolio = await portfolioModel.selectPortfolio(id);

      try {
        if (checkPortofolio.rowCount == 0) throw "Portfolio has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      // console.log(req.file);
      if (req.file) {
        const auth = authenticateGoogle();

        if (checkPortofolio.photo != null || checkPortofolio.photo != undefined) {
          await deleteFromGoogleDrive(checkPortofolio.photo, auth);
        }

        const response = await uploadToGoogleDrive(req.file, auth);
        const photo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

        const { name, link, type, description, users_id } = req.body;

        const checkUsers = await portfolioModel.selectUsers(users_id);

        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await portfolioModel.updatePortfolio(id, name, link, type, photo, description, users_id);

        commonHelper.response(res, null, 201, "Portfolio Update");
      } else {
        const { name, link, type, description, users_id } = req.body;

        const checkUsers = await portfolioModel.selectUsers(users_id);

        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await portfolioModel.updatePortfolioNoPhoto(id, name, link, type, description, users_id);

        commonHelper.response(res, null, 201, "Portfolio Update");
      }
    } catch (error) {
      res.send(createError(400));
    }
  },
  deletePortfolio: async (req, res) => {
    try {
      const id = req.params.id;

      const checkportfolio = await portfolioModel.selectPortfolio(id);
      try {
        if (checkportfolio.rowCount == 0) throw "Portfolio has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await portfolioModel.deletePortfolio(id);
      commonHelper.response(res, null, 200, "Portfolio Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  },
};

module.exports = portfolioController;
