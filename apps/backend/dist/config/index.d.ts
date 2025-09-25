export declare const config: {
    env: string;
    port: number;
    host: string;
    database: {
        url: string;
        poolSize: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    security: {
        bcryptRounds: number;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    cors: {
        origin: string;
        credentials: boolean;
    };
    logging: {
        level: string;
        format: string;
    };
    redis: {
        url: string;
    };
    smtp: {
        host: string;
        port: number;
        user: string;
        pass: string;
    };
    coreBanking: {
        apiUrl: string;
        apiKey: string;
        timeout: number;
    };
    monitoring: {
        sentryDsn: string;
        newRelicLicenseKey: string;
    };
};
//# sourceMappingURL=index.d.ts.map