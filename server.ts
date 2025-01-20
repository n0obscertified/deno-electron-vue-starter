import { Application, send } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

const app = new Application();

async function serve() {
    // Serve Vite build output or development server
    app.use(async (ctx) => {

        // In production, serve the built files from 'dist'
        try {
          await send(ctx, ctx.request.url.pathname, {
            root: join(Deno.cwd(), "vue/"),
            index: "index.html",
          });
        } catch {
          // Fallback to index.html for SPA routing
          await send(ctx, "/", {
            root: join(Deno.cwd(), "vue/"),
            index: "index.html",
          });
        }
    });
    
    return await app.listen({ port: 8000 });
}

export default serve;