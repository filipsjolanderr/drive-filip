export interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  parent: string | null
}

export const mockFiles: FileItem[] = [
  { id: "root", name: "My Drive", type: "folder", parent: null },
  { id: "1", name: "Documents", type: "folder", parent: "root" },
  { id: "2", name: "Images", type: "folder", parent: "root" },
  { id: "3", name: "resume.pdf", type: "file", parent: "1" },
  { id: "4", name: "project_proposal.docx", type: "file", parent: "1" },
  { id: "5", name: "vacation.jpg", type: "file", parent: "2" },
  { id: "6", name: "profile_picture.png", type: "file", parent: "2" },
  { id: "7", name: "Work", type: "folder", parent: "1" },
  { id: "8", name: "presentation.pptx", type: "file", parent: "7" },
]

