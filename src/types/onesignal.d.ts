declare module 'react-onesignal' {
  export interface OneSignalOptions {
    appId: string;
    allowLocalhostAsSecureOrigin?: boolean;
    serviceWorkerPath?: string;
    serviceWorkerParam?: {
      scope?: string;
    };
    promptOptions?: {
      slidedown?: {
        prompts: Array<{
          type: string;
          autoPrompt: boolean;
          text: {
            actionMessage: string;
            acceptButton: string;
            cancelButton: string;
          };
        }>;
      };
    };
    origin?: string;
  }

  const OneSignal: {
    init: (options: OneSignalOptions) => Promise<void>;
    showSlidedownPrompt: () => Promise<void>;
    getUserId: () => Promise<string | null>;
    addTag: (key: string, value: string) => Promise<void>;
    getTags: () => Promise<Record<string, string>>;
    // Add other methods as needed
  };

  export default OneSignal;
}

interface Window {
  OneSignal: {
    Notifications: {
      isPushSupported: () => Promise<boolean>;
      requestPermission: () => Promise<boolean>;
      permission: boolean;
      setDefaultUrl: (url: string) => void;
      setDefaultTitle: (title: string) => void;
    };
    User: {
      pushSubscription: {
        id: string;
        token: string;
        optedIn: boolean;
      };
    };
    init: (options: OneSignalOptions) => Promise<void>;
  };
  OneSignalDeferred: Array<(OneSignal: Window['OneSignal']) => void>;
} 