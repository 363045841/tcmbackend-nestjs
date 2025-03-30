const https = require("https");
const express = require("express");

const app = express();
app.use(express.json());

app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const options = {
    method: "POST",
    hostname: "qianfan.baidubce.com",
    path: "/v2/app/conversation/runs",
    headers: {
      "Content-Type": "application/json",
      "X-Appbuilder-Authorization": "Bearer bce-v3/ALTAK-lJK0B5DEUsiSBphQRdRLq/8526ea7ce4b3ead61c093099cb06bd0d58ee4767",
    },
  };

  const requestBody = JSON.stringify({
    app_id: "0e685025-4f61-4ab4-b3a2-69b9f4441e12",
    query: "你好",
    conversation_id: "a117dcdb-0dbf-439f-9fe8-c1136c5681dd",
    stream: true,
  });

  const apiReq = https.request(options, (apiRes) => {
    let buffer = "";

    apiRes.on("data", (chunk) => {
      buffer += chunk.toString(); // 累积数据

      let boundary = buffer.lastIndexOf("\n"); // 查找最后一个完整行
      if (boundary !== -1) {
        let completeData = buffer.substring(0, boundary); // 取完整部分
        buffer = buffer.substring(boundary + 1); // 剩下部分留给下一次解析

        completeData.split("\n").forEach((line) => {
          try {
            if (line.trim()) {
              const json = JSON.parse(line.trim()); // 解析 JSON
              res.write(`data: ${JSON.stringify(json)}\n\n`);
            }
          } catch (error) {
            console.error("JSON 解析失败:", error, "数据:", line);
          }
        });
      }
    });

    apiRes.on("end", () => {
      res.write("data: [DONE]\n\n");
      res.end();
    });
  });

  apiReq.write(requestBody);
  apiReq.end();
});

app.listen(3000, () => console.log("SSE 服务器运行在 http://localhost:3000"));
