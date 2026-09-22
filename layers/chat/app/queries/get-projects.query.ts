import { requestProjects } from '../gateways/project.gateway'

export const useGetProjectsQuery = () =>
  useAsyncData(
    'projects',
    requestProjects,
    {
      immediate: false,
      default: () => [],
    },
  )
