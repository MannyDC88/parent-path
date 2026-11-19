const STORAGE_KEY = 'parent_path_browser_key'

export function getBrowserKey() {
  let key = localStorage.getItem(STORAGE_KEY)
  if (!key) {
    key = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, key)
  }
  return key
}
