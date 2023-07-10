export class Rfc4514 {
    public static LeadChars = [' ', '#'];

    public static LeadReplacements = ['\\20', '\\22'];

    public static TrailChars = [' '];

    public static TrailReplacements = ['\\20'];

    public static InnerChars = [
        /\\/g,
        /"/g,
        /\+/g,
        /,/g,
        /;/g,
        /</g,
        /=/g,
        />/g,
    ];

    public static InnerReplacements = [
        '\\5C',
        '\\22',
        '\\2b',
        '\\2c',
        '\\3b',
        '\\3c',
        '\\3d',
        '\\3e',
    ];

    public escape(subject: string): string {
        let prefix = '';
        let suffix = '';
        const stringReplace = (
            search: string[] | RegExp[],
            replace: string[],
            target: string
        ): string => {
            let fixedTarget = target;
            for (const [index, from] of search.entries()) {
                fixedTarget = fixedTarget.replace(from, replace[index]);
            }

            return fixedTarget;
        };

        const firstChar = subject.slice(0, 1);
        if (Rfc4514.LeadChars.includes(firstChar)) {
            prefix = stringReplace(
                Rfc4514.LeadChars,
                Rfc4514.LeadReplacements,
                firstChar
            );
            subject = subject.slice(1);
        }

        const lastChar = subject.slice(-1);
        if (Rfc4514.TrailChars.includes(lastChar)) {
            suffix = stringReplace(
                Rfc4514.TrailChars,
                Rfc4514.TrailReplacements,
                lastChar
            );
            subject = subject.slice(0, -1);
        }

        return `${prefix}${stringReplace(
            Rfc4514.InnerChars,
            Rfc4514.InnerReplacements,
            subject
        )}${suffix}`;
    }

    public escapeRecord(values: Record<string, string>): string {
        return Object.entries(values)
            .map(
                ([name, value]): string =>
                    `${this.escape(name)}=${this.escape(value)}`
            )
            .join(',');
    }
}
