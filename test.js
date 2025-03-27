var myHeaders = new Headers();
myHeaders.append("X-Appbuilder-Authorization", "Bearer bce-v3/ALTAK-lJK0B5DEUsiSBphQRdRLq/8526ea7ce4b3ead61c093099cb06bd0d58ee4767");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
   "app_id": "0e685025-4f61-4ab4-b3a2-69b9f4441e12",
   "query": "我现在头昏脑涨",
   "conversation_id": "a117dcdb-0dbf-439f-9fe8-c1136c5681dd",
   "stream": true
});

var requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

// 使用 fetch 发起请求
fetch("https://qianfan.baidubce.com/v2/app/conversation/runs", requestOptions)
   .then(response => {
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body.getReader(); // 获取可读流
      const decoder = new TextDecoder('utf-8'); // 解码器，将二进制数据转换为字符串

      function read() {
         reader.read().then(({ done, value }) => {
            if (done) {
               console.log('流式传输结束');
               return;
            }

            // 解码当前块并输出
            const chunk = decoder.decode(value, { stream: true });
            console.log(chunk);

            // 继续读取下一个块
            read();
         }).catch(error => {
            console.error('读取流时出错:', error);
         });
      }

      // 开始读取流
      read();
   })
   .catch(error => console.error('请求失败:', error));