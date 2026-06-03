async function test() {
  const data = {
    phone: '+62812345678', // matching 62812345678 in DB
    code: 'abc123',
    newPassword: 'newpassword123'
  };
  const res = await fetch('http://localhost:3000/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const text = await res.text();
  console.log(res.status, text);
}
test();
