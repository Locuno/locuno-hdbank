import { Hono } from 'hono';
type Bindings = {
    USER_PROFILE_DO: any;
    JWT_SECRET?: string;
    [key: string]: any;
};
declare const auth: Hono<{
    Bindings: Bindings;
}, {}, "/">;
export { auth as authRoutes };
//# sourceMappingURL=auth.d.ts.map