const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepoId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) return response.status(400).json({ error: 'ID not valid' });

  return next();
}

app.use('/repositories/:id', validateRepoId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const project = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  let projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found '});
  }

  const project = { id, title, url, techs, likes: repositories[projectIndex].likes };
 
  repositories[projectIndex] = project;

  return response.json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  let projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found '});
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).json({ message: 'Project deleted' });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  let projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found '});
  }

  repositories[projectIndex].likes += 1;

  return response.json(repositories[projectIndex]);
});

module.exports = app;
