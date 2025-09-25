import { Hono } from 'hono';
type Bindings = {
    CACHE?: any;
    JWT_SECRET?: string;
    DATABASE_URL?: string;
};
declare const app: Hono<{
    Bindings: Bindings;
}, {}, "/">;
export default app;
//# sourceMappingURL=index.d.ts.map