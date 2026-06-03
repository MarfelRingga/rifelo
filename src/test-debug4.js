async function test() {
  const res = await fetch('http://localhost:3000/api/debug-reset2');
  const text = await res.text();
  console.log(text);
}
test();
