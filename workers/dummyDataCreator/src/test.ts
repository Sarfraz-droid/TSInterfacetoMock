// import { Person } from "./types"
import { DataGraphGenerator } from './DataGraphGenerator'
import fs from 'fs'
import { DummyDataCreator } from './DummyDataCreator'
import logger from 'logger'
import path from 'path'

const dirPrefix = 'workers\\dummyDataCreator\\src'

const LOGPATH = {
    development: path.resolve(dirPrefix, 'development.log'),
    result: path.resolve(dirPrefix, 'result.log'),
    map: path.resolve(dirPrefix, 'map.log'),
}

export const log = logger.createLogger(LOGPATH.development)
export const resultLog = logger.createLogger(LOGPATH.result)
export const mapLog = logger.createLogger(LOGPATH.map)

const main = async () => {
    console.log(path.resolve())
    const types = fs.readFileSync(
        path.resolve(dirPrefix, './dummy.ts'),
        'utf-8'
    )

    if (fs.existsSync(LOGPATH.development)) fs.rmSync(LOGPATH.development)

    if (fs.existsSync(LOGPATH.result)) fs.rmSync(LOGPATH.result)

    const generator = new DataGraphGenerator()

    generator.build(types)

    const arr = generator.toJSON()

    mapLog.log(generator.types as any)

    fs.writeFileSync(path.resolve('./dummy.json'), JSON.stringify(arr, null, 2))

    const dummyData = new DummyDataCreator(generator.map, generator.types)
    resultLog.log(dummyData.createDummyData('TaskInfo'))
}

main()
