import { v2, config } from 'cloudinary';
const { api, uploader, search } = v2;

config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const max = { max_results: 500 };
const prefix = f => ({ ...max, prefix: f, type: 'upload' });

const uploadBase64 = (imgData, public_id) => uploader.upload('data:image/jpeg;base64,' + imgData, {
  public_id,
  // use_filename: true,
  // unique_filename: false,
  // overwrite: true
})

export const ver = () =>
  api.resources(max)
    .then(r => sortBy({ version: 1}, r.resources))
    .then(r => r[0].version);

export const folder = f =>
  (f ? api.sub_folders(f, max) : api.root_folders())
    .then(r => sortBy('name', r.folders));

export const list = f =>
  api.resources(f ? prefix(f) : max)
    .then(r => sortBy('public_id', r.resources));

export const find = e =>
  search.expression(e).max_results(500).execute()
    .then(r => sortBy('public_id', r.resources));

export const content = f =>
  find('folder:' + f);

export const remove = ids =>
  api.delete_resources(ids);

// { base64, pid, folder, name }
// { imgs: { base64, public_id }, isLocal: true }
// { imgs, pid } imgs = a list of urls
export const upload = ({ imgs, folder, name, pid, base64, isLocal }) => base64
  ? uploadBase64(base64, pid || `${folder}/${name}`)
  : (isLocal
    ? serial(imgs, m => uploadBase64(m.base64, m.public_id))
    : serial(imgs.map(x => new URL(x)), m =>
        axios.get(m.href, {
          responseType: 'arraybuffer',
          headers: {
            Referer: m.origin
          }
        }).then(r =>
          Buffer.from(r.data, 'binary').toString('base64')
        ).then(r =>
          uploadBase64(r, pid)
        )
      )
  )
