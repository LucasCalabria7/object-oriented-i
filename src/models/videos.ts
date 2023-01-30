export class Videos {
    constructor(
        private id: string,
        private title: string,
        private duration: number,
        private createdAt: string
    ){}

    public getCreatedAt(): string {
        return this.createdAt;
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value;
    }
    public getDuration(): number {
        return this.duration;
    }
    public setDuration(value: number): void {
        this.duration = value;
    }
    public getTitle(): string {
        return this.title;
    }
    public setTitle(value: string): void {
        this.title = value;
    }
    public getId(): string {
        return this.id;
    }
    public setId(value: string): void {
        this.id = value;
    }
}