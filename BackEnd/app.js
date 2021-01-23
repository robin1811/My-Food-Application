const { restart } = require("nodemon");

const express = require("express");
const fs = require("fs");
const plans = require("./db/plans.json");
const usersDB = require("./db/users.json");
const { v4: uuidv4 } = require("uuid");

const app = express();

//UserDefined MiddelWare
// app.use(function (req, res, next) {
//   console.log("before");
//   console.log(req.body);
//   next();
// });

//  it tracks incoming request and see if there is data in the request => the data will be fed in body
// Predefined middleWare
app.use(express.json());

// app.use(function (req, res, next) {
//   console.log("after");
//   console.log(req.body);
//   next();
// });

// ##################################  Users  ######################################
// users -> get all users, create a user, get a user by id, update a user by id, delete a user by id
function getAllUsers(req,res){
  if(usersDB.length){
    res.status(200).json({
      message : "succesfullt got all user",
      data : usersDB
    })
  }
  else{
    res.status(404).json({
      message : "no users found "
    })
  }
}
function createUser(req,res){
  let user = req.body;
  user.id = uuidv4();
  usersDB.push(user);
  fs.writeFileSync("./db/users.json" , JSON.stringify(usersDB));

  res.status(200).json({
    message : "succesfully created a user",
    data : usersDB
  })
  
}
function getUserById(req,res){
  let userId = req.params;
  let UserObj = usersDB.filter( function (user){
    return user.id == userId.id;
  })
  console.log(UserObj);
  if(UserObj.length){
    res.status(200).json({
      message : "successfully got a user",
      data : UserObj
    })
  }
  else{
    res.status(404).json({
      message : "user not found"
    })
  }
}
function updateUserById(req,res){
  let userId = req.params.id;
  let updateObj = req.body;

  let UserObj = usersDB.filter( function (user){
    return user.id == userId;
  });

  if(UserObj.length){
    let user = UserObj[0];
    console.log(user);
    for(key in updateObj){
      user[key] = updateObj[key];
    }

    fs.writeFileSync("./db/users.json", JSON.stringify(usersDB));
    res.status(200).json({
      message : "successfully updated the user",
      data : updateObj
    })
  } else{
    res.status(404).json({
      message: "User Not Found",
    });
  }

}
function deleteUserById (req, res) {
  let { id } = req.params;
  let filteredUsers = usersDB.filter(function (user) {
    return user.id != id;
  });

  if (filteredUsers.length == usersDB.length) {
    res.status(404).json({
      mesage: "user not found !!!",
    });
  } else {
    fs.writeFileSync("./db/users.json", JSON.stringify(filteredUsers));
    res.status(200).json({
      message: "successfully deleted user by id",
    });
  }
}
// get all users
app.get("/api/users", getAllUsers);

// create a user 
app.post("/api/users", createUser);

//get a user by id 
app.get("/api/users/:id", getUserById);

// update a user id
app.patch("/api/users/:id", updateUserById)

// delete a user by id
app.delete("/api/users/:id", deleteUserById);



// ##################################  Plans  ######################################
// Plans -> get all plans, create a plan, get a plan by id, update a plan by id, delete a plan by id

function getAllPlans(req, res) {
  if (plans.length) {
    res.status(200).json({
      message: "Succefully got all plans",
      data: plans,
    });
  } else {
    res.status(200).json({
      message: "no food plans found",
    });
  }
}
function createPlan(req, res) {
  //  console.log(req.body);
  let plan = req.body;
  plan.id = uuidv4();
  plans.push(plan);
  fs.writeFileSync("./db/plans.json", JSON.stringify(plans));

  res.status(201).json({
    message: "successfully created a plan",
    data: plans,
  });
}
function getPlanById(req, res) {
  let { id } = req.params;
  let filteredPlans = plans.filter(function (plan) {
    return plan.id == id;
  });

  if (filteredPlans.length) {
    res.status(200).json({
      message: "successfully got plan by id",
      data: plans,
    });
  } else {
    res.status(404).json({
      mesage: "plan not found !!!",
    });
  }
}
function updatePlanById(req, res) {
  let { id } = req.params;

  let updateObj = req.body;
  // console.log(updateObj);
  let filteredPlan = plans.filter(function (plan) {
    return plan.id == id;
  });
  if (filteredPlan.length) {
    let plan = filteredPlan[0];
    for (key in updateObj) {
      plan[key] = updateObj[key];
    }
    fs.writeFileSync("./db/plans.json", JSON.stringify(plans));
    res.status(200).json({
      message: " Plan Updated",
    });
  } else {
    res.status(404).json({
      message: "Plan Not Found",
    });
  }
}
function deletePlanById(req, res) {
  let { id } = req.params;
  let filteredPlans = plans.filter(function (plan) {
    return plan.id != id;
  });

  if (filteredPlans.length == plans.length) {
    res.status(404).json({
      mesage: "plan not found !!!",
    });
  } else {
    fs.writeFileSync("./db/plans.json", JSON.stringify(filteredPlans));
    res.status(200).json({
      message: "successfully deleted plan by id",
    });
  }
}
// get all Plans
app.get("/api/plans", getAllPlans);

// create a plan
app.post("/api/plans", createPlan);

// get a plan by id
app.get("/api/plans/:id", getPlanById);

// update a plan by id
app.patch("/api/plans/:id", updatePlanById);

// delete a plan
app.delete("/api/plans/:id", deletePlanById);

app.listen(3000, function () {
  console.log("listening at port 3000");
});
