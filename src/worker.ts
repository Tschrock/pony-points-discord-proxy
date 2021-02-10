import { Router, Method, Params } from 'tiny-request-router';
import { WebhookEvent } from './models/WebhookEvent';

declare const PONY_POINTS_API_SECRET: string;

const app = new Router<(request: Request, params: Params) => Response | Promise<Response>>();

app.post('/webhook/discord/:id/:key', async (request, { id, key }) => {

    const webhookData: WebhookEvent = await request.json();

    switch (webhookData.event) {
        case "app.points.receive":

            const pointData = webhookData.point
            const poneData: Pone = await (await fetch(`https://points.horse${pointData.links.pone}`, { headers: { "Authorization": `Api-Key ${PONY_POINTS_API_SECRET}` } })).json();
            const giverData: Pone = await (await fetch(`https://points.horse${pointData.links.granted_by}`, { headers: { "Authorization": `Api-Key ${PONY_POINTS_API_SECRET}` } })).json();

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
                            "title": `${giverData.pone.name} gave ${poneData.pone.name} ${pointData.count} good pone point${pointData.count > 1 ? 's' : ''}!`,
                            "description": pointData.message,
                            "url": `https://points.horse${poneData.pone.links.page}`,
                            "color": 5814783,
                            "thumbnail": {
                                "url": `https://points.horse${poneData.pone.avatar_url}`
                            }
                        }
                    ],
                    "username": "Pony Points",
                    "avatar_url": "https://derpicdn.net/img/view/2017/8/1/1500461.png"
                })
            });
        default:
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
