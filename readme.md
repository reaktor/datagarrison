package to parse out datagarrison text format

    import { get } from 'datagarrison'
    const centralpark = {user: 1105898, stream: 356136071740874}

    (async (stream) => {
      const data = await get(stream)
      console.dir(data[0])
      console.dir(data[data.length - 1])
    })(centralpark)

see [test.js](./test.js) for usage
