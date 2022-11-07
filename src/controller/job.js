const { v4: uuidv4 } = require("uuid");
const jobModel = require("../models/job");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
// const client = require('../config/redis')

const jobController = {
  getPaginationJob: async (req, res) => {
    try {
      // function execute query sql
      const executeSQL = async ({ limit, offset, sortby, sort, querySearch }) => {
        // console.log("result query : ", querySearch);
        const result = await jobModel.selectPaginationJob_FullData({ limit, offset, sortby, sort, querySearch });
        const totalData = parseInt((await jobModel.selectAllSearch(querySearch)).rowCount);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = {
          currentPage: page,
          limit: limit,
          totalData: totalData,
          totalPage: totalPage,
        };
        return commonHelper.response(res, result.rows, 200, null, pagination);
      };
      // handle query url
      const search = await req.query.search;
      const page = parseInt(await req.query.page) || 1;
      const limit = parseInt(await req.query.limit) || 12;
      const offset = (page - 1) * limit;
      const sortby = "job." + ((await req.query.sortby) || "created_on");
      const sort = req.query.sort || "desc";
      // initial query search
      let querySearch = "";
      let arrayQuerySearch = [];
      // => handle must search have value
      if (search && search != "{}" && search != "[]" && search != "null" && search != "" && search != "undefined") {
        // => handle query JSON object
        if (typeof search == "object") {
          return commonHelper.response(res, `Invalid type data JSON Object, only support JSON String`, 403, null, null);
        } else {
          try {
            const searchParse = await JSON.parse(search);
            await Promise.allSettled(
              Object.entries(searchParse).map(async (entry) => {
                const [key, value] = entry;
                if (key == null || key == undefined || key == "") {
                  // => handle check Key
                  return commonHelper.response(res, `Key search is required`, 404, null, null);
                }
                if (value == null || value == undefined || value == "") {
                  // => handle check value
                  return commonHelper.response(res, `Value search is required`, 404, null, null);
                }
                // Split and Check table and column
                const TableSplit = key.split(".")[0];
                const ColumnSplit = key.split(".")[1];
                const checkColumnTable = await jobModel.checkTableTypeDatabase(TableSplit, ColumnSplit);
                if (checkColumnTable.rowCount == 0) {
                  return commonHelper.response(res, `Error column search ${key} not found`, 404, null, null);
                }
                // Checking column type
                const DataTypeColumn = checkColumnTable.rows[0].data_type;
                const DataTypeColumnStr = await DataTypeColumn.includes("text");
                const DataTypeColumnInt = await DataTypeColumn.includes("integer");
                const DataTypeColumnDate = await DataTypeColumn.includes("timestamp");

                if (typeof value == "string") {
                  let valueResult = value;
                  // replace data decoded url
                  if (valueResult.includes("&lt;")) {
                    valueResult = value.replace(/&lt;/g, "<");
                  }
                  if (valueResult.includes("&gt;")) {
                    valueResult = value.replace(/&gt;/g, ">");
                  }
                  // Executee Query
                  if (DataTypeColumnStr) {
                    arrayQuerySearch.push(` (  ${key} ilike '\%${valueResult}\%' ) `);
                  }
                  if (DataTypeColumnInt) {
                    arrayQuerySearch.push(` (  ${key} ${valueResult} ) `);
                  }
                  if (DataTypeColumnDate) {
                    arrayQuerySearch.push(` (  ${key}::date ${valueResult} ) `);
                  }
                }
                if (typeof value == "object") {
                  let valueStartMap = "";
                  let valueCenterMap = "";
                  let valueEndMap = "";

                  await Promise.allSettled(
                    value.map(async (valueMap, indexValue) => {
                      let valueMapResult = valueMap;
                      // replace data decoded url
                      if (valueMapResult.includes("&lt;")) {
                        valueMapResult = await valueMap.replace(/&lt;/g, "<");
                      }
                      if (valueMapResult.includes("&gt;")) {
                        valueMapResult = await valueMap.replace(/&gt;/g, ">");
                      }
                      // execute handle value array more than one data
                      if (value.length > 1) {
                        if (indexValue > 0) {
                          // center map
                          if (indexValue != value.length - 1) {
                            // => center map
                            if (DataTypeColumnStr) {
                              valueCenterMap = valueCenterMap.concat(` or ${key} ilike '\%${valueMapResult}\%' `);
                            }
                            if (DataTypeColumnInt) {
                              valueCenterMap = valueCenterMap.concat(` and ${key} ${valueMapResult} `);
                            }
                            if (DataTypeColumnDate) {
                              valueCenterMap = valueCenterMap.concat(` and ${key}::date ${valueMapResult} `);
                            }
                          } else {
                            // => end map
                            if (DataTypeColumnStr) {
                              valueEndMap = valueEndMap.concat(` or ${key} ilike '\%${valueMapResult}\%'   ) `);
                            }
                            if (DataTypeColumnInt) {
                              valueEndMap = valueEndMap.concat(` and ${key} ${valueMapResult}  ) `);
                            }
                            if (DataTypeColumnDate) {
                              valueEndMap = valueEndMap.concat(` and ${key}::date ${valueMapResult}  )  `);
                            }
                          }
                        } else {
                          // => start map
                          if (DataTypeColumnStr) {
                            valueStartMap = valueStartMap.concat(` ( ${key} ilike '\%${valueMapResult}\%'  `);
                          }
                          if (DataTypeColumnInt) {
                            valueStartMap = valueStartMap.concat(` ( ${key} ${valueMapResult}  `);
                          }
                          if (DataTypeColumnDate) {
                            valueStartMap = valueStartMap.concat(`  ( ${key}::date ${valueMapResult}  `);
                          }
                        }
                      } else {
                        // execute handle query
                        if (DataTypeColumnStr) {
                          valueCenterMap = valueCenterMap.concat(` ( ${key} ilike '\%${valueMapResult}\%' ) `);
                        }
                        if (DataTypeColumnInt) {
                          valueCenterMap = valueCenterMap.concat(` (  ${key} ${valueMapResult} )  `);
                        }
                        if (DataTypeColumnDate) {
                          valueCenterMap = valueCenterMap.concat(` (  ${key}::date ${valueMapResult} ) `);
                        }
                      }
                    })
                  );
                  let finalCombineMap = valueStartMap + valueCenterMap + valueEndMap;
                  arrayQuerySearch.push(finalCombineMap);
                }
              })
            );
            querySearch = ` where ${arrayQuerySearch.join(" and ")} `;
            // execute function query sql
            await executeSQL({ limit, offset, sortby, sort, querySearch });
          } catch (e) {
            console.log(e);
            return commonHelper.response(res, `Invalid filled search correctly JSON String with Key and Value`, 403, null, null);
          }
        }
      } else {
        querySearch = "";
        await executeSQL({ limit, offset, sortby, sort, querySearch });
      }
    } catch (error) {
      console.log(error);
      res.send(createError(404));
    }
  },
  getJob: async (req, res) => {
    try {
      const id = req.params.id;
      const checkJob = await jobModel.selectJobFullData(id);
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
  insertJob_SkillJob: async (req, res) => {
    try {
      const role = req.payload.role;
      try {
        if (role != "recruiter" && role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return commonHelper(res, null, 403, error);
      }

      const id = uuidv4().toLocaleLowerCase();
      const job_id = id;
      const count_apply = 0;
      const { name, position, system, type, description, available, recruiter_id, min_salary, max_salary, experience_time, skill_id, promotion_until } = req.body;

      console.log(req.skill_list)

      let promotionMaxDate;
      if (!promotion_until == "" || !promotion_until == null || !promotion_until == undefined) {
        promotionMaxDate = `'${promotion_until}'`;
      }
      if (promotion_until == "" || promotion_until == null || promotion_until == undefined) {
        promotionMaxDate = null;
      }

      try {
        if (skill_id == "" || skill_id == null || skill_id == undefined) throw "Skill has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const checkrecruiter = await jobModel.selectRecruiter(recruiter_id);
      try {
        if (checkrecruiter.rowCount == 0) throw "Recruiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await jobModel.insertJob(id, name, position, system, type, description, available, recruiter_id, min_salary, max_salary, count_apply, experience_time, promotionMaxDate);

      let skillListForward;
      if (typeof skill_id == "string") {
        skillListForward = JSON.parse(skill_id);
      }
      if (typeof skill_id == "object") {
        skillListForward = skill_id;
      }
      skillListForward.map(async (e) => {
        const id_skill_job = uuidv4().toLocaleLowerCase();
        await jobModel.insertSkillJobList(id_skill_job, job_id, e);
      });

      commonHelper.response(res, null, 201, "New Job Created");
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  updateJob_SkillJob: async (req, res) => {
    try {
      const role = req.payload.role;
      try {
        if (role != "recruiter" && role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return commonHelper(res, null, 403, error);
      }

      const id = req.params.id;
      const job_id = id;

      const { name, position, system, type, description, available, recruiter_id, min_salary, max_salary, experience_time, skill_id, promotion_until } = req.body;

      console.log(skill_id)
      
      const checkjob = await jobModel.selectJob(id);

      try {
        if (checkjob.rowCount == 0) throw "Job has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      let promotionMaxDate;
      if (!promotion_until == "" || !promotion_until == null || !promotion_until == undefined) {
        promotionMaxDate = `'${promotion_until}'`;
      }
      if (promotion_until == "" || promotion_until == null || promotion_until == undefined) {
        promotionMaxDate = null;
      }

      try {
        if (skill_id == "" || skill_id == null || skill_id == undefined) throw "Skill has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const checkrecruiter = await jobModel.selectRecruiter(recruiter_id);
      try {
        if (checkrecruiter.rowCount == 0) throw "Recruiter has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await jobModel.updateJob(id, name, position, system, type, description, available, recruiter_id, min_salary, max_salary, experience_time, promotionMaxDate);
      await jobModel.deleteSkillJobList(id);

      let skillListForward;
      if (typeof skill_id == "string") {
        skillListForward = JSON.parse(skill_id);
      }
      if (typeof skill_id == "object") {
        skillListForward = skill_id;
      }
      skillListForward.map(async (e) => {
        const id_skill_job = uuidv4().toLocaleLowerCase();
        await jobModel.insertSkillJobList(id_skill_job, job_id, e);
      });

      commonHelper.response(res, null, 201, "Job Updated");
    } catch (error) {
      console.log(error);
      res.send(createError(400));
    }
  },
  deleteJob: async (req, res) => {
    try {
      const role = req.payload.role;
      try {
        if (role != "recruiter" && role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return commonHelper(res, null, 403, error);
      }

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
      const role = req.payload.role;
      try {
        if (role != "recruiter" && role != "admin" && role != "super-user") throw "You're Cannot Access this feature";
      } catch (error) {
        return commonHelper(res, null, 403, error);
      }

      const id = req.params.id;
      await jobModel.deleteJobSelected(id);
      commonHelper.response(res, null, 200, "Job Deleted Success");
    } catch (error) {
      res.send(createError(404));
    }
  },
};

module.exports = jobController;
