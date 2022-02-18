export class Rfc4514 {
    public static LEAD_CHARS = [' ', '#'];
    public static LEAD_REPLACEMENTS = ['\\20', '\\22'];
    public static TRAIL_CHARS = [' '];
    public static TRAIL_REPLACEMENTS = ['\\20'];
    public static INNER_CHARS = [/\\/g, /"/g, /\+/g, /,/g, /;/g, /</g, /=/g, />/g];
    public static INNER_REPLACEMENTS = ['\\5C', '\\22', '\\2b', '\\2c', '\\3b', '\\3c', '\\3d', '\\3e'];

    public escape(subject: string): string {
        let prefix = '';
        let suffix = '';
        const str_replace = (search: string[] | RegExp[], replace: string[], target: string): string => {
            let fixedTarget = target;
            search.forEach((from, index) => {
                fixedTarget = fixedTarget.replace(from, replace[index]);
            });
            return fixedTarget;
        };
        const firstChar = subject.substring(0, 1);
        if (Rfc4514.LEAD_CHARS.includes(firstChar)) {
            prefix = str_replace(Rfc4514.LEAD_CHARS, Rfc4514.LEAD_REPLACEMENTS, firstChar);
            subject = subject.substring(1);
        }

        const lastChar = subject.slice(-1);
        if (Rfc4514.TRAIL_CHARS.includes(lastChar)) {
            suffix = str_replace(Rfc4514.TRAIL_CHARS, Rfc4514.TRAIL_REPLACEMENTS, lastChar);
            subject = subject.slice(0, -1);
        }

        return `${prefix}${str_replace(Rfc4514.INNER_CHARS, Rfc4514.INNER_REPLACEMENTS, subject)}${suffix}`;
    }

    public escapeRecord(values: Record<string, string>): string {
        return Object.entries(values)
            .map(([name, value]): string => {
                return `${this.escape(name)}=${this.escape(value)}`;
            })
            .join(',');
    }
}
