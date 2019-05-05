const validateAction = (action, path) => {
    console.log('validating action', path)
    switch (action.type) {
        case 'getFileContents': {
            if (action.filename === undefined) {
                return {
                    path,
                    type: 'getFileContents',
                    problem: 'Missing `filename`'
                }
            }
        }

        default: {
            return undefined
        }
    }
}

const validateStep = (step, path) => 
    (console.log('validating step', path), true) &&
    step.actions.map((action, index) =>
        validateAction(action, [...path, 'actions', index])
    )
        .filter((x) => x !== undefined)
        .reduce((a, b) => a.concat(b), [])


const validateConfig = (config) => 
    (console.log('validating config'), true) && 
    config.steps.map((step, index) => 
        validateStep(step, ['steps', index])
    )
        .reduce((a, b) => a.concat(b), [])

module.exports = {
    validateAction,
    validateStep,
    validateConfig
}