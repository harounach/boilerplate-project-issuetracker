"use strict";

const IssueDAO = require("../dao/dao.js");

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(function (req, res) {
      // Check if required fields are missing
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.json("Required fields missing from request");
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
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
