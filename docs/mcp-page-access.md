---
title: MCP docs page access attempt
---

# MCP docs page access attempt

Attempted to retrieve `https://developers.openai.com/resources/docs-mcp` from the container, but the request was blocked.

```
$ curl -L -I https://developers.openai.com/resources/docs-mcp
HTTP/1.1 403 Forbidden
content-length: 9
content-type: text/plain
date: Sun, 01 Feb 2026 02:09:13 GMT
server: envoy
connection: close

curl: (56) CONNECT tunnel failed, response 403
```
