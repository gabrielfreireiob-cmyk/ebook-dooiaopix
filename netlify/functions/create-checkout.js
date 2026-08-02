exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const host = event.headers['x-forwarded-host'] || event.headers.host;
  const redirectUrl = 'https://' + host + '/obrigado.html';
  const orderNsu = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + '-' + Math.random().toString(36).slice(2));

  const payload = {
    handle: 'gabrielfreire98',
    redirect_url: redirectUrl,
    order_nsu: orderNsu,
    items: [
      { quantity: 1, price: 4700, description: 'Ebook - Do oi quanto custa ao Pix na sua conta' }
    ]
  };

  try {
    const res = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Erro ao criar checkout', details: err.message })
    };
  }
};
