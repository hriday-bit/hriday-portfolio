export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
}

export interface ContactPayload { name: string; message: string; }
