const axios = require('axios');
async function test() {
  const input = `Hi there,

We hope you're having a productive week! Here are a few highlights from our latest engineering blog:

1. Optimizing React performance with concurrent features.
2. Best practices for securing your Node.js backend.
3. A deep dive into modern CSS architectures.

You can read the full articles on our official documentation page:
https://developer.mozilla.org/en-US/docs/Web/JavaScript

If you have any feedback or suggestions for future topics, feel free to reply directly to this email.

Best regards,
The Engineering Team`;

  try {
    const res = await axios.post("http://127.0.0.1:8080/api/detection/analyze", { input });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}
test();
