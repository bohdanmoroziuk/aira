export const useProjects = () => {
  const projects = useState<Project[]>('projects', () => [
    {
      id: 'test',
      name: 'New project',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  const createProject = () => {
    const project = {
      id: generateUuid(),
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
