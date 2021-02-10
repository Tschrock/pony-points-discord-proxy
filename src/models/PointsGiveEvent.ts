import { Point } from "./Point";
import { WebhookEventBase } from "./WebhookEventBase";

export interface PointsGiveEvent extends WebhookEventBase {
    event: "app.points.give";
    point: Point;
}
