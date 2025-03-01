export type ProjectType = {
    id?: number,
    createdAt?: string,
    status?: string,
    title: string,
    link: string,
    tags: string[],
    description: string,
    background: string,
    type: 'project' | 'Open Source',
}

export type ArticleType = {
    id?: number,
    title: string,
    link: string,
    createdAt?: string,
    isPinClicked?: boolean,
    description?: string,
}

export type GuestBookType = {
    id?: number,
    name: string;
    message: string;
    createdAt?: string;
    website?: string;
};


export type SettingsType = {
    server: {
        port: number,
        host: string,
    },
    configuration: {
        githubURL: string,
        adminDashboard: boolean,
        multipleThemes: boolean,
        enableSearch: boolean,
        searchModels: Array<'projects' | 'guestbooks' | 'articles' | 'posts'>,
    },
    theme: {
        defaultTheme: 'dark' | 'light'
    },
    security: {
        debug: boolean,
        adminFingerprintSignature: string
    }
}