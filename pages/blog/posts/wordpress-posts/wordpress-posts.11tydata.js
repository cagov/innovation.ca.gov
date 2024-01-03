module.exports = {
  layout: "post",
  tags: ["news"],
  eleventyComputed: {
    permalink: article => `blog/posts/${article.page.fileSlug}`,
    title: article => article.data.title,
    date: article => article.data.date,
    publishdate: article => article.data.date.split("T")[0],
    meta: article => article.data.excerpt,
    description: article => article.data.excerpt,
    author: article => article.data.author
  }
}