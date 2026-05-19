
declare namespace Feats {
    export interface Feat {
        name: string;           // The name of the feat
        type: Type;             // What type of feat it is
        prereq?: string;        // Any prerequisites to taking the feat
        repeat?: string;        // Whether the feat can be taken repeatedly, and any conditions to that
        description: string;    // Markdown of the feat description
    }

    export type Type =
        | 'Origin Feat'
        | 'General Feat'
        | 'Fighting Style Feat'
        | 'Epic Boon Feat';
}