# Routine Management System Backend (API DOCS)
# Swagger Documentation Link
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
  access_token: access_token,
  refresh_token: refresh_token
}
onFailure: {
  message: 'Failed to login. Please use correct email !!',
  token: null,
}

```
## Regenerated access token endpoints (Recently updated !!)

### When to call this endpoint ?
When the session time for access token is ended/out, the jwt server reset the access_token which caused you to  you get the response like this => 
    {
      message:"Session timeout."
    }
Therefore, inorder to regenerate access token, you have hit this endpoint by attaching refresh_token on the header of "authorization/oAuth 2.0/refresh_token: value" which in response you get the new access_token and refresh token. The session time for access_token is 24 hrs, that means your access_token is only justified with a day.

```perl
PUT : /api/v4/RegenerateToken

header:{
  "Authorization": "refresh_token ${refresh_token}"
}

****** -> Response  <- *******
onSuccess: {
  message: 'Token regenerated succesfully !!',
  access_token: access_token,
  refresh_token: refresh_token
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
   token:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd"
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
   token:"s23241sfsdf.ad34fdsfdsdf.34sfgsfsfsfsd"
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
    course_type:"",
    module_name:"",
    lecturer_name:"",
    group: "",
    room_name: "",
    block_name: "",
    day:"",
    start_time:"",
    end_time:""
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
        course_type:"",
        module_name:"",
        lecturer_name:"",
        group: "",
        room_name: "",
        block_name: "",
        day:"",
        start_time:"",
        end_time:""
      },
      {
        course_type:"",
        module_name:"",
        lecturer_name:"",
        group: "",
        room_name: "",
        block_name: "",
        day:"",
        start_time:"",
        end_time:""
      },
      .....
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
    course_type:"",
    module_name:"",
    lecturer_name:"",
    group: "",
    room_name: "",
    block_name: "",
    day:"",
    start_time:"",
    end_time:""
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
            report_type:String,
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
                           "report_type": "suggestion",
                           "description": "i am testing mode",
                           "file": "1654840918671-next.png",
                           "__v": 0
                       },
                   ]

```
3. Delete feedbacks
```perl
DELETE: /api/v4/feedback/deleteFeedback
  
 //header.authorization.bearer
token: ""

 //header.authorization
feedbackid: "as23vd34dvfv",
filename:"abc.png"

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

# Latest features
1. Isolated versioning and configs (Into Production & Development)
2. Password Hashing (SHA256) (Secure Hash Algorithm)

# Upcoming features
1. Concurrency -> PM2 (cpu core utilization technique + Load balancing)
2. Aggregation Framework for data mapping





Author: Parbat Lama

Happy Learning ✌️
Happy Coding 👨‍💻
