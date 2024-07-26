const express = require("express");
const data = require("./task.json");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET ALL
app.get("/tasks", (req, res) => {
    const {isCompleted,} = req.query;

    console.log(typeof isCompleted)
    if(isCompleted){
        let tdata  =  data.tasks.filter((item)=>{
            console.log(item.completed,isCompleted)
            if(item.completed.toString() ==isCompleted){
                return item
            }
        })
        res.status(200).json({
            data:tdata,
          });
    }else{
        res.status(200).json({
            ...data,
          });
    }
 
});

// Get by ID
app.get("/tasks/:id", (req, res) => {
  let param = req.params.id;
  let id = data.tasks.find((item) => {
    return item.id == param;
  });
  if (id) {
    res.status(200).json({
      ...id,
    });
  } else {
    res.status(400).json({
      msg: `${param} not found`,
    });
  }
});

// Post/create tasks
app.post("/tasks", (req, res) => {
  let { title, description, completed } = req.body;
  if (!title || !description || typeof completed !== "boolean") {
    res.status(400).json({
      msg: "Please enter all the fields properly",
    });
  } else {
    let newData = {
      title,
      description,
      completed,
    };
    data.tasks = [...data.tasks, { ...newData, id: data.tasks.length + 1 }];
    res.status(201).json({
      ...data,
    });
  }
});

// Update tasks
app.put("/tasks/:id", (req, res) => {
  let param = req.params.id;
  let { title, description, completed } = req.body;
  if (!title || !description || typeof completed !== "boolean") {
    res.status(404).json({
      msg: "Please enter all the fields properly",
    });
  }
  let id = data.tasks.find((item) => {
    return item.id == param;
  });
  if (id?.id) {
      let tempData = {
        id: id.id,
        completed,
        description,
        title,
      };
      data.tasks = data.tasks.filter((item) => {
       return item.id != id.id;
      });
      data.tasks = [...data.tasks, tempData];
      res.status(200).json({
        ...tempData,
        msg: "Updated Successfully",
        data:data.tasks
      });
  } else {
    res.status(404).json({
      msg: `${param} not found`,
    });
  }
});

//delete
app.delete("/tasks/:id", (req, res) => {
    let param = req.params.id;
    let isIdExists = null;
    let tdata = data.tasks.filter((item) => {
        if(item.id==param){
            isIdExists = true
        }
      return item.id != param;
    });
    if(!isIdExists){
        res.status(404).json({
            msg:'Id doesnot exists',  
          });
    }else{
        data.tasks = tdata
        res.status(200).json({
          msg:'successfully deleted' + ' ' +param,  
          data:tdata,
        });
    }
    }
    );


app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
