async function test() {
  const data = {
    phone: '+628159999410',
    code: '123456',
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
