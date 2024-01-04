export async function initialize({ port }) {
  port.on('message', (data) => {
    console.log(data)
  })
}
