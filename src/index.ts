
import { fetchSpells, fetchFeats } from './fetch';
import { parseFeats, parseSpells } from './parse';
import parseArgs from 'minimist';
import * as fs from 'fs';
import path from 'path';

export async function spells(): Promise<Spells.Spell[]> {
    const spellsDoc = await fetchSpells();
    const spells = await parseSpells(spellsDoc);
    return spells;
}

export async function feats() {
    const featsDoc = await fetchFeats();
    const feats = await parseFeats(featsDoc);
    return feats;
}

async function main() {
    let args = parseArgs(process.argv.slice(2));
    let result: any;
    if (args.spells) {
        result = await spells();
    } else if (args.feats) {
        result = await feats();
    }
    if (args.out) {
        let filepath = path.resolve(args.out);
        let { dir } = path.parse(filepath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
    } else {
        console.log(result);
    }
}

main();