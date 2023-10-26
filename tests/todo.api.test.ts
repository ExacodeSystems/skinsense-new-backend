import chaiHttp from "chai-http";
import pool from "../src/config/db.js";
import app from "../src/index.js"
import { afterEach, beforeAll, describe, it } from "vitest";
import { expect } from "chai";
import chai from "chai";

chai.use(chaiHttp);

describe("Todo API Tests", () => {
  let testTodoIds : string[] = []; // Store test todo IDs

  beforeAll(async () => {
    // Insert a test todo into the 'todos' table before each test
    const res = await chai.request(app).post("/todos").send({
      title: "Test Todo",
      description: "This is a test todo",
    });
    testTodoIds.push(res.body.id);
  });

  afterEach(async () => {
    // Delete the test todos from the 'todos' table after each test
    for (const id of testTodoIds) {
      await pool.query("DELETE FROM todos WHERE id = ?", [id]);
    }
    testTodoIds = []; // Reset the testTodoIds array
  });

  it("should create a new todo", async () => {
    const createdTodo = await chai.request(app).post("/todos").send({
      title: "New Todo",
      description: "This is a new test todo",
    });

    expect(createdTodo).to.have.status(200);
    expect(createdTodo.body).to.be.an("object");
    expect(createdTodo.body).to.have.property("id");
    expect(createdTodo.body.title).to.equal("New Todo");
    expect(createdTodo.body.description).to.equal("This is a new test todo");
  });

  it("should get all todos", async () => {
    const res = await chai.request(app).get("/todos");

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
    expect(res.body).to.have.lengthOf.at.least(1);
  });

  it("should get a todo by id", async () => {
    const res = await chai.request(app).get(`/todos/${testTodoIds[0]}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
    expect(res.body.id).to.equal(testTodoIds[0]);
    expect(res.body.title).to.equal("Test Todo");
    expect(res.body.description).to.equal("This is a test todo");
  });

  it("should update a todo", async () => {
    const res = await chai.request(app).put(`/todos/${testTodoIds[0]}`).send({
      title: "Updated Todo",
      description: "This is an updated test todo",
    });

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
    expect(Number(res.body.id)).to.equal(testTodoIds[0]);
    expect(res.body.title).to.equal("Updated Todo");
    expect(res.body.description).to.equal("This is an updated test todo");
  });

  it("should delete a todo", async () => {
    const res = await chai.request(app).delete(`/todos/${testTodoIds[0]}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.equal("Todo deleted successfully.");

    // Ensure the todo is deleted from the database
    const [todosAfterDeletion] = await pool.query(
      "SELECT * FROM todos WHERE id = ?",
      [testTodoIds[0]],
    );
    expect(todosAfterDeletion).to.have.lengthOf(0);
  });
});
