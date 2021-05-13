# digital.ca.gov
Office of Digital Innovation website


## Blog

Our blog originally on news.alpha.ca.gov has been moved here so it is deployed to <a href="https"//digital.ca.gov/blog/">digital.ca.gov/blog/</a>

### Writing posts

To write a new post:
- Create a new file in pages/blog/posts
- Name the file using a .html file extension if you just want to use html or .md if you want to use markdown (HTML is allowed in markdown files too)
- This new file should contain metadata in yml format at the top:
```
---
layout: page
title: Why Alpha.CA.gov is prioritizing APIs
meta: How Alpha.CA.gov is making data more accessible and useful
previewimage: img/thumb/APIs-Blog-Postman-Screenshot-1.jpg
lead: Making data more accessible and useful
author: JP Petrucione
publishdate: 02/21/2020
tags: news
---
```
- The tags: news will make it show up on the blog homepage. If you want to send it out for review commit it without the tags line and it will be viewable at its own url without being linked.
- Add images via github by putting them in _site/img
