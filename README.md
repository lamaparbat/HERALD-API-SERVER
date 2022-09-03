# HCK API SERVICES  🎉🎉
 
## Student endpoints
1. Login
```perl
POST : /api/v4/student/Login

payload: {
   uid:"np03cs21@heraldcollege.edu.np"
}

****** -> Response  <- *******
onSuccess: {
  message: 'Login succesfull !!',
  email:"np03cs4s210869@heraldcollege.edu.np",
  scope:"student",
  accessToken:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd",
  refreshToken:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd",
}
onFailure: {
  message: 'Failed to login. Please use correct email !!',
  token: null,
}

```
## Regenerated access token endpoints

```perl
PUT : /api/v4/RegenerateToken

header:{
  "Authorization": "refreshToken ${refreshToken}"
}

****** -> Response  <- *******
onSuccess: {
  message: 'Token regenerated succesfully !!',
  accessToken: accessToken,
  refreshToken: refreshToken
}
onFailure: {
  message:"Refresh token cannot verified."
}
```

## Teacher endpoints
1. Login
```perl
POST : /api/v4/teacher/Login

payload: {
   email:"",
   password:""
}

****** -> Response  <- *******
onSuccess: {
   message:"Login succesfully",
   email:"bishalkhadka32@gmail.com",
   scope:"teacher",
   accessToken:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd",
   refreshToken:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd",
}
onFailure: {
   message:"Failed to login",
   token:null
}
```

2. Signup
```perl
POST: /api/v4/teacher/Signup

payload: {
   email:"",
   password:""
}

****** -> Response  <- *******
onSuccess: {
   message:"Account created succesfully",
   token:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd"
}
onFailure: {
   message:"Failed to create account !1",
   token:null
}
```
## Admin endpoints
1. Login
```perl
POST : /api/v4/admin/Login

payload: {
   email:"",
   password:""
}

****** -> Response  <- *******
onSuccess: {
   message:"Login succesfully",
   email:"nirmal55@gmail.com",
   scope:"admin",
   accessToken:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd",
   refreshToken:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd",
}
onFailure: {
   message:"Failed to login",
   token:null
}
```

2. Signup
```perl
POST: /api/v4/admin/Signup

payload: {
   email:"",
   password:""
}

****** -> Response  <- *******
onSuccess: {
   message:"Account created succesfully",
   token:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd"
}
onFailure: {
   message:"Failed to create account !!",
   token:null
}
```

## Routines CRUD endpoints
1. Create routine 
```perl
POST: /api/v4/admin/postRoutineData
 
//header.authorization.bearer
token: ""

// send data
payload: {
    courseType:"",
    moduleName:"",
    lecturerName:"",
    group: "",
    roomName: "",
    blockName: "",
    day:"",
    startTime:"",
    endTime:""
}

****** -> Response  <- *******
onSuccess: {
   message:"Routine posted successfully.",
}
onFailure: {
   message:"Failed to post the routine !!",
}
```

2. Read/Fetched routine data
```perl
GET: /api/v4/routines
 
 //header.authorization.bearer
token: ""

For example: In Javascript using axios,

const res = await axios.post('https://httpbin.org/post', { data }, {
  headers: {
    "Authorization":'Bearer' + 'a23adjbd3knvbjdf.f3jsbfvjbbjb3.skja8adkfsbfvjbfvj'
  }
});

****** -> Response  <- *******
onSuccess: {
   [
      {
        courseType:"",
        moduleName:"",
        lecturerName:"",
        classType: "",
        group: "",
        roomName: "",
        blockName: "",
        day:"",
        startTime:"",
        endTime:""
      },
      {
        courseType:"",
        moduleName:"",
        lecturerName:"",
        classType: "",
        group: "",
        roomName: "",
        blockName: "",
        day:"",
        startTime:"",
        endTime:""
      },
      ...
   ]
}

onFailure: {
    message: "500 INTERNAL SERVER ERROR !!"
}
```

3. Update routine data
``` perl
PUT: /api/v4/admin/updateRoutineData

!! the token must be attached to the header =>  header.authorization.bearer
token: ""

For example: In ReactJS,

const res = await axios.post('https://httpbin.org/post', { data }, {
  headers: {
    "Authorization":'Bearer' + 'a23adjbd3knvbjdf.f3jsbfvjbbjb3.skja8adkfsbfvjbfvj'
  }
});

payload: {
    courseType:"",
    moduleName:"",
    lecturerName:"",
    classType: "",
    group: "",
    roomName: "",
    blockName: "",
    day:"",
    startTime:"",
    endTime:""
}


****** -> Response  <- *******
onSuccess: {
   message:"Routine successfully updated.",
}
onFailure: {
   message: "Internal Server Error !!"
}

```

4. Delete routine data
```perl
DELETE: /api/v4/admin/deleteRoutineData

const res = await axios.post('https://httpbin.org/post', { data }, {

  //token must be attatched to header.authorization.bearer
  headers: {
    "Authorization":'Bearer' + 'a23adjbd3knvbjdf.f3jsbfvjbbjb3.skja8adkfsbfvjbfvj'
  }
});

payload: {
    routineID:""
}

****** -> Response  <- *******
onSuccess: {
   message:"Routine successfully deleted.",
}
onFailure: {
   message: "Internal Server Error !!"
}

# User feedback CRUD (Recently updated !!)
1. Post feeback 
```perl
POST: /api/v4/feedback/postFeedback
  
 //header.authorization.bearer
token: ""

 payload = {
            reportType:String,
            description:String,
            file:Object
           }

```
2. Fetch feedbacks
```perl
GET: /api/v4/feedback/getFeedback
  
 //header.authorization.bearer
token: ""

 response = "data": [
                       {
                           "_id": "62a2de564582e52de9b8f891",
                           "reportType": "suggestion",
                           "description": "i am testing mode",
                           "file": "1654840918671-next.png",
                           "__v": 0
                       },
                   ]

```
3. Delete feedbacks
```perl
DELETE: /api/v4/feedback/deleteFeedback?feedbackId=
  
 // query
 feedbackId = String
 
 //header.authorization.bearer
token: String

```

# Upload Data in Excellsheet form (Student List)
1. Upload student excell sheet (Please donot upload file other than xlsx format)
```perl
POST: /api/v4/uploadStudentList
  
 //header.authorization.bearer
token: ""

//payload
file:[objects].         [NOTE: File extension must be xlsx and table field ordering must be like S.N. , Student ID, ....]

//success response
Status Code: 200. ok
message = Data extracted and import to DB successfully.

//error client side failure response
Status Code: 400
message = Please donot upload file other than xlsx

//error server side failure response
Status Code: 500
message = SERVER ERROR
```

# Latest features 👈🏽
1. Isolated versioning and configs (Into Production & Development)
2. Password Hashing (SHA256) (Secure Hash Algorithm)
3. Lost & Found services

# Upcoming features 👷🏻
1. Concurrency -> PM2 (cpu core utilization technique + Load balancing)
2. Social media api sync (Public api + Scrapping [Alternatives])


# Things need to optimize 🥷
1. Aggregation Framework for data mapping
2. Devops + AWS Serivice integration [Premium]
3. Log tracing & Management  [Premium]

# Things accomplished untill now 👨‍🚀
1. Routine Management System.






Author: Parbat Lama 

Happy Learning ✌️
Happy Coding 👨‍💻
