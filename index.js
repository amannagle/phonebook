const express = require("express");
require("dotenv").config();
const Person = require("./models/phonebook");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));
const morgan = require("morgan");
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body ? req.body : "");
});
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next();
};
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/persons", (request, response, next) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});
app.delete("/persons/:id", (request, response, next) => {
  const id = request.params.id;
  console.log("id is", id);
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});
app.get("/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id).then(result=>{
    if(result)
      {
        response.json(result)
      }
      else
      response.status(400).end();
  })
  .catch(error=>{
    next(error);
  })
});

app.put('/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
app.get("/info", (request, response, next) => {
  response.send(
    `<p>phonebook has ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.post("/persons", (request, response, next) => {
  const body = request.body;
  console.log(body);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "One or more property missing",
    });
  }

  const person = new Person({ name: body.name, number: body.number });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("server running....");
});
