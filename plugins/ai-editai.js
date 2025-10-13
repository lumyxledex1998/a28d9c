import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, text }) => {
  if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.startsWith('image/')) return
  if (!text) return

  const buffer = await m.quoted.download()
  if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')
  const filePath = './tmp/editai.jpg'
  fs.writeFileSync(filePath, buffer)

  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', fs.createReadStream(filePath))

  const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders()
  })

  const url = data?.trim()
  if (!url || !url.startsWith('http')) return

  const apiUrl = `https://mayapi.ooguy.com/photoeditor?image=${encodeURIComponent(url)}&q=${encodeURIComponent(text)}&apikey=nevi`
  const res = await axios.get(apiUrl)
  const finalImg = res?.data?.result?.url
  if (!finalImg) return

  const imgBuffer = await axios.get(finalImg, { responseType: 'arraybuffer' }).then(res => res.data)
  await conn.sendFile(m.chat, imgBuffer, 'result.jpg', '', m)
}

handler.help = ['editai <prompt>']
handler.tags = ['ai']
handler.command = ['editai']
handler.register = true

export default handler
