const http = require("http");
const fs = require("fs");
let orders = [];
const server = http.createServer((req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "*");
  res.setHeader("access-control-allow-methods", "*");

  // _________________________________________________________________________

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const order = JSON.parse(body);
        orders.push(order);
        res.end(JSON.stringify({ message: "thank you for your order" }));
        return;
      } catch (error) {
        // res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "invalid JSON" }));
        return;
      }
    });
    return;
  }

  // ______________________________________________
  else if (req.method === "GET") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const typeReq = url.pathname.split("/")[1];
    if (typeReq === "orders") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(orders));
      return;
    }
  }

  //  _______________________________________________________
  else if (req.method === "DELETE") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathName = url.pathname.split("/").filter((item) => item !== "");
    const typReq = pathName[0] ? pathName[0] : null;
    const id = pathName[1] ? pathName[1] : null;
    if (typReq === "orders") {
      orders = orders.filter((item) => item.id !== id);
      res.end(JSON.stringify(orders));
      return;
    }
  }

  // _________________________________________

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ message: "not found" }));
  return;
});

// _________________________________________________________
const Port = process.env.PORT || 3000;

server.listen(Port, "0.0.0.0", () => {
  console.log(`server is running on port ${Port}`);
});
