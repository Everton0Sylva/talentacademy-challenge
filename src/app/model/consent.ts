export interface IConsent {
    id: number;
    name: string;
    email: string;
    consents: {
        newsletter: boolean;
        ads: boolean;
        anonymous: boolean;
    };
}


export class Consent implements IConsent {
    id: number;
    name: string;
    email: string;
    consents: {
        newsletter: boolean;
        ads: boolean;
        anonymous: boolean;
    };

    constructor(data: any = null) {
        this.id = data?.id ?? 0;
        this.name = data?.name ?? '';
        this.email = data?.email ?? '';
        this.consents = data?.consents ? {
            newsletter: data?.consents?.newsletter ?? false,
            ads: data?.consents?.ads ?? false,
            anonymous: data.consents.anonymous ?? false
        } : {
            newsletter: false,
            ads: false,
            anonymous: false
        };
    }
}