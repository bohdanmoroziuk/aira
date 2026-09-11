export const useProjects = () => {
  const projects = useState<Project[]>('projects', () => [])

  const createProject = () => {
    const project = {
      id: crypto.randomUUID(),
      name: 'New project',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    projects.value.push(project)

    return project
  }

  return {
    projects,
    createProject,
  }
}
