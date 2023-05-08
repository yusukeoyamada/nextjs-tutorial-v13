// req = HTTP受信メッセージ、res = HTTPサーバーレスポンス
export default function handler(req, res) {
  res.status(200).json({ text: 'Hello' });
}