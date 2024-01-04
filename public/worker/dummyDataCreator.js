self.importScripts(
    'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/typescript/5.3.3/typescript.min.js'
)
self.importScripts('./dummyImports.js')

self.onmessage = (e) => {
    const { data } = e

    const { name, value } = data

    console.log('worker received data', data)

    console.log('worker', name, value)

    const generator = new dummyDataCreator.DataGraphGenerator()
    generator.build(value)

    console.log(generator.types, generator.map)

    const dummyData = new dummyDataCreator.DummyDataCreator(
        generator.map,
        generator.types
    )

    const dummy = dummyData.createDummyData(name)
    self.postMessage(dummy)
}
