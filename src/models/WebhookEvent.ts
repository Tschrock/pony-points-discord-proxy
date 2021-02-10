import { MembershipCreateEvent } from "./MembershipCreateEvent";
import { MembershipDestroyEvent } from "./MembershipDestroyEvent";
import { PointsReceiveEvent } from "./PointsReceiveEvent";
import { PointsGiveEvent } from "./PointsGiveEvent";

export type WebhookEvent = MembershipCreateEvent | MembershipDestroyEvent | PointsReceiveEvent | PointsGiveEvent;
