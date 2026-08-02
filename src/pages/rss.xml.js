import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts");
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: "Balajee Ramachandran",
    description: "Programmer. Blogger. Nice Guy.",
    site: context.site,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.id.replace(/\.md$/, "")}/`,
    })),
    customData: "<language>en-us</language>",
  });
}