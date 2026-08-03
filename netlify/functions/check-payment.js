exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) };
    }

    const { order_nsu, transaction_nsu, slug } = body;

    if (!order_nsu || !transaction_nsu) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltam dados do pedido' }) };
    }

    const res = await fetch('https://api.checkout.infinitepay.io/payment_check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle: 'gabrielfreire98',
        order_nsu: order_nsu,
        transaction_nsu: transaction_nsu,
        slug: slug
      })
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
      body: JSON.stringify({ error: 'Erro ao verificar pagamento', details: err.message, stack: err.stack })
    };
  }
};
