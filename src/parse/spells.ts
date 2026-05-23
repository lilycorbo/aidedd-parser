
import * as Spells from '../Spells';
import { gfm } from '@truto/turndown-plugin-gfm';
import TurndownService from 'turndown';
const turndown = new TurndownService();
turndown.use(gfm);

export async function parseSpells(doc: Document): Promise<Spells.Spell[]> {
    let blocs = doc.getElementsByClassName('bloc');
    return Array.from(blocs).map(parseBloc).sort();
}

function parseBloc(bloc: Element): Spells.Spell {
    let name = getName(bloc);
    let [level, school, classes] = getSchoolParts(bloc);
    let [time, ritual, trigger] = getCastingParts(bloc);
    let range = getRange(bloc);
    let [components, materials] = getComponents(bloc);
    let [duration, concentration] = getDuration(bloc);
    let description = getDescription(bloc);

    return {
      name,
      level,
      school,
      classes,
      castingTime: time,
      ritual,
      trigger,
      components,
      materials,
      range,
      duration,
      concentration,
      description
    } as Spells.Spell;
}

/** Gets the spell name */
function getName(bloc: Element): string {
  return bloc.getElementsByTagName('h1')[0]?.textContent ?? 'Unable to find spell name';
}


/** Gets the spell's level, school, and classes that can learn it */
function getSchoolParts(bloc: Element): [Spells.Level, Spells.School, Spells.Class[]] {
  let schoolRegex = /Level (\d) (\w+) \(([\w, ]+)\)/;
  let schoolString = bloc.getElementsByClassName('ecole')[0]?.textContent ?? '';
  let [_, level, school, classes] = schoolString.match(schoolRegex) ?? ['', '', '', ''];

  return [
    Number(level) as Spells.Level,
    (school ?? 'Conjuration') as Spells.School,
    (classes ?? '').split(', ') as Spells.Class[]
  ];
}


/** Gets the info related to casting the spell */
function getCastingParts(bloc: Element): [Spells.CastingTime, boolean, string | undefined] {
  let time: Spells.CastingTime;
  let ritual: boolean = false;
  let trigger: string | undefined;
  // Casting Time and Ritual
  time = bloc.getElementsByClassName('t')[0]?.textContent.split(': ')[1] ?? '';
  if (time.endsWith('or Ritual')) {
    ritual = true;
    time = time.split(' or Ritual')[0]!;
  }
  // Casting Time and Trigger
  if (time.includes('ction, which')) {
    let [action, triggerPart] = time.split(/, /);
    time = action!;
    trigger = triggerPart;
  }

  return [
    time,
    ritual,
    trigger
  ];
}


/** Gets the spell's range */
function getRange(bloc: Element): string {
  return bloc.getElementsByClassName('r')[0]?.textContent.split(': ')[1] ?? '';
}


/** Gets the spell components and materials */
function getComponents(bloc: Element): [Spells.Component[], string?] {
  let components: Spells.Component[];
  let materials: any;
  let componentString = bloc.getElementsByClassName('c')[0]?.textContent.split(': ')[1];
  let componentParts = componentString!.split(' (');
  components = componentParts[0]!.split(', ').map(x => x.toUpperCase()) as Spells.Component[];
  if (componentParts[1]) {
    materials = componentParts[1].slice(0, -1);
  }

  return [components, materials];
}


/** Gets the spell's duration and if it requires concentration */
function getDuration(bloc: Element): [string, boolean] {
  let duration: string = bloc.getElementsByClassName('d')[0]?.textContent.split(': ')[1] ?? '';
  let concentration: boolean = false;
  if (duration.startsWith('Concentration,')) {
    concentration = true;
    duration = duration.split(', ')[1]!;
  }

  return [duration, concentration];
}


/** Gets the spell description, styled using Markdown */
function getDescription(bloc: Element): string {
  let desc = bloc.getElementsByClassName('description')[0]?.innerHTML ?? 'Description unavailable';
  let descHTML = `<div>${desc}</div>`;
  let markdown = turndown.turndown(descHTML);

  return markdown;
}