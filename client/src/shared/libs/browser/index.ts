export class Browser {
    private static readonly browserIdKey: string = 'browserId';

    private constructor() { }

    static getId() {
        let browserId = window.localStorage.getItem(this.browserIdKey);
        if (!browserId) {
            const newId = crypto.randomUUID();
            window.localStorage.setItem(this.browserIdKey, newId);
            browserId = newId;
        }
        return browserId;
    }

    static getBrowserInfo(): string {
        const ua = navigator.userAgent;

        // Chrome
        const chrome = ua.match(/Chrome\/(\d+\.\d+)/);
        if (chrome) {
            return `Chrome ${chrome[1]}`;
        }

        // Firefox
        const firefox = ua.match(/Firefox\/(\d+\.\d+)/);
        if (firefox) {
            return `Firefox ${firefox[1]}`;
        }

        // Safari
        const safari = ua.match(/Safari\/(\d+\.\d+)/);
        if (safari) {
            return `Safari ${safari[1]}`;
        }

        return 'Unknown Browser';
    }

    static getOSInfo(): string {
        const ua = navigator.userAgent;

        // Windows
        if (ua.includes('Windows')) {
            const version = ua.match(/Windows NT (\d+\.\d+)/);
            return `Windows ${version ? version[1] : ''}`;
        }

        // macOS
        if (ua.includes('Mac OS X')) {
            const version = ua.match(/Mac OS X (\d+[._]\d+)/);
            return `macOS ${version ? version[1].replace('_', '.') : ''}`;
        }

        // iOS
        if (ua.includes('iPhone') || ua.includes('iPad')) {
            return 'iOS';
        }

        // Android
        if (ua.includes('Android')) {
            const version = ua.match(/Android (\d+\.\d+)/);
            return `Android ${version ? version[1] : ''}`;
        }

        return 'Unknown OS';
    }
};