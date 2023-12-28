class IdGenerator {
    private static ids: string[] = [];

    private static instance: IdGenerator;

    private constructor() {}

    public static getInstance(): IdGenerator {
        if (!IdGenerator.instance) {
            IdGenerator.instance = new IdGenerator();
        }

        return IdGenerator.instance;
    }

    public static addGeneratedId(newId: string) {
        if (this.ids.indexOf(newId) === -1) {
            this.ids.push(newId);
        }
    }

    public static generateId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        const length = 12;

        let newId: string | null = null;

        while ((newId === null) || (this.ids.indexOf(newId) !== -1)) {
            newId = "";
            let counter: number = 0;
            while (counter < length) {
                newId += characters.charAt(Math.floor(Math.random() * charactersLength));
              counter += 1;
            }
        }
        this.ids.push(newId);

        return newId;
    }
}

export default IdGenerator;