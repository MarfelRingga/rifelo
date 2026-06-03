async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/debug-reset');
    const text = await res.text();
    console.log(text);
  } catch (err) {
    console.error(err);
  }
}
test();
