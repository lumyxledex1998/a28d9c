import { downloadMediaMessage } from '@whiskeysockets/baileys'
import fs from 'fs'
import axios from 'axios'
import path from 'path'
import FormData from 'form-data'

let handler = async (m, { conn, text }) => {
  if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.startsWith('image/')) return
  if (!text) return

  let mediaMessage = m.quoted.msg || m.quoted
  let stream = await downloadMediaMessage(mediaMessage, 'buffer', {}, {
    logger: conn.logger,
    reuploadRequest: conn.updateMediaMessage
  })

  let filePath = './tmp/image.jpg'
  fs.writeFileSync(filePath, stream)

  let form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', fs.createReadStream(filePath))

  let { data } = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders()
  })

  let url = data?.trim()
  if (!url.startsWith('http')) return

  let api = `https://mayapi.ooguy.com/photoeditor?image=${encodeURIComponent(url)}&q=${encodeURIComponent(text)}&apikey=nevi`
  let res = await axios.get(api)
  let img = res?.data?.result?.url
  if (!img) return

  let buffer = await axios.get(img, { responseType: 'arraybuffer' }).then(res => res.data)
  await conn.sendFile(m.chat, buffer, 'result.jpg', '', m)
}

handler.help = ['editai <prompt>']
handler.tags = ['ai']
handler.command = ['editai']
handler.register = true

export default handler
