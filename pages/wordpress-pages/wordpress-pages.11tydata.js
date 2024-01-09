module.exports = {
  eleventyComputed: {
    title: article => article.data.title,
    publishdate: article => article.data.date.split("T")[0],
    date: article => article.data.date,
    id: article => article.data.id,
    tags: article => article.data.tags,
    meta: article => article.data.excerpt,
    description: article => article.data.excerpt,
    permalink: article => { 
      const url = article.data.wordpress_url;
      if (url && url.includes(".pantheonsite.io/"))
        return url.split(".pantheonsite.io/")[1] || "/";
      return url;
    },
    layout: article => {
      if (article.data.tags.includes('layout-no-sidebar'))
        return 'single-column';
      if(article.page.url == "/")
        return "landing";
      if (!article.data.layout)
        return "content";
      return article.data.template;
    },
    eleventyNavigation: article => {
      const key = article.data.id;
      const title = article.data.title;
      const wpParent = article.data.parent;
      const parent = wpParent != 0 ? wpParent : undefined;
      return { key, title, parent };
    }
  }
}