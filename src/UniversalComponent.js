import React from 'react'
import PropTypes from 'prop-types'
import universal from 'react-universal-component'
import Loading from './components/Loading'
import NotFound from './components/NotFound'

// small function that allows page to be a string or a dynamic import function
// <UniversalComponent page={()=>{import('../../someFolder/Component.js')}}
// Its great for complex folder structures. You can leverage code completion
const determineHowToLoad = ({ page }) => typeof page !== 'string' ? () => page() : import(`./${page}`)

const promiseCallbacks = {}

const UniversalComponent = universal(determineHowToLoad, {
  onError: error => {
    throw error
  },
  minDelay: 1200,
  loading: Loading,
  error: NotFound,
  onLoad: (module, { isServer }, { page }) => {
    if (!isServer && promiseCallbacks[page]) {
      console.log(page)
      promiseCallbacks[page](page)
    }
  }
})

UniversalComponent.propTypes = {
  loading: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.bool
  ]),
  error: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.bool
  ]),
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  timeout: PropTypes.number,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  minDelay: PropTypes.number,
  alwaysDelay: PropTypes.bool,
  loadingTransition: PropTypes.bool
}

const loadComponent = file => universal(determineHowToLoad({ page: file }))

const importPromise = ({ page }) => new Promise(resolve => {
  promiseCallbacks[page] = resolve
  UniversalComponent.preload({ page })
})

export default UniversalComponent
export { loadComponent, universal, importPromise }
