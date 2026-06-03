const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://127.0.0.1:3000/api/debug-reset');
  const text = await res.text();
  console.log(text);
}

test();
