const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /* Create an issue with every field: POST request to /api/issues/{project}
   */
  test("Create an issue with every field", function (done) {
    let test_data = {
      issue_title: "Test Title",
      issue_text: "Test Text",
      created_by: "Haroun",
      assigned_to: "Haroun",
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
        done();
      });
  });
});
