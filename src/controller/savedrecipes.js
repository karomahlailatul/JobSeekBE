const { v4: uuidv4 } = require("uuid");
const savedRecipesModel = require("../models/savedrecipes");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const savedRecipesController = {
    getPaginationSavedRecipes: async (req, res) => {
        // console.log('coba');
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search;
            let querysearch = "";
            let totalData = "";
            if (search === undefined) {
                querysearch = ``;
                totalData = parseInt((await savedRecipesModel.selectAll()).rowCount);
            } else {
                querysearch = ` inner join recipes on savedrecipes.recipes_id = recipes.id inner join users on savedrecipes.users_id = users.id where recipes.name ilike '%${search}%' `;
                totalData = parseInt((await savedRecipesModel.selectAllSearch(querysearch)).rowCount);
            }
            const sortby = req.query.sortby || "created_on";
            const sort = req.query.sort || "asc";
            const result = await savedRecipesModel.selectPagination({ limit, offset, sortby, sort, querysearch });
            // console.log(await savedRecipesModel.selectPagination());
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
    getSavedRecipes: async (req, res) => {
        try {
            const id = req.params.id;

            const checkSavedRecipes = await savedRecipesModel.selectSavedRecipes(id);

            try {
                if (checkSavedRecipes.rowCount == 0) throw "Recipes has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const result = await savedRecipesModel.selectSavedRecipes(id);
            // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
            commonHelper.response(res, result.rows, 200, null);
        } catch (error) {
            res.send(createError(404));
        }
    },
    insertSavedRecipes: async (req, res) => {
        try {
            const id = uuidv4().toLocaleLowerCase();

            const { recipes_id, users_id } = req.body;
            // console.log(req.body.i);

            const checkRecipes = await savedRecipesModel.selectRecipes(recipes_id);
            // console.log(checkRecipes);
            try {
                if (checkRecipes.rowCount == 0) throw "Recipes has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const checkUsers = await savedRecipesModel.selectUsers(users_id);

            try {
                if (checkUsers.rowCount == 0) throw "Users has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            await savedRecipesModel.insertSavedRecipes(id, recipes_id, users_id);
            commonHelper.response(res, null, 201, "New Saved Recipes Created");
            // console.log(id, photo_id, name, description, category_id, users_id);
        } catch (error) {
            res.send(createError(400));
        }
    },
    updateSavedRecipes: async (req, res) => {
        try {
            const id = req.params.id;
            // const { product_id, quantity, discount, payment_id, status_payment, status_transaction, users_id } = req.body;

            const { recipes_id, users_id } = req.body;
            // console.log(req.body.i);

            const checkSavedRecipes = await savedRecipesModel.selectSavedRecipes(id);

            try {
                if (checkSavedRecipes.rowCount == 0) throw "Saved Recipes has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }
            
            const checkRecipes = await savedRecipesModel.selectRecipes(recipes_id);
            // console.log(checkRecipes);
            try {
                if (checkRecipes.rowCount == 0) throw "Recipes has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const checkUsers = await savedRecipesModel.selectUsers(users_id);
            // console.log(checkUsers);
            try {
                if (checkUsers.rowCount == 0) throw "Users has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            await savedRecipesModel.updateSavedRecipes(id, recipes_id, users_id);
            // console.log(await savedRecipesModel.updateSavedRecipes(id, recipes_id, users_id));
            // console.log(id);
            commonHelper.response(res, null, 201, "Saved Recipes Updated");
        } catch (error) {
            res.send(createError(400));
        }
    },
    deleteSavedRecipes: async (req, res) => {
        try {
            const id = req.params.id;

            const checkSavedRecipes = await savedRecipesModel.selectSavedRecipes(id);

            try {
                if (checkSavedRecipes.rowCount == 0) throw "Saved Recipes has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            savedRecipesModel.deleteSavedRecipes(id);
            commonHelper.response(res, null, 200, "Saved Recipes Deleted");
        } catch (error) {
            res.send(createError(404));
        }
    }
};

module.exports = savedRecipesController;
