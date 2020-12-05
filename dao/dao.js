require("dotenv").config();
let mongodb = require("mongodb");
let mongoose = require("mongoose");
let Issue;

/** Connect to MongoDB */
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/** Define Database Schema */
let issueSchema = new mongoose.Schema(
  // Schema definition
  {
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: String,
    status_text: String,
    open: Boolean,
    created_on: String,
    updated_on: String,
    project: String,
  },
  // options
  {
    collection: "issue_tracker",
  }
);

/** Create Model */
Issue = mongoose.model("Issue", issueSchema);

module.exports = {
  // Add new issue
  createIssue: function (issueObjs, done) {
    let newIssue = new Issue(issueObjs);
    newIssue.save((err, data) => {
      if (err) {
        /* FAILURE */
        console.error(err);
        done(err);
      } else {
        /* SUCCESS */
        done(null, data);
      }
    });
  },

  // Update an issue
  updateIssue: function (issueId, updateObj, done) {
    Issue.findOneAndUpdate(
      /* filter */
      { _id: issueId },
      /* update object */
      updateObj,
      /* options */
      { new: true },
      /* callback */
      (err, data) => {
        if (err) {
          /* FAILURE */
          console.error(err);
          done(err);
        } else {
          /* SUCCESS */
          done(null, data);
        }
      }
    );
  },

  // Delete an issue
  deleteIssue: function (issueId, done) {
    Issue.findByIdAndRemove(issueId, (err, data) => {
      if (err) {
        /* FAILURE */
        console.error(err);
        done(err);
      } else {
        /* SUCCESS */
        done(null, data);
      }
    });
  },

  // Get all issues
  getIssues: function (filterObj, done) {
    Issue.find(filterObj, (err, data) => {
      if (err) {
        /* FAILURE */
        console.error(err);
        done(err);
      } else {
        /* SUCCESS */
        done(null, data);
      }
    });
  },
};
