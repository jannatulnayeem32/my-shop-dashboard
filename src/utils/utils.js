import io from 'socket.io-client'
export const overrideStyle = {
    display: 'flex',
    margin: '0 auto',
    height: '24px',
    justifyContent: 'center',
    alignItems: "center"
}

let production = 'production'
let local = 'local'

let mode = production

let app_url = ""
let api_url = ""

if (mode === production) {
    app_url = 'https://my-shop-dashboard-murex.vercel.app'
    api_url = "https://backend-cxqu.onrender.com"
} else {
    app_url = 'http://localhost:3000'
    api_url = "http://localhost:5000"
}

const socket = io(api_url)

api_url = api_url + '/api'

export { socket, app_url, api_url } 