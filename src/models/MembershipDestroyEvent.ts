import { Group } from "./Group";
import { WebhookEventBase } from "./WebhookEventBase";

export interface MembershipDestroyEvent extends WebhookEventBase {
    event: "app.memberships.destroy";
    group: Group;
    member: Pone;
}
