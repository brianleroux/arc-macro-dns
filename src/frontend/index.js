(async function main () {

  // call the backend for wss url
  // ... if you server render this can embedded on the initial page load
  let result = await fetch('/api')
  let data = await result.json()
  console.log(`api result`, data)

  // connect to it
  let ws = new WebSocket(data.wss)
  ws.onopen = console.log
  ws.onclose = console.log
  ws.onmessage = console.log
  ws.onerror = console.log

})()

console.log('hello from index.js')
