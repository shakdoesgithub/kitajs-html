import Html from './index'
import { setTimeout } from 'timers/promises'
import http from 'http'
import {
  SUSPENSE_ROOT,
  Suspense,
  SuspenseScript,
  renderToStream
} from './suspense'

async function WaitFor({ s }: { s: number }) {
  await setTimeout(Number(s) * 1000)
  return <div>Loaded after: {s}s</div>
}

function render(rid: number) {
  return (
    <>
      <html>
        <head>{SuspenseScript}</head>
        <body>
          <div>Hello</div>

          <Suspense rid={rid} fallback={<div>loading 2s</div>}>
            <div style="color: red">
              <WaitFor s={1} />
            </div>
            <div style="color: red">
              <WaitFor s={1} />
            </div>
          </Suspense>

          <div>World</div>

          <Suspense rid={rid} fallback={<div>loading 3s</div>}>
            <div style="color: green">
              <WaitFor s={3} />
            </div>
            <div style="color: green">
              <WaitFor s={3} />
            </div>
          </Suspense>

          <div>World</div>

          <Suspense rid={rid} fallback={<div>loading 2s</div>}>
            <div style="color: blue">
              <WaitFor s={2} />
            </div>
            <div style="color: blue">
              <WaitFor s={2} />
            </div>
          </Suspense>

          <div>World</div>

          <Suspense rid={rid} fallback={<div>loading random</div>}>
            <div style="color: green">
              <WaitFor s={3} />
            </div>
            <div style="color: green">
              <WaitFor s={4.5} />
            </div>
          </Suspense>

          <div>World</div>
        </body>
      </html>
    </>
  )
}

  renderToStream(render).pipe(process.stdout)
 
// function streamToString(stream) {
//   return new Promise((res) => {
//     let str = ''
//     stream.on('data', (chunk) => {
//       str += chunk
//     })
//     stream.on('end', () => res(str))
//   })
// }

http
  .createServer((req, res) => {
    if (req.url === '/') {
      renderToStream(render).pipe(res)
      return
    }

    // Ends the response manually
    res.end()
  })
  .listen(8080, () => {
    console.log('http://localhost:8080')

    // setInterval(() => {
    //   console.log(SUSPENSE_ROOT)
    // }, 500)
  })
