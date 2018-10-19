import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'
import { importPromise } from './UniversalComponent'

const history = createHistory()

const render = App => ReactDOM.hydrate(
  <AppContainer>
    <App history={history} />
  </AppContainer>,
  document.getElementById('root')
)

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./components/App.js', () => {
    const App = require('./components/App').default // eslint-ignore-line
    render(App)
  })
}

(async () => {
  console.log('loading Foo..')
  await importPromise({ page: 'components/Foo' })
  console.log('loaded Foo..')
  render(App)
})()
