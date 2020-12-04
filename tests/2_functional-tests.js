const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  // 1
  test("Create an issue with every field", function (done) {
    let test_data = {
      issue_title: "Test Title",
      issue_text: "Test Text",
      created_by: "Haroun",
      assigned_to: "Haroun",
      status_text: "In QA",
    };

    chai
      .request(server)
      .post("/api/issues/test")
      .send(test_data)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(res.body.issue_title, test_data.issue_title);
        assert.equal(res.body.issue_text, test_data.issue_text);
        assert.equal(res.body.created_by, test_data.created_by);
        assert.equal(res.body.assigned_to, test_data.assigned_to);
        assert.equal(res.body.status_text, test_data.status_text);
        done();
      });
  });

  // 2
  test("Create an issue with only required fields", function (done) {
    let test_data = {
      issue_title: "Test Title",
      issue_text: "Test Text",
      created_by: "Haroun",
    };

    chai
      .request(server)
      .post("/api/issues/test")
      .send(test_data)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(res.body.issue_title, test_data.issue_title);
        assert.equal(res.body.issue_text, test_data.issue_text);
        assert.equal(res.body.created_by, test_data.created_by);
        done();
      });
  });

  // 3
  test("Create an issue with missing required fields", function (done) {
    let test_data = {
      created_by: "Haroun",
    };

    chai
      .request(server)
      .post("/api/issues/test")
      .send(test_data)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

  // 4
  test("View issues on a project", function (done) {
    chai
      .request(server)
      .get("/api/issues/test")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // 5
  test("View issues on a project with one filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/test")
      .query({ created_by: "Haroun" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach((issue) => {
          assert.include(issue, { created_by: "Haroun" });
        });
        done();
      });
  });

  // 6
  test("View issues on a project with multiple filters", function (done) {
    chai
      .request(server)
      .get("/api/issues/test")
      .query({ created_by: "Haroun", open: false })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isEmpty(res.body);
        done();
      });
  });
});
