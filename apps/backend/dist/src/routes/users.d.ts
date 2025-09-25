import { Hono } from 'hono';
type Bindings = {
    USER_PROFILE_DO: any;
    JWT_SECRET?: string;
    [key: string]: any;
};
declare const users: Hono<{
    Bindings: Bindings;
}, {}, "/">;
export { users as userRoutes };
//# sourceMappingURL=users.d.ts.map