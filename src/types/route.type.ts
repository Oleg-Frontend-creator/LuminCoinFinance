export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    load?(): void,
    useLayout?: string | false,
    scripts?: string[]
};