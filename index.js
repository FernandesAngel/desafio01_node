const express = require("express");
const server = express();

server.use(express.json());

const projects = [];
let count = 0;

function checkProject(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.send("Projeto não encontrado");
  }

  return next();
}

function countMiddleware(req, res, next) {
  count++;
  console.log(count);
  return next();
}

server.post("/projects", countMiddleware, (req, res) => {
  const { id, title } = req.body;
  const data = { id, title, tasks: [] };

  projects.push(data);

  return res.json(data);
});

server.get("/projects", countMiddleware, (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", countMiddleware, checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", countMiddleware, checkProject, (req, res) => {
  const { id } = req.params;
  const project = projects.findIndex(p => p.id !== id);

  projects.splice(project, 1);

  return res.send("Deletado!");
});

server.post(
  "/projects/:id/tasks",
  countMiddleware,
  checkProject,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id === id);

    project.tasks.push(title);

    return res.json(project);
  }
);

server.listen(3000);
