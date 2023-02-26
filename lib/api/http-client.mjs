import axios from 'axios'
import { CAMUNDA_RUN_DEFAULT_PORT } from '../constants.mjs'

const http = axios.create({
  baseURL: `http://127.0.0.1:${CAMUNDA_RUN_DEFAULT_PORT}/engine-rest`
})

export const setBaseUrl = server => (http.defaults.baseURL = `${server}/engine-rest`)

export default http
