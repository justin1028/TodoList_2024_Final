function successHandler(res ,todos,headers) {
    console.log("Res_HeadSetting_Handle");
 
    
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos
      })
    );
    res.end();
  }

  module.exports = successHandler;