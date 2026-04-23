export declare class HealthController {
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
    };
    getHealthById(id: number): {
        status: string;
        checkId: number;
    };
}
