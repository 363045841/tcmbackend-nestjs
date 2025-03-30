import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class StreamService {
  async getStreamedAnswers(
    conversation_id: string,
    query: string,
    sendChunk: (chunk: string) => void,
  ): Promise<void> {
    const myHeaders = new Headers();
    myHeaders.append(
      'X-Appbuilder-Authorization',
      'Bearer bce-v3/ALTAK-Sp9uueSHlp7LvWFuilu6Y/1eb712fdbe3c6e017413c13170738f264a5d2817',
    );
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      app_id: 'eb6bc01f-00ac-4c82-9c1a-53fd3322f5d2',
      query: query,
      conversation_id: 'fc5fcfc4-be7d-43bd-b185-e182751eec5a',
      stream: true,
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow' as RequestRedirect,
    };
    let tempPkg = '';

    let sendPkgNum = 0;

    try {
      const response = await fetch(
        'https://qianfan.baidubce.com/v2/app/conversation/runs',
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.body === null) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      function calcPos(str: string) {
        let start = str.indexOf('data:');
        if (start === 0) {
          start = str.indexOf('{');
          return {
            start: start,
            end: str.lastIndexOf('}') + 1,
          };
        } else {
          return {
            start: -1,
            end: -1,
          };
        }
      }

      function read() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              let matches = [...tempPkg.matchAll(/data:/g)];
              try {
                let ans = JSON.parse(tempPkg.slice(matches[matches.length - 1].index + 5));
                sendChunk(ans.response); // 单块的完整数据包，直接推给前端
                console.log(ans.response)
                
              } catch {
                console.error('解析失败', tempPkg);
              }
              sendChunk(JSON.stringify({"is_completion": true,"answer":""}))
              console.log('流式传输结束');
              return;

            }

            const chunk = decoder.decode(value, { stream: true });
            tempPkg += chunk;

            let matches = [...tempPkg.matchAll(/data:/g)];
            if (matches.length >= 2) {
              if (matches.length - 1 > sendPkgNum) {
                let length = matches.length;
                let data = tempPkg.slice(
                  matches[length - 2].index + 5,
                  matches[length - 1].index,
                );
                try {
                  let ans = JSON.parse(data);
                  // console.log('解析成功', 0, ans, data);
                  sendChunk(data); // 单块的完整数据包，直接推给前端
                } catch (error) {
                  console.error('解析失败', tempPkg);
                }
                sendPkgNum++;
              }
            }

            read(); // 继续读取下一个块
          })
          .catch((error) => {
            console.error('读取流时出错:', error);
          });
      }

      read(); // 开始读取流
      console.log(tempPkg);
    } catch (error) {
      console.error('请求失败:', error);
    }
  }
}
