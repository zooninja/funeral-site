// Cloudflare Pages Function - Contact Form Handler
export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Get client IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    
    // Rate limiting - 5 requests per hour per IP
    const rateKey = `rate:${ip}`;
    const currentCount = await env.KV.get(rateKey);
    
    if (currentCount && parseInt(currentCount) >= 5) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Твърде много заявки. Моля опитайте след 1 час.' 
        }), 
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Parse form data
    const formData = await request.formData();
    const turnstileToken = formData.get('cf-turnstile-response');
    
    // Verify Cloudflare Turnstile
    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET,
          response: turnstileToken,
          remoteip: ip
        })
      }
    );
    
    const outcome = await verifyResponse.json();
    
    if (!outcome.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Verification failed. Моля опреснете страницата.' 
        }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Input sanitization
    const sanitize = (str) => {
      if (!str) return '';
      return str.toString().replace(/[<>]/g, '').trim().substring(0, 500);
    };
    
    // Extract and validate data
    const data = {
      name: sanitize(formData.get('name')),
      phone: sanitize(formData.get('phone')),
      email: sanitize(formData.get('email')),
      message: sanitize(formData.get('message')),
      timestamp: new Date().toISOString(),
      ip: ip,
      userAgent: request.headers.get('User-Agent')
    };
    
    // Validation
    if (!data.name || data.name.length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: 'Невалидно име' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!data.phone || !/^[0-9]{10,15}$/.test(data.phone.replace(/\s/g, ''))) {
      return new Response(
        JSON.stringify({ success: false, error: 'Невалиден телефонен номер' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Email notification via Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Сайт <noreply@yourdomain.bg>',
        to: env.NOTIFICATION_EMAIL,
        subject: `Ново запитване от ${data.name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
              <h2 style="color: #c8a882; border-bottom: 2px solid #c8a882; padding-bottom: 10px;">
                Ново запитване от уебсайт
              </h2>
              <div style="background: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
                <p><strong>Име:</strong> ${data.name}</p>
                <p><strong>Телефон:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
                <p><strong>Email:</strong> ${data.email || 'Не е посочен'}</p>
                <p><strong>Съобщение:</strong><br>${data.message || 'Няма съобщение'}</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="font-size: 0.9em; color: #666;">
                  <strong>Дата:</strong> ${new Date(data.timestamp).toLocaleString('bg-BG')}<br>
                  <strong>IP:</strong> ${data.ip}
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    });
    
    if (!emailResponse.ok) {
      console.error('Email send failed:', await emailResponse.text());
    }
    
    // Update rate limit counter
    const newCount = (parseInt(currentCount) || 0) + 1;
    await env.KV.put(rateKey, newCount.toString(), {
      expirationTtl: 3600 // 1 hour
    });
    
    // Log to KV for backup (optional)
    const logKey = `contact:${Date.now()}:${ip}`;
    await env.KV.put(logKey, JSON.stringify(data), {
      expirationTtl: 86400 // 24 hours
    });
    
    return new Response(
      JSON.stringify({ success: true }), 
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Системна грешка. Моля обадете се директно.' 
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
