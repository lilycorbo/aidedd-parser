
import { gfm } from '@truto/turndown-plugin-gfm';
import TurndownService from 'turndown';
const turndown = new TurndownService();
turndown.use(gfm);

export async function parseFeats(doc: Document): Promise<Feats.Feat[]> {
    let blocs = doc.getElementsByClassName('bloc');
    return Array.from(blocs).map(parseFeat).sort();
}

function parseFeat(bloc: Element): Feats.Feat {
    let name = getName(bloc);
    let [type, prereq] = getType(bloc);
    let [description, repeat] = getDescription(bloc);

    return {
        name,
        type,
        prereq,
        repeat,
        description,
    } as Feats.Feat;
}


/** Gets the feats name */
function getName(bloc: Element): string {
    return bloc.getElementsByTagName('h1')[0]?.textContent ?? 'Unable to find feat name';
}


/** Gets the feat type and prerequisite string */
function getType(bloc: Element): [Feats.Type, string | undefined] {
    let typeString = bloc.getElementsByClassName('prerequis')[0]?.textContent ?? '';
    let [type, prereq] = typeString.split(' (');
    if (prereq) {
        prereq = prereq.slice(0, prereq.length - 1);
    }

    return [type as Feats.Type, prereq];
}


/** Gets the feat description converted to Markdown, and repeatability string */
function getDescription(bloc: Element): [string, string | undefined] {
    let descriptionBlock = bloc.getElementsByClassName('description')[0]?.innerHTML ?? 'Desctiption unavailable';
    descriptionBlock = `<div>${descriptionBlock}</div>`;
    let markdown = turndown.turndown(descriptionBlock);
    let [description, repeat] = markdown.split('**Repeatable**. ');
    
    return [description!, repeat];
}