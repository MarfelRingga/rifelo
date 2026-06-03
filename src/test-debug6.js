async function test() {
  const res = await fetch('http://localhost:3000/api/debug-reset3', { method: 'POST' });
  const text = await res.text();
  console.log(text);
}
test();
