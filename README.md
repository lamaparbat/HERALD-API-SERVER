# Routine_Management_System_Backend
Routine Management System

## Backend API Guidelines

# Student endpoints
1. Login
```perl
API: http://localhost:8000/api/v4/student/Login

payload: {
   uid:""
}

Response:
onSuccess: {
   message:"Login succesfully",
   token:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd"
}
onFailure: {
   message:"Failed to login",
   token:null
}

# Teacher endpoints
1. Login
```perl
API: http://localhost:8000/api/v4/teacher/Login

payload: {
   email:"",
   password:""
}

Response:
onSuccess: {
   message:"Login succesfully",
   token:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd"
}
onFailure: {
   message:"Failed to login",
   token:null
}

2. Signup
```perl
API: http://localhost:8000/api/v4/teacher/Signup

payload: {
   email:"",
   password:""
}

Response:
onSuccess: {
   message:"Login succesfully",
   token:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd"
}
onFailure: {
   message:"Failed to login",
   token:null
}
