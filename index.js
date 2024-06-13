const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
const morgan = require('morgan');
morgan.token('body', function (req, res) { return JSON.stringify(req.body?req.body:"") })
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
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

app.get("/persons",(request,response)=>{
    response.json(persons);
});
app.delete("/persons/:id",(request,response)=>{
  const id = Number(request.params.id);
  persons = persons.filter(person=>person.id !==id);
  response.status(204).end();
})
app.get("/persons/:id",(request,response)=>{
  const id = Number(request.params.id);
  const person = persons.find(person=>person.id ===id);
  console.log(person);
  if(person)
    {
  response.json(person);
    }
    else
    response.status(400).send(`person not found`);
})
app.get("/info",(request,response)=>{
  response.send(`<p>phonebook has ${persons.length} people</p><p>${new Date()}</p>`)
})

app.post("/persons",(request,response)=>{
  const body = request.body;
  console.log(body);
  if(!body.name || !body.number)
    {
      return response.status(400).json({
        "error":"One or more property missing"
      })
    }
    let id = Math.ceil(Math.random()*10000000000000);
    const name = body.name;
    if(persons.find(person=>person.name.toLowerCase()===name.toLowerCase()))
      {
        return response.status(400).json({"error":"name must be unique"});
      }
    const person = {id:id,name:body.name,number:body.number};
    console.log(person);
    persons =persons.concat(person);
    response.status(201).json(person);
    console.log(persons);
})
app.listen(3001,()=>{
    console.log("server running....")
})