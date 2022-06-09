# Routine Management System Backend (API Guidelines)

# Swagger Documentation Link
https://rms-server-8080.herokuapp.com/api-docs/
## Student endpoints
1. Login
```perl
POST : /api/v4/student/Login

payload: {
   uid:""
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
POST : /api/v4/RegenerateToken

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
GET: /api/v4/teacher/Signup

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
   message:"Failed to login",
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
    start_time:"",
    end_time:"",
    createdOn:""
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
GET: /api/v4/routines/getRoutineData
 
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
        start_time:"",
        end_time:"",
        createdOn:""
      },
      {
        course_type:"",
        module_name:"",
        lecturer_name:"",
        group: "",
        room_name: "",
        block_name: "",
        start_time:"",
        end_time:"",
        createdOn:""
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
POST: /api/v4/admin/updateRoutineData

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
    start_time:"",
    end_time:"",
    createdOn:""
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
POST: /api/v4/admin/updateRoutineData

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

5. Search routine by group and module_name
```perl
GET: /api/v4/routines/searchRoutine
 
 //headers
 module_name:"",
 group:""
 
 //header.authorization.bearer
token: "",


For example: In Javascript using axios,

const res = await axios.post('https://httpbin.org/post', { data }, {
  headers: {
    "Authorization":'Bearer' + 'a23adjbd3knvbjdf.f3jsbfvjbbjb3.skja8adkfsbfvjbfvj',
    "module_name": "HCI",
    "group":"L5CG8"
  }
});
```
5. Get routine by Group.  (Recently updated !!)
```perl
GET: /api/v4/routines/getRoutineByGroup
 
 //headers
 group:""
 
 //header.authorization.bearer
token: "",


For example: In Javascript using axios,

const res = await axios.post('https://httpbin.org/post', { data }, {
  headers: {
    "Authorization":'Bearer' + 'a23adjbd3knvbjdf.f3jsbfvjbbjb3.skja8adkfsbfvjbfvj',
    "group":"8"
  }
});
```
5. Get routine by Level. (Recently updated !!)
```perl
GET: /api/v4/routines/getRoutineByLevel
 
 //headers
 level:""
 
 //header.authorization.bearer
token: "",


For example: In Javascript using axios,

const res = await axios.post('https://httpbin.org/post', { data }, {
  headers: {
    "Authorization":'Bearer' + 'a23adjbd3knvbjdf.f3jsbfvjbbjb3.skja8adkfsbfvjbfvj',
    "level":"5"
  }
});
```
## ...email verification is on progress
