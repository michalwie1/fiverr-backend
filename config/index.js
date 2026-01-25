import configProd from './prod.js'
import configDev from './dev.js'


export var config
console.log('configProd', configProd)
config = configProd

// if (process.env.NODE_ENV === 'production') {
//   config = configProd
// } else {
//   config = configDev
// }
// config.isGuestMode = true


