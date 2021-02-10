import { Group } from "./Group";
import { WebhookEventBase } from "./WebhookEventBase";

export interface MembershipCreateEvent extends WebhookEventBase {
    event: "app.memberships.create";
    group: Group;
    member: Pone;
}
