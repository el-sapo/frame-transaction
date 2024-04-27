/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { abi } from './abi-danc3.js'
import { parseEther } from 'viem'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
            : 'Welcome!'}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button value="apples">Apples</Button>,
      <Button.Transaction target='/mint'>Collect</Button.Transaction>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

let contractAddress = '0x6b4FDE96c7de27107585BCf75a391e25418772Ba'
let baseMain = 'eip155:8453'

app.transaction('/mint', (c) => {
  const address = c.address
  // Contract transaction response.
  const amountInWei = parseEther("0.000777"); // Converts 0.000777 Ether to wei using viem's utility function
  console.log(`amount: ${amountInWei}`);
  console.log(`${address}`);
  return c.contract({
    abi,
    chainId: 'eip155:8453',
    functionName: 'mint',
    args: [
      0,  // tier: 0 = forever -  1 = limited
      address, // receiver address
      1 // quantity
    ],
    to: '0x6b4FDE96c7de27107585BCf75a391e25418772Ba',
    value: amountInWei,
  })
})


app.frame('/finish', (c) => {
  const { transactionId } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    )
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
