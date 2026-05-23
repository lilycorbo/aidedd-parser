
export interface Spell {
    name: string;               // The name of the spell
    level: Level;               // The spell's level
    school: School;             // Which school of magic the spell belongs to
    classes: Class[];           // Which character classes gain access to this spell
    castingTime: CastingTime;   // How long the spell takes to cast
    ritual: boolean;            // If the spell can be cast as a ritual
    trigger?: string;           // What trigger allows the spell to be cast
    duration: string;           // How long the spell lasts
    concentration: boolean;     // Whether the spell requires concentration
    range: string;              // The spells range
    components: Component[];    // V-erbal, S-omatic, and M-aterial component flags
    materials: string;          // Material components required for the spell
    description: string;        // Markdown of the spell description
}

export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type School = 
    | 'Abjuration' 
    | 'Conjuration' 
    | 'Divination' 
    | 'Enchantment' 
    | 'Evocation'
    | 'Illusion' 
    | 'Necromancy' 
    | 'Transmutation';

export type Class = 
    | 'Bard' 
    | 'Barbarian' 
    | 'Cleric' 
    | 'Druid' 
    | 'Paladin' 
    | 'Ranger' 
    | 'Sorcerer' 
    | 'Warlock' 
    | 'Wizard';

export type Action = 'Action' | 'Bonus Action' | 'Reaction';

export type CastingTime = Action | string;

export type Component = 'V' | 'S' | 'M';