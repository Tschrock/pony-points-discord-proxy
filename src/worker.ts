import { Router, Method, Params } from 'tiny-request-router';
declare const PONY_POINTS_API_SECRET: string;

const app = new Router<(request: Request, params: Params) => Response | Promise<Response>>();

interface WebhookBody {
    id: number;
    count: number;
    event: string;
    granted_at: string;
    links: {
        self: string;
        pone: string;
        granted_by: string;
    };
    message: string;
    occurred_at: string;
}

interface Pone {
    pone: {
        slug: string;
        avatar_url: string;
        joined_at: string;
        links: {
            self: string;
            page: string;
            achievements: string;
            points: string;
            granted_points: string;
        };
        name: string;
        points_count: number;
    };
}

app.post('/webhook/discord/:id/:key', async (request, { id, key }) => {

    const webhookData: WebhookBody = await request.json();

    if (webhookData.event === "app.points.create") {

        const poneData: Pone = await (await fetch(`https://points.horse${webhookData.links.pone}`, { headers: { "Authorization": `Api-Key ${PONY_POINTS_API_SECRET}` } })).json();
        const giverData: Pone = await (await fetch(`https://points.horse${webhookData.links.granted_by}`, { headers: { "Authorization": `Api-Key ${PONY_POINTS_API_SECRET}` } })).json();

        return fetch(`https://discord.com/api/webhooks/${id}/${key}`, {
            method: 'POST',
            headers: {
                "User-Agent": "Pony Points Discord Proxy (https://github.com/tschrock, v1.0.0)",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "content": null,
                "embeds": [
                    {
                        "title": `${giverData.pone.name} gave ${poneData.pone.name} ${webhookData.count} good pone point${ webhookData.count > 1 ? 's' : '' }!`,
                        "description": webhookData.message,
                        "url": `https://points.horse${poneData.pone.links.page}`,
                        "color": 5814783,
                        "thumbnail": {
                            "url": `https://points.horse${poneData.pone.avatar_url}`
                        }
                    }
                ]
            })
        });
    }
    else {
        return new Response("", { status: 200, statusText: "OK" });
    }

});

app.get('/', _ => new Response(
    `<p>Hello World!</p>`,
    {
        status: 200,
        statusText: "Ok",
        headers: {
            "Content-Type": "text/html; charset=utf-8"
        }
    }
)
);

addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    const match = app.match(event.request.method as Method, requestUrl.pathname);
    if (match) {
        event.respondWith(match.handler(event.request, match.params));
    }
    else {
        event.respondWith(new Response("The resource you requested could not be found.", {
            status: 404,
            statusText: "Not Found"
        }));
    }
});
