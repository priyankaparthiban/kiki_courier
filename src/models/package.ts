export class Package {
    constructor(
        public id: string,
        public weight: number,
        public distance: number,
        public offerCode: string | null = null
    ) { }
}
