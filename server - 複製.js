const http = require('http');
const { v4: uuidv4} = require('uuid');
const errorHandle = require('./errorHandle');

const todos =[];

const requestListener =(req,res)=>{
   //以下的res,是收到Client請求後要回覆的資料
   console.log(req.url);
   console.log(req.method);

const headers = {
   'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json'
}

let body="";
//req.on()是一個監聽事件 可以用來取得傳給Body的資料
req.on('data',chunk=>{
    body +=chunk;
})


  if (req.url=="/todos" && req.method =="GET"){
      res.writeHead(200,headers);
      //res.write("index");  //直接輸出在螢幕上
      res.write(JSON.stringify({
        "status":"success",
        "data":todos
      }));
      res.end();//結束這次的傳送
  
    }else if(req.url=="/todos" && req.method =="POST"){
             req.on('end',()=>{
                 try {
                      const title =JSON.parse(body).title;
                      if(title !== undefined){
                          const todo ={
                            "title":title,
                            "id" :uuidv4()
                          };
                          console.log(todo);
                          todos.push(todo);
                          res.writeHead(200,headers);
                          res.write(JSON.stringify({
                             "status":"success",
                             "data":todos
                          }));             
                         res.end();
                      }else{
                           errorHandle(res);
                     
                      }                          
                  }catch(error){
                       errorHandle(res);
                     
                   }
          
        })


        
  
    }else if(req.url=="/todos" && req.method =="DELETE"){
             console.log('67');
             todos.length=0;
             res.writeHead(200,headers);
             res.write(JSON.stringify({
             "status":"Success",
             "data":todos
             }));
             res.end();//結束這
    }else if (req.url.startsWith("/todos/") && req.method =="DELETE"){
               //console.log('77');
               const id = req.url.split('/').pop();
               const index = todos.findIndex(element =>element.id == id) ;
              //console.log( id,index);    
               if (index !== -1) {
                   todos.splice(index,1);
                   res.writeHead(200,headers);
                   res.write(JSON.stringify({
                   "status":"Success",
                   "data":todos
                }));
             res.end();//結束這
               }else{
                      errorHandle(res);
               }
                
    }else if (req.url.startsWith("/todos/") && req.method =="PATCH"){
         req.on('end',()=>{
             try{
                  const title =JSON.parse(body).title;
                  const id = req.url.split('/').pop();
                  const index = todos.findIndex(element =>element.id == id) ;
                  if (title !==undefined && index !== -1){
                      todos[index].title = title
                      res.writeHead(200,headers);
                      res.write(JSON.stringify({
                          "status":"Success",
                          "data":todos        }));
                     res.end();// RES 資訊設定結束開始Response

                  } else{
                    errorHandle(res);
                  }

                 // console.log(todo,id);
                  res.end(); //結束響應處理流程
               
             }catch{
              errorHandle(res);
             }   

         })
    
    }else if (req.method =="OPTIONS"){
        res.writeHead(200,headers);

         res.end();


  }else{
     console.log('98');
     console.log(req.url);
       res.writeHead(404,headers);
      res.write(JSON.stringify({
        "status":"fail",
        "message":"無此路由"
      }));
      res.end();//結束這

  }

 
}

const server =http.createServer(requestListener);
server.listen(3005);