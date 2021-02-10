import { Point } from "./Point";
import { WebhookEventBase } from "./WebhookEventBase";

export interface PointsReceiveEvent extends WebhookEventBase {
    event: "app.points.receive";
    point: Point;
}
