export class GithubRepo {
    constructor(
        public repoName: string,
        public repoDescription: string,
        public repoURL: string,
        public repoImage?: string // Optional parameter for repository image
    ) {}

    // Static method to create a GithubRepo instance from a plain object
    static fromJson(json: any): GithubRepo {
        return new GithubRepo(
            json.repoName || '',
            json.repoDescription || '',
            json.repoURL || '',
            json.repoImage
        );
    }

    // Method to convert the instance to a plain object
    toJson(): any {
        return {
            repoName: this.repoName,
            repoDescription: this.repoDescription,
            repoURL: this.repoURL,
            repoImage: this.repoImage
        };
    }
} 