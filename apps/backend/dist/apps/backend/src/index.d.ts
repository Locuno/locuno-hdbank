import { Hono } from 'hono';
import { UserProfileDO } from './durable-objects/UserProfileDO';
type Bindings = {
    CACHE?: any;
    USER_PROFILE_DO: any;
    JWT_SECRET?: string;
    DATABASE_URL?: string;
};
declare const app: Hono<{
    Bindings: Bindings;
}, {}, "/">;
export { UserProfileDO };
export default app;
//# sourceMappingURL=index.d.ts.map