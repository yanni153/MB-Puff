async function testUpload() {
  try {
    console.log("Starting authentication...");
    
    // 1. Get CSRF Token
    const csrfRes = await fetch('https://mb-puff.vercel.app/api/auth/csrf');
    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken;
    let cookies = csrfRes.headers.getSetCookie ? csrfRes.headers.getSetCookie() : [csrfRes.headers.get('set-cookie')];
    let cookieString = cookies.map(c => c.split(';')[0]).join('; ');
    
    console.log("Got CSRF Token.");

    // 2. Login
    const loginFormData = new URLSearchParams();
    loginFormData.append('email', 'admin@mbpuff.dz');
    loginFormData.append('password', 'Mohamed@147*258*369');
    loginFormData.append('csrfToken', csrfToken);
    loginFormData.append('callbackUrl', '/');
    loginFormData.append('json', 'true');

    const loginRes = await fetch('https://mb-puff.vercel.app/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookieString
      },
      body: loginFormData.toString()
    });
    
    const loginData = await loginRes.json();
    console.log("Login successful:", loginData.url ? "Yes" : "No");
    
    let newCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [loginRes.headers.get('set-cookie')];
    cookieString = newCookies.map(c => c.split(';')[0]).join('; ');

    // 3. Upload File
    console.log("Attempting upload...");
    const fd = new FormData();
    const dummyBlob = new Blob(['test image data for redeploy check'], { type: 'image/png' });
    fd.append('files', dummyBlob, 'test-redeploy-check.png');

    const uploadRes = await fetch('https://mb-puff.vercel.app/api/admin/uploads/products', {
      method: 'POST',
      headers: {
        'Cookie': cookieString
      },
      body: fd
    });

    console.log("Upload Status:", uploadRes.status);
    console.log("Upload Response:", await uploadRes.text());
  } catch (err) {
    console.error("Error:", err);
  }
}
testUpload();
