export declare const createConfig: (env: any) => {
    env: any;
    port: number;
    host: any;
    database: {
        url: any;
        poolSize: number;
    };
    jwt: {
        secret: any;
        expiresIn: any;
        refreshExpiresIn: any;
    };
    security: {
        bcryptRounds: number;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    cors: {
        origin: any;
        credentials: boolean;
    };
    logging: {
        level: any;
        format: any;
    };
    redis: {
        url: any;
    };
    smtp: {
        host: any;
        port: number;
        user: any;
        pass: any;
    };
    coreBanking: {
        apiUrl: any;
        apiKey: any;
        timeout: number;
    };
    monitoring: {
        sentryDsn: any;
        newRelicLicenseKey: any;
    };
};
export declare const validateConfig: (config: ReturnType<typeof createConfig>) => void;
//# sourceMappingURL=index.d.ts.map