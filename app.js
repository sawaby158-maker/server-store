const http = require("http");
let orders = [];
const server = http.createServer((req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "*");
  res.setHeader("access-control-allow-methods", "*");
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
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "thank you for your order" }));
      } catch (error) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "invalid JSON" }));
      }
    });
  } else if (req.method === "GET") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const typeReq = url.pathname.split("/")[1];
    if (typeReq === "orders") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(orders));
    }
  }
});

const Port = process.env.PORT || 3000;

server.listen(Port, "0.0.0.0", () => {
  console.log(`server is running on port ${Port}`);
});
