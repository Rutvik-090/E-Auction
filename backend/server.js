import express from "express";

const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  console.log("Test API called...");
  res.send("API working.");
});

const user = {
  id: 111023,
  name: "Rutvik",
  age: 22,
  salary: 0,
};

app.get("/user", (req, res) => {
  res.json({ message: "User fetched successfully...", data: user });
});

const users = [
  { id: 1, name: "raj", age: 23 },
  { id: 2, name: "parth", age: 24 },
  { id: 3, name: "jay", age: 25 },
];

app.get("/users", (req, res) => {
  res.json({
    message: "all users",
    data: users,
  });
});

app.get("/users/:id", (req, res) => {
  console.log(req.params);
  console.log(req.params.id);

  res.json({
    message: "Data fetched successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
