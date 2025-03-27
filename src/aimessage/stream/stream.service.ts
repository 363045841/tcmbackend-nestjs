import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamService {
  async getStreamedAnswers(query: string, sendChunk: (chunk: string) => void): Promise<void> {
    const myHeaders = new Headers();
    myHeaders.append(
      'X-Appbuilder-Authorization',
      'Bearer bce-v3/ALTAK-lJK0B5DEUsiSBphQRdRLq/8526ea7ce4b3ead61c093099cb06bd0d58ee4767',
    );
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      app_id: '0e685025-4f61-4ab4-b3a2-69b9f4441e12',
      query: query,
      conversation_id: 'a117dcdb-0dbf-439f-9fe8-c1136c5681dd',
      stream: true,
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow' as RequestRedirect,
    };

    try {
      const response = await fetch('https://qianfan.baidubce.com/v2/app/conversation/runs', requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.body === null) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      function read() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              console.log('流式传输结束');
              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            sendChunk(chunk); // 将每一块数据推送给调用方
            read(); // 继续读取下一个块
          })
          .catch((error) => {
            console.error('读取流时出错:', error);
          });
      }

      read(); // 开始读取流
    } catch (error) {
      console.error('请求失败:', error);
    }
  }
}