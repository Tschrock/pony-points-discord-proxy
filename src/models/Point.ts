export interface Point {
    id: number;
    count: number;
    granted_at: string;
    links: {
        self: string;
        pone: string;
        granted_by: string;
    };
    message: string;
}
