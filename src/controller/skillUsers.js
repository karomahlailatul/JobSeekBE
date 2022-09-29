const { v4: uuidv4 } = require("uuid");
const skillUsersModel = require("../models/skillUsers");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const skillUsersController = {
    getPaginationSkillUsers: async (req, res) => {
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
                totalData = parseInt((await skillUsersModel.selectAll()).rowCount);
            } else {
                querysearch = ` inner join skill on skill_users.skill_id = skill.id inner join users on skill_users.users_id = users.id where users.name ilike '%${search}%' `;
                totalData = parseInt((await skillUsersModel.selectAllSearch(querysearch)).rowCount);
            }
            const sortby = "skill_users." + ( req.query.sortby || "created_on" );
            const sort = req.query.sort || "desc";
            const result = await skillUsersModel.selectPagination({ limit, offset, sortby, sort, querysearch });
            // console.log(await skillUsersModel.selectPagination());
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
    getSkillUsers: async (req, res) => {
        try {
            const id = req.params.id;

            const checkSkillUsers = await skillUsersModel.selectSkillUsers(id);

            try {
                if (checkSkillUsers.rowCount == 0) throw "Skill Users has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const result = checkSkillUsers;
            // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
            commonHelper.response(res, result.rows, 200, null);
        } catch (error) {
            res.send(createError(404));
        }
    },
    insertSkillUsers: async (req, res) => {
        try {
            const id = uuidv4().toLocaleLowerCase();

            const { skill_id, users_id } = req.body;
            // console.log(req.body.i);

            const checkRecipes = await skillUsersModel.selectSkill(skill_id);
            // console.log(checkRecipes);
            try {
                if (checkRecipes.rowCount == 0) throw "Skill has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const checkUsers = await skillUsersModel.selectUsers(users_id);

            try {
                if (checkUsers.rowCount == 0) throw "Users has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            await skillUsersModel.insertSkillUsers(id, skill_id, users_id);
            commonHelper.response(res, null, 201, "New Skill Users Created");
            // console.log(id, photo_id, name, description, category_id, users_id);
        } catch (error) {
            res.send(createError(400));
        }
    },
    updateSkillUsers: async (req, res) => {
        try {
            const id = req.params.id;

            const { skill_id, users_id } = req.body;

            const checkskillUsers = await skillUsersModel.selectSkillUsers(id);

            try {
                if (checkskillUsers.rowCount == 0) throw "Skill Users has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }
            
            const checkRecipes = await skillUsersModel.selectSkill(skill_id);

            try {
                if (checkRecipes.rowCount == 0) throw "Recipes has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            const checkUsers = await skillUsersModel.selectUsers(users_id);
            try {
                if (checkUsers.rowCount == 0) throw "Users has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            await skillUsersModel.updateSkillUsers(id, skill_id, users_id);
            commonHelper.response(res, null, 201, "Skill Users Updated");
        } catch (error) {
            res.send(createError(400));
        }
    },
    deleteSkillUsers: async (req, res) => {
        try {
            const id = req.params.id;

            const checkskillUsers = await skillUsersModel.selectSkillUsers(id);

            try {
                if (checkskillUsers.rowCount == 0) throw "Skill Users has not found";
            } catch (error) {
                return commonHelper.response(res, null, 404, error);
            }

            skillUsersModel.deleteSkillUsers(id);
            commonHelper.response(res, null, 200, "Skill Users Deleted");
        } catch (error) {
            res.send(createError(404));
        }
    }
};

module.exports = skillUsersController;
