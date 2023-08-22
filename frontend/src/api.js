
let api = 'http://localhost:3000';

export function getVideoUrl(item) {
    const params = new URLSearchParams({
        path: item.fullPath,
    });
    return `${api}/video?${params}`;
}

export async function getList(path) {
    const params = new URLSearchParams({
        path: path,
    });
    const res = await fetch(`${api}/list?${params}`);
    const data = await res.json();
    return data;
}
