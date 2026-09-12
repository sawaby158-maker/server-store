const http = require("http");
const fs = require("fs");
const allowedOrigins = [
  "https://sawaby158-maker.github.io/brand-store/",
  "https://sawaby158-maker.github.io/dashboard-store/",
];
const server = http.createServer((req, res) => {
  res.setHeader("access-control-allow-headers", "*");
  res.setHeader("access-control-allow-methods", "*");

  // _________________________________________________________________________

  let orders = [];
  fs.readFile("orders.json", "utf8", (err, data) => {
    if (err) {
      res.end(JSON.stringify({ message: "error reading orders" }));
    } else {
      orders = JSON.parse(data);

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
            fs.writeFile("orders.json", JSON.stringify(orders), (err) => {
              if (err) {
                console.log(err);
                res.end(JSON.stringify({ message: "error saving order" }));
                return;
              }
              res.end(JSON.stringify({ message: "thank you for your order" }));
            });
            return;
          } catch (error) {
            // res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "invalid JSON" }));
            return;
          }
        });
        return;
      } else if (req.method === "GET") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const typeReq = url.pathname.split("/")[1];
        if (typeReq === "orders") {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(orders));
          return;
        }
      }
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "not found" }));
      return;
    }
  });
});

const Port = process.env.PORT || 3000;

server.listen(Port, "0.0.0.0", () => {
  console.log(`server is running on port ${Port}`);
});
