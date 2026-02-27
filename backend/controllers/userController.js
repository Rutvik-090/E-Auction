// Dummy data
const users = [
  { id: 1, name: "Raj", age: 23, salary: 50000 },
  { id: 2, name: "Parth", age: 24, salary: 60000 },
  { id: 3, name: "Jay", age: 25, salary: 70000 },
];

// Get single default user
export const getUser = (req, res) => {
  const user = {
    id: 111023,
    name: "Rutvik",
    age: 22,
    salary: 0,
  };

  res.status(200).json({
    message: "User fetched successfully",
    data: user,
  });
};

// Get all users
export const getAllUsers = (req, res) => {
  res.status(200).json({
    message: "All users fetched successfully",
    data: users,
  });
};

// Get user by ID
export const getUserById = (req, res) => {
  const userId = parseInt(req.params.id);

  const foundUser = users.find((user) => user.id === userId);

  if (!foundUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    message: "User fetched successfully",
    data: foundUser,
  });
};
