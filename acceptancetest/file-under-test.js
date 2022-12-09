import pad from 'pad'
import { foo } from './stub-me.js'

export const main = `processed ${pad(foo(), 5, '-')}`
