const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandle = require("./errorHandle");
const successHandler = require("./successHandler");

const todos = [];

const requestListener = (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  let body = "";

  //req.on()是一個監聽事件 可以用來取得傳給Body的資料
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url == "/todos" && req.method == "GET") {
    successHandler(res, todos, headers);
  } else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          successHandler(res, todos, headers);
        } else {
          errorHandle(res, headers);
        }
      } catch (error) {
        errorHandle(res, headers);
      }
    });
  } else if (req.url == "/todos" && req.method == "DELETE") {
    todos.length = 0;
    successHandler(res, todos, headers);
  } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
    //console.log('77');
    const id = req.url.split("/").pop();
    const index = todos.findIndex((element) => element.id == id);
    //console.log( id,index);
    if (index !== -1) {
      todos.splice(index, 1);

      successHandler(res, todos, headers);
    } else {
      errorHandle(res, headers);
    }
  } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        const id = req.url.split("/").pop();
        const index = todos.findIndex((element) => element.id == id);
        if (title !== undefined && index !== -1) {
          todos[index].title = title;
          successHandler(res, todos, headers);
        } else {
          errorHandle(res, headers);
        }
      } catch {
        errorHandle(res, headers);
      }
    });
  } else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "fail",
        message: "無此路由",
      })
    );
    res.end(); //結束這
  }
};

const server = http.createServer(requestListener);
server.listen(3005);
