function cleanUrl(url) {
  if (url && url.includes(".pantheonsite.io/"))
    return url.split(".pantheonsite.io/")[1] || "/";
  return url;
}

module.exports = {
  eleventyComputed: {
    permalink: article => cleanUrl(article.data.wordpress_url),
    title: article => article.data.title,
    layout: article => {
      if(article.data.tags.includes('layout-no-sidebar'))
        return 'single-column';
      if(article.page.url == "/")
        return "landing";
      if (!article.data.layout)
        return "content";

      return article.data.template;
    },
    publishdate: article => article.data.date.split("T")[0],
    date: article => article.data.date,
    parentid: article => article.data.parent,
    tags: article => article.data.tags,
    meta: article => article.data.excerpt,
    description: article => article.data.excerpt,
  }
}