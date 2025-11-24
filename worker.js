export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const form = await request.formData();
    const token = form.get("cf-turnstile-response");

    // Verify with Turnstile Siteverify
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,  // set in Worker env vars
          response: token
        })
      }
    );

    const data = await verifyRes.json();

    if (!data.success) {
      return new Response("Turnstile failed", { status: 403 });
    }

    // Redirect to your Professional-Upgrade PDF link
    return Response.redirect(
      "https://drive.google.com/uc?export=download&id=17mXeUHtJv9BA4QYcct0Yj8IOEFyiYmI8",
      302
    );
  }
}
