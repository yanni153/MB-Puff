export function serializePrisma(data: any): any {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
}
