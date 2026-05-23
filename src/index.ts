
import { fetchSpells, fetchFeats } from './fetch';
import { parseFeats, parseSpells } from './parse';
import parseArgs from 'minimist';
import * as fs from 'fs';
import path from 'path';

const OUT_PATH = 'out/';

export async function spells(useLocal: boolean = false): Promise<Spells.Spell[]> {
    if (useLocal && fs.existsSync(path.resolve(OUT_PATH, 'spells.json'))) {
        let text = fs.readFileSync(path.resolve(OUT_PATH, 'spells.json'), { encoding: 'utf8' });
        let spells = JSON.parse(text);
        return spells;
    }
    const spellsDoc = await fetchSpells();
    const spells = await parseSpells(spellsDoc);
    return spells;
}

export async function feats(useLocal: boolean = false): Promise<Feats.Feat[]> {
    if (useLocal && fs.existsSync(path.resolve(OUT_PATH, 'feats.json'))) {
        let text = fs.readFileSync(path.resolve(OUT_PATH, 'feats.json'), { encoding: 'utf8' });
        let spells = JSON.parse(text);
        return spells;
    }
    const featsDoc = await fetchFeats();
    const feats = await parseFeats(featsDoc);
    return feats;
}

async function main() {
    let args = parseArgs(process.argv.slice(2));
    let result: any;
    if (args.spells) {
        result = await spells(args.local ?? false);
    } else if (args.feats) {
        result = await feats(args.local ?? false);
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