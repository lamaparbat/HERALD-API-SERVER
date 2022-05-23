# Routine Management System Backend (Backend API Guidelines)

## Student endpoints
1. Login
```perl
 POST : /api/v4/student/Login

payload: {
   uid:""
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
 GET: /api/v4/admin/getRoutineData

<<<<<<< HEAD
!! the payload must be attached to the header
=======
!! the token must be attached to the header
>>>>>>> 40935a9fbb846e003cb1ba1661c86640dd5fa962
{
  token: String
}

<<<<<<< HEAD
=======
For example: In ReactJS,

const res = await axios.post('https://httpbin.org/post', { data }, {
  headers: {
    token:'a23adjbd3knvbjdf.f3jsbfvjbbjb3.skja8adkfsbfvjbfvj'
  }
});


>>>>>>> 40935a9fbb846e003cb1ba1661c86640dd5fa962

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

<<<<<<< HEAD
=======
!! the token must be attached to the header
{
  token: String
}

For example: In ReactJS,

const res = await axios.post('https://httpbin.org/post', { data }, {
  headers: {
    token:'a23adjbd3knvbjdf.f3jsbfvjbbjb3.skja8adkfsbfvjbfvj'
  }
});

>>>>>>> 40935a9fbb846e003cb1ba1661c86640dd5fa962
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
<<<<<<< HEAD
=======
 
 
!! the token must be attached to the header
{
  token: String
}

For example: In ReactJS,

const res = await axios.post('https://httpbin.org/post', { data }, {
  headers: {
    token:'a23adjbd3knvbjdf.f3jsbfvjbbjb3.skja8adkfsbfvjbfvj'
  }
});
>>>>>>> 40935a9fbb846e003cb1ba1661c86640dd5fa962

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

```
