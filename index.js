const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req,res,next) => {
  const {username,password} = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if(admin){
    next();
  }
  else{
    res.status(403).json({message:'Admin authentication failed'});
  }
};

const userAuthentication = (req,res,next) => {
  const {username,password} = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if(user){
    next();
  }
  else{
    res.status(403).json({message:'User authentication failed'});
  }
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const adminExist = ADMINS.find(a => a.username && a.password);
  if(adminExist){
    res.status(403).json({message:'Admin already exists.'});
  }
  else{
    ADMINS.push(admin);
    res.status(403).json({message:'Admin created succesfully.'});
  }
});

app.post('/admin/login',adminAuthentication, (req, res) => {
  res.json({message:'Logged in succesfully'});
});

app.post('/admin/courses',adminAuthentication, (req, res) => {
  const newCourse = {
    id : Date.now(),
    title : req.body.title,
    price : req.body.price
  }
  COURSES.push(newCourse);
  res.json({message:'Course created successfully'});
});

app.put('/admin/courses/:courseId',adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if(course){
    Object.assign(course,req.body);
    res.json({message:'Course updated succesfully'});
  }else{
    res.status(404).json({message:'Course not found'});
  }
});

app.get('/admin/courses', adminAuthentication,(req, res) => {
  res.json({courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = req.headers;
  const userExist = USERS.find(u => u.username && u.password); 
  if(userExist){
    res.json({message:'User already exixts'});
  }else{
    USERS.push(user);
    res.json({message:'User created successfully'});
  }
});

app.post('/users/login',userAuthentication ,(req, res) => {
  res.json({message:'User logged in successfully'});
});

app.get('/users/courses',userAuthentication, (req, res) => {
  let filteredCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (COURSES[i].published) {
      filteredCourses.push(COURSES[i]);
    }
  }
  res.json({ courses: filteredCourses });
});

app.post('/users/courses/:courseId', userAuthentication,(req, res) => {
  const courseId = req.query.courseId;
  const courseBuy =COURSES.find(c => c.courseId);
  if(courseBuy){
    req.user.purchachedCourses.push(courseId);
    res.json({message:'Course purchased successfully'});
  }else{
    res.status(404).json({message:'Course not available'});
  }
});

app.get('/users/purchasedCourses',userAuthentication, (req, res) => {
  var purchasedCourseId = req.user.purchasedCourses;
  var purchasesdCourses = [];
  for(let i=0;i<COURSES.length;i++){
    if(purchasedCourseId.indexOf(COURSES[i].id) !== -1){
      purchasesdCourses.push(COURSES[i]);
    }
  }
  res.json({purchasesdCourses});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

//mongodb+srv://anushkapatil566:Kh7Y9fO4ZuuILrUj@cluster0.3tmjmnc.mongodb.net/