// const { v4: uuidv4 } = require("uuid");
const recuiterModel = require("../models/recuiter");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const { authenticateGoogle, uploadToGoogleDrive } = require("../middlewares/googleDriveService");

const recuiterController = {
  getPaginationRecuiter: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const search = req.query.search;
      let querysearch = "";
      let totalData = "";

      if (search === null || search === undefined) {
        querysearch = ``;
        totalData = parseInt((await recuiterModel.selectAll()).rowCount);
      } else {
        querysearch = `inner join users on recuiter.users_id = users.id where users.name ilike '%${search}%' `;
        totalData = parseInt((await recuiterModel.selectAllSearch(querysearch)).rowCount);
      }

      const sortby = "recuiter." + ( req.query.sortby || "created_on" );
      const sort = req.query.sort || "desc";
      const result = await recuiterModel.selectPagination({
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
  getRecuiter: async (req, res) => {
    try {
      const id = req.params.id;

      const checkRecuiter = await recuiterModel.selectRecuiter(id);
      try {
        if (checkRecuiter.rowCount == 0) throw "Recuiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const result = checkRecuiter;

      // client.setEx(`product/${id}`, 60 * 60, JSON.stringify(result.rows))
      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertRecuiter: async (req, res) => {
    try {
      //  const id = uuidv4().toLocaleLowerCase();
      if (!req.file) {
        return commonHelper.response(res, null, 404, "Logo has not found");
      } else {
        const auth = authenticateGoogle();
        const response = await uploadToGoogleDrive(req.file, auth);
        const logo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

        const { users_id , position, company , email, address, phone, description } = req.body;
        const id = users_id;
        const checkUsers = await recuiterModel.selectUsers(users_id);

        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

      
        await recuiterModel.insertRecuiter(id, users_id , position, company , email, address, phone, logo , description );
        commonHelper.response(res, null, 201, "New recuiter Created");
        
      }
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateRecuiter: async (req, res) => {
    try {
      const id = req.params.id;

      const checkRecuiter = await recuiterModel.selectRecuiter(id);

      try {
        if (checkRecuiter.rowCount == 0) throw "Recuiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      if (req.file) {
        const auth = authenticateGoogle();
        const response = await uploadToGoogleDrive(req.file, auth);
        const logo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

        const { users_id , position, company , email, address, phone, description } = req.body;

        const checkUsers = await recuiterModel.selectUsers(users_id);

        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await recuiterModel.updateRecuiter(id, users_id , position, company , email, address, phone, logo , description);

        commonHelper.response(res, null, 201, "Recuiter Update");
      } else {
        const {users_id , position, company , email, address, phone, description} = req.body;

        const checkUsers = await recuiterModel.selectUsers(users_id);

        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await recuiterModel.updateRecuiterNoLogo(id, users_id , position, company , email, address, phone, description);

        commonHelper.response(res, null, 201, "Recuiter Update");
      }
    } catch (error) {
      res.send(createError(400));
    }
  },
  deleteRecuiter: async (req, res) => {
    try {
      const id = req.params.id;

      const checkrecuiter = await recuiterModel.selectRecuiter(id);
      try {
        if (checkrecuiter.rowCount == 0) throw "Recuiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await recuiterModel.deleteRecuiter(id);
      commonHelper.response(res, null, 200, "Recuiter Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertRecuiterOnRegister: async (req, res) => {
    try {
        // const id = uuidv4().toLocaleLowerCase();
        const { users_id , position, company } = req.body;

        const id = users_id;
       
        const checkUsers = await recuiterModel.selectUsers(users_id);

        try {
          if (checkUsers.rowCount == 0) throw "Users has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await recuiterModel.insertRecuiterOnRegister( id, users_id , position, company );
        commonHelper.response(res, null, 201, "New recuiter Created");
        
    } catch (error) {
      res.send(createError(400));
    }
  },

};

module.exports = recuiterController;
