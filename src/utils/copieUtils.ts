export function copieUtils<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as unknown as T;
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj) as unknown as T;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => copieUtils(item)) as unknown as T;
    }

    const copiedObj = {} as T;

    for (const key in obj) {
        const value = obj[key];
        copiedObj[key] = copieUtils(value);
    }

    return copiedObj;
}
