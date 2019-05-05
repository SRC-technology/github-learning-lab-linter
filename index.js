const actionsSpec = require('./actions-spec.json')

const getRequiredKeys = actionSpec => 
    actionSpec.filter(([_, { required }]) => required).map(([key]) => key)

const getKeyWithRegexps = actionSpec =>
    actionSpec.filter(([_, { regexp }]) => regexp !== undefined)

const validateRequiredKeys = (action, actionSpec) => 
    getRequiredKeys(actionSpec)
        .filter(key => action[key] === undefined)
        .map(key => ({
            problem: `Missing '${key}'`
        }))

const validateUnnecessaryKeys = (action, actionSpec) =>
    Object
        .keys(action)
        .filter(key => key !== 'type' && !actionSpec.map(([key]) => key).includes(key))
        .map(key => ({
            problem: `Unnecessary '${key}'`
        }))

const validateAction = (action, path) => {
    console.log('validating action', path)
    if (actionsSpec[action.type] === undefined) {
        return [
            {
                path,
                type: action.type,
                problem: `Unrecognized action type '${action.type}'`
            }
        ]
    }

    const regexpErrors = getKeyWithRegexps(actionsSpec[action.type])
        .map(([key, { regexp }]) => {
            if (action[key]) {
                if ((new RegExp(regexp)).test(action[key])) {
                    return undefined
                } else {
                    return {
                        problem: `Value '${action[key]}' for '${key}' does not match the spec format`,
                        regexp
                    }
                }
            }

            return undefined
        })
        .filter(x => x !== undefined)

    return [
        ...validateRequiredKeys(action, actionsSpec[action.type]),
        ...validateUnnecessaryKeys(action, actionsSpec[action.type]),
        ...regexpErrors
    ]
        .map(error => ({
            ...error,
            path,
            type: action.type
        }))
}

const validateStep = (step, path) => 
    (console.log('validating step', path), true) &&
    step.actions.map((action, index) =>
        validateAction(action, [...path, 'actions', index])
    )
        .filter((x) => x.length > 0)
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