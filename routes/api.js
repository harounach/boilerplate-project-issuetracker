"use strict";

const IssueDAO = require("../dao/dao.js");

function makeUpdateObj(obj) {
  let returnObj = {};
  for (var key in obj) {
    if (obj[key] != "") {
      returnObj[key] = obj[key];
    }
  }

  return returnObj;
}

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      let project = req.params.project;
      let filterObj = {};
      Object.assign(filterObj, req.query);
      filterObj["project"] = project;
      IssueDAO.getIssues(filterObj, (err, data) => {
        if (err) {
          console.error(err);
          res.json({ error: "Something went wrong" });
        } else {
          console.log(data);
          res.json(data);
        }
      });
    })

    .post(function (req, res) {
      // Check if required fields are missing
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.json({ error: "required field(s) missing" });
      }

      let project = req.params.project;
      let issueObj = {};
      issueObj["issue_title"] = req.body.issue_title;
      issueObj["issue_text"] = req.body.issue_text;
      issueObj["created_by"] = req.body.created_by;
      issueObj["assigned_to"] = req.body.assigned_to || "";
      issueObj["status_text"] = req.body.status_text || "";
      issueObj["open"] = true;
      issueObj["created_on"] = new Date().toUTCString();
      issueObj["updated_on"] = new Date().toUTCString();
      issueObj["project"] = project;

      // now insert the issue
      IssueDAO.createIssue(issueObj, (err, data) => {
        if (err) {
          console.error(err);
          res.json({ error: "Something went wrong" });
        } else {
          console.log(data);
          res.json(data);
        }
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
      let updateObj = {};
      if (!req.body._id) {
        res.json({ error: "missing _id" });
      }
      console.log(req.body);
      //Object.assign(updateObj, req.body);
      updateObj = makeUpdateObj(req.body);
      delete updateObj._id;
      if (Object.keys(updateObj).length < 1) {
        res.json({
          error: "no update field(s) sent",
          _id: req.body._id,
        });
      } else {
        updateObj["updated_on"] = new Date().toUTCString();
        IssueDAO.updateIssue(req.body._id, updateObj, (err, data) => {
          if (err) {
            res.json({ error: "could not update", _id: req.body._id });
          } else {
            res.json({ result: "successfully updated", _id: data._id });
          }
        });
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;
      if (!req.body._id) {
        res.json({ error: "missing _id" });
      } else {
        IssueDAO.deleteIssue(req.body._id, (err, data) => {
          if (err) {
            res.json({ error: "could not delete", _id: req.body._id });
          } else {
            res.json({ result: "successfully deleted", _id: data._id });
          }
        });
      }
    });
};
