const jobModels = require("../models/JobModel");
const mongoose = require("mongoose");
const moment = require("moment");
//create job functionlity
const createJob = async (req, res, next) => {
  const { company, position } = req.body;

  if (!company || !position) {
    next("Please Fill the All fields");
  }
  req.body.createdBy = req.user.UserId;

  //insert data into database
  try {
    const newJob = await jobModels.create(req.body);
    res.status(201).json({ message: "job created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get job list
const getjob = async (req, res, next) => {
  try {
    const { status, workType, search, sort } = req.query;

    let queryObject = {
      createdBy: req.user.UserId,
    };

    //searching data
    if (status && status !== "all") {
      queryObject.status = status;
    }
    //Searching workType
    if (workType && workType !== "all") {
      queryObject.workType = workType;
    }

    //search regular expression based result
    if (search) {
      queryObject.position = { $regex: search, $options: "i" };
    }

    let jobsList = jobModels.find(queryObject);
    //sort data in asc and desc
    // Sort data in ascending and descending order
    let sortOrder = 1; // Default to ascending order

    if (sort === "latest") {
      sortOrder = -1; // Set to descending order for "latest"
    } else if (sort === "oldest") {
      sortOrder = 1; // Set to ascending order for "oldest"
    }
    jobsList = jobsList.sort({ createdAt: sortOrder });

    //pagination
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    jobsList = jobsList.skip(skip).limit(limit);

    const totaljobs = await jobModels.countDocuments(jobsList);
    const numofPages = Math.ceil(totaljobs / limit);
    const job = await jobsList;

    //const jobsList = await jobModels.find({ createdBy: req.user.UserId });
    res.status(200).json({
      totaljobs,
      numofPages,
      success: true,
      data: job,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update job
const updateJob = async (req, res, next) => {
  const id = req.params.id;
  const updatedJob = await jobModels.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({ success: true, data: updatedJob });
};

//delete job
const deleteJob = async (req, res, next) => {
  const id = req.params.id;
  const deleteJob = await jobModels.findByIdAndDelete(id, {
    new: true,
  });
  res.status(200).json({ success: true, data: "Delete Job SuccessFully" });
};

//filter
const jobFilter = async (req, res, next) => {
  const stats = await jobModels.aggregate([
    //search by user jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.UserId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  //monthly yearly stats
  let monthApplicationStats = await jobModels.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.UserId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  monthApplicationStats = monthApplicationStats
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  const defaultStats = {
    reject: stats.reject || 0,
    pending: stats.pending || 0,
    interview: stats.interview || 0,
  };
  res.status(200).json({
    totaljobs: stats.length,
    stats,
    defaultStats,
    monthApplicationStats,
  });
};

module.exports = {
  createJob,
  getjob,
  updateJob,
  deleteJob,
  jobFilter,
};
