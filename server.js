import { serveFile, serveDir } from "https://deno.land/std/http/file_server.ts";

async function handle(req) {
    const pathname = new URL(req.url).pathname;

    if (pathname === "/about") return serveFile(req, "./web/about.html")
    if (pathname === "/coding") return serveFile(req, "./web/projects.html")
    if (pathname === "/maps") return serveFile(req, "./web/maps.html")

    if (pathname === "/nocors/") {
        const url = new URL(req.url);
        const target = url.searchParams.get('url');

        if (!target) {
            return new Response('Missing ?url= parameter', { status: 400 });
        }

        const response = await fetch(target);

        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');

        return new Response(response.body, {
            status: response.status,
            headers,
        });
    }


    // ---- Static files ----
    return serveDir(req, {
        fsRoot: "web",
        urlRoot: "",
    });
}

if (import.meta.main) {
    console.log("Starting server...")
    Deno.serve(handle, { port: Deno.env.get("PORT") || 3000 });
}

// app.get('/', serveStatic({ path: "./web/index.html" }))
// app.get('/about', serveStatic({ path: "./web/about.html" }))
// app.get('/coding', serveStatic({ path: "./web/projects.html" }))
// app.get('/maps', serveStatic({ path: "./web/maps.html" }))