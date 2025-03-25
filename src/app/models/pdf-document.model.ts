export class PdfDocument {
    constructor(
        public fileName: string,
        public filePath: string,
        public title: string,
        public author: string = 'Unknown',
        public subject: string = '',
        public keywords: string[] = [],
        public created: Date = new Date(),
        public modified: Date = new Date(),
        public pageCount: number = 1,
        public fileSize: string = '0 KB'
    ) {}

    static fromJson(json: any): PdfDocument {
        return new PdfDocument(
            json.fileName || '',
            json.filePath || '',
            json.title || '',
            json.author || 'Unknown',
            json.subject || '',
            json.keywords || [],
            json.created ? new Date(json.created) : new Date(),
            json.modified ? new Date(json.modified) : new Date(),
            json.pageCount || 1,
            json.fileSize || '0 KB'
        );
    }

    toJson(): any {
        return {
            fileName: this.fileName,
            filePath: this.filePath,
            title: this.title,
            author: this.author,
            subject: this.subject,
            keywords: this.keywords,
            created: this.created,
            modified: this.modified,
            pageCount: this.pageCount,
            fileSize: this.fileSize
        };
    }
} 