const { red, bold, grey } = require('chalk')
const { inspect } = require('util')

const prettyPrint = (errors, verbose = false) => 
    errors.map(({ problem, type, path, ...error }) => 
        red(`${bold(type)}:${path.join('.')}\n${bold(problem)}`)
        + (verbose ? `\n${inspect(error)}` : '')
        // red(`${path.join('.')}:${type}\n${bold(problem)}`) +
        // verbose ? `\n${inspect(error)}` : ''
    )

module.exports = {
    prettyPrint
}