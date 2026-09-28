// Blog posts from datnlq.github.io/post_md (latest 2 posts)
export interface BlogPost {
  title: string;
  date: string;
  filename: string;
  sourceUrl: string;
}

export const latestBlogPosts: BlogPost[] = [
  {
    title: "[PortSwigger] - File upload vulnerabilities",
    date: "Jan 6, 2022",
    filename: "fileuploadvuln",
    sourceUrl: "https://github.com/datnlq/datnlq.github.io/blob/main/post_md/fileuploadvuln.md"
  },
  {
    title: "[PortSwigger] - Websocket",
    date: "Jan 2, 2022",
    filename: "websocket",
    sourceUrl: "https://github.com/datnlq/datnlq.github.io/blob/main/post_md/websocket.md"
  }
];
