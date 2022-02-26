import { Router } from 'express'
import type { Application } from 'express'
import type Route from '../structure/Route'
import type Methods from '../types/Methods'
import path from 'path'
import fs from 'fs'

const createRoutes = async (dirPath: string, app: Application, mainFolderName: string) => {
  const resolvedPath = path.resolve('./', dirPath)
  const files = fs.readdirSync(resolvedPath, { withFileTypes: true })

  for (const file of files) {
    if (file.isDirectory()) {
      const router = Router()
      const filesAndFolders = fs.readdirSync(`${resolvedPath}/${file.name}`, {
        withFileTypes: true,
      })

      const directoryFiles = filesAndFolders.filter(dirent => !dirent.isDirectory())
      const nestedDirectories = filesAndFolders.filter(dirent => dirent.isDirectory())

      for (const { name } of directoryFiles) {
        const content = await import(`${resolvedPath}/${file.name}/${name}`)
        const { params, withAuthorization, authorization, execute }: Route = content['default']

        const [fileName, method] = name.split('.')
        const paramsPath = params ? `:${params.join('/:')}` : ''

        if (withAuthorization) {
          router[method as Methods](`/${fileName}/${paramsPath}`, authorization, execute)
        } else {
          router[method as Methods](`/${fileName}/${paramsPath}`, execute)
        }
      }

      app.use(`/${file.name}`, router)

      for (const { name } of nestedDirectories) {
        await createRoutes(`${resolvedPath}/${file.name}/${name}`, app, mainFolderName)
      }
    } else {
      const content = await import(`${resolvedPath}/${file.name}`)
      const { params, withAuthorization, authorization, execute }: Route = content['default']

      const [fileName, method] = file.name.split('.')
      const nestedPath = resolvedPath.split(mainFolderName)[1]
      const paramsPath = params ? `:${params.join('/:')}` : ''
      const path = `${nestedPath && nestedPath}/${fileName}`

      if (withAuthorization) {
        app[method as Methods](`${path}/${paramsPath}`, authorization, execute)
      } else {
        app[method as Methods](`${path}/${paramsPath}`, execute)
      }
    }
  }
}

export default createRoutes
