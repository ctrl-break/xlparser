const _store = {}

const store = {
  setItem: (key, value) => _store[key] = value,
  getItem: (key) => _store[key],
  removeItem: (key) => delete _store[key],
}

module.exports = store