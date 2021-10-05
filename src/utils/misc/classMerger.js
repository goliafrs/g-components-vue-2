import { isObjectNotEmpty } from '../validators'

export function classMerger(sourceClass, ...restClasses) {
  if (typeof sourceClass === 'string') {
    sourceClass = [ sourceClass ]
  }

  restClasses.forEach(anyTypeOfClass => {
    if (typeof anyTypeOfClass === 'string') {
      anyTypeOfClass = [ anyTypeOfClass ]
    }
    if (Array.isArray(anyTypeOfClass)) {
      if (Array.isArray(sourceClass)) {
        sourceClass.push(...anyTypeOfClass)
      } else if (isObjectNotEmpty(sourceClass)) {
        anyTypeOfClass.forEach(className => {
          sourceClass[className] = true
        })
      }
    }
    if (isObjectNotEmpty(anyTypeOfClass)) {
      Object.keys(anyTypeOfClass).forEach(className => {
        if (anyTypeOfClass[className] === true) {
          if (Array.isArray(sourceClass)) {
            sourceClass.push(className)
          } else if (isObjectNotEmpty(sourceClass)) {
            sourceClass[className] = true
          }
        }
      })
    }
  })

  return sourceClass
}

export default { classMerger }
