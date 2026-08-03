const crypto = require('crypto');

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const host = event.headers['x-forwarded-host'] || event.headers.host;
    const redirectUrl = 'https://' + host + '/obrigado.html';
    const orderNsu = crypto.randomUUID();

    const payload = {
      handle: 'gabrielfreire98',
      redirect_url: redirectUrl,
      order_nsu: orderNsu,
      items: [
        { quantity: 1, price: 4700, description: 'Método - Do oi quanto custa ao Pix na sua conta' }
      ]
    };

    const res = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Resposta inesperada da InfinitePay', raw: text })
      };
    }

    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Erro ao criar checkout', details: err.message, stack: err.stack })
    };
  }
};
