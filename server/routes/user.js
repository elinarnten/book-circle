import express from "express";
import { Router } from "express";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

const router = express.Router();

//GET all users
router.get("/all", (req, res) => {
  userModel.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});


router.get("/", async (req, res) => {
  try {
    const users = await userModel.findById(req.session.user);
    res.json(users);
  } catch (err) {
    console.log(err);
    res.send("Other error...");
  }
});

router.post("/createAccount", async (req, res) => {
  const cryptedPassword = await bcrypt.hash(req.body.password, 10);

  const username = req.body.username;
  const mail = req.body.mail;
  const role = req.body.role;

  const user = new userModel({
    username: username,
    password: cryptedPassword,
    mail,
    role: role,
  });

  const checkUsername = await userModel.findOne({
    username: req.body.username,
  });
  if (checkUsername) {
    res.status(409).send("username already exist! chose another one.");
    return;
  } else if (!checkUsername) {
    await user
      .save()
      .then(() => res.json(user))
      .catch((err) => res.status(400).json("Error: " + err));
    console.log(user + " USER ADDED");
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const findUser = users.find((user) => user.id === id);

  if (findUser === undefined) {
    return res.status(404).send("Not found!");
  }
  if (findUser) {
    return res.send(findUser);
  }
});


//PUT user by id
router.put("/:id", (req, res) => {
  userModel.findOneAndUpdate(
    { _id: req.params.id },
    { username: req.body.username, role: req.body.role }
  )
    .then(() => res.json("User updated!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//DELETE user by id
router.delete("/:id", (req, res) => {
  userModel.findByIdAndDelete({ _id: req.params.id })
    .then(() => res.json("User Deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});


router.post("/login", async (req, res) => {
  console.log(req.body.username);
  const findUser = await userModel.findOne({ username: req.body.username });

if (!findUser) {
  return res.status(401).send("Wrong password or username");
}

  const check = await bcrypt.compare(req.body.password, findUser.password);
  console.log("check " + check);
  
  if (!findUser || !check) {
    return res.status(401).send("Wrong password or username");
  }
  

  // Check if user aleady is logged in
  if (req.session.user) {
    return res.send("Already logged in");
  }
  req.session.user = findUser;
  res.json(findUser);
});

router.get("/login", (req, res) => {
  if (!req.session.id) {
    return res.status(401).send("You are not logged in");
  }

  res.send(req.session);
});

export default router;