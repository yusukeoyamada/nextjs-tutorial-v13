import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export function getSortedPostsData() {
  // posts以下のファイル名取得
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // ファイル名から".md "を削除してidを取得
    const id = fileName.replace(/\.md$/, '');

    // マークダウン・ファイルを文字列として読み込む
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // グレイマターを使って投稿のメタデータ部分を解析する
    const matterResult = matter(fileContents);

    // データをidで結合する
    return {
      id,
      ...matterResult.data,
    };
  });
  // 投稿を日付順(降順)に並べる
    // sort: -1は前に。1は後ろに。0はそのまま
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      // 小さいaを後ろに
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // グレイマターを使って投稿のメタデータ部分を解析する
  const matterResult = matter(fileContents);

  // マークダウンをHTML文字列に変換するためにremarkを使用する
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // データをidとcontentHtmlで結合する
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // 次のような配列を返します：
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}