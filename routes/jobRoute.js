const express = require("express");
const userAuth = require("../middleware/authMiddleware");
const {
  createJob,
  getjob,
  updateJob,
  deleteJob,
  jobFilter,
} = require("../controllers/JobController");
const router = express.Router();

//create job
router.post("/create_job", userAuth, createJob);

//get job
router.get("/get_job_list", userAuth, getjob);

//update job
router.put("/update_job/:id", userAuth, updateJob);

//delete job
router.delete("/update_job/:id", userAuth, deleteJob);

//filter
router.get("/job_filter", userAuth, jobFilter);

module.exports = router;
