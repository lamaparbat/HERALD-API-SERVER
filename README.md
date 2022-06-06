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
## Regenerated access token endpoints
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
    module_name:"",
    lecturer_name:"",
    group: "",
    room_name: "",
    block_name: "",
    timing:"",
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
        module_name:"",
        lecturer_name:"",
        group: "",
        room_name: "",
        block_name: "",
        timing:"",
        createdOn:""
      },
      {
        module_name:"",
        lecturer_name:"",
        group: "",
        room_name: "",
        block_name: "",
        timing:"",
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
    routineID:"",
    .....
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
## ...email verification is on progress
