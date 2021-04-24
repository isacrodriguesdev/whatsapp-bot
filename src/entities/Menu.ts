
export class Menu {
    constructor(
        public readonly id: string,
        public order: number | string,
        public title: string,
        public message: string,
        public readonly created_at: Date,
        public file: string,
        public is_attendment: boolean,
        public department_id: string,
        public type: string,
        public children: string,
        public readonly bot_uid: string,
        public active: boolean,
        public photo: string,
        public location: string,
    ) { }
}








