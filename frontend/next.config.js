module.exports = {
    serverRuntimeConfig: {
      // Will only be available on the server side
      apiUrl: process.env.NEXT_PUBLIC_URL
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      apiUrl: process.env.NEXT_PUBLIC_URL
    }
  }