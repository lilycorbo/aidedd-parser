

import { JSDOM } from 'jsdom';
const dom = new JSDOM();
const parser = new dom.window.DOMParser();

export async function fetchGuts(url: string, selectItems: string[]): Promise<Document> {
    let bodyData = new URLSearchParams({
        l: 'en',
        type: 'R',
        generate: 'GENERATE'
    })
    for (let item of selectItems) {
        bodyData.append('select_item[]', `'${item}'`);
    }

    return fetch(url, {
        method: 'POST',
        body: bodyData,
    })
    .then(resp => {
        if (resp.status === 200) {
            return resp.text();
        }
        throw new Error(`Bad Response - ${resp.status} ${resp.statusText}`);
    })
    .then(text => {
        return parser.parseFromString(text, 'text/html');
    });
}