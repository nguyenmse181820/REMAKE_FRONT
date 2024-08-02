export const validateString = (content, minLength = 1, maxLength = Infinity, regex = null, allowedChars = null) => {
    if(content.trim().length == 0) {
        return {
            result: false,
            reason: ``
        }
    }
    if (content.trim().length < minLength) {
        return {
            result: false,
            reason: `Must be at least ${minLength} characters (excluding whitespace)`
        }
    }
    if (content.trim().length > maxLength) {
        return {
            result: false,
            reason: `Must be at most ${maxLength} characters (excluding whitespace)`
        }
    }
    if (regex && !new RegExp(regex).test(content)) {
        return {
            result: false,
            reason: `Input does not match the required format`
        }
    }
    if(allowedChars && !new RegExp(allowedChars).test(content)) {
        return {
            result: false,
            reason: `Invalid characters detected`
        }
    }
    return {
        result: true,
        reason: ''
    }
}

export const validateDouble = (content, minValue = 0.1, maxValue) => {
    if(content < minValue) {
        return {
            result: false,
            reason: `Minimum value: ${minValue}`
        }
    }
    if(content > maxValue) {
        return {
            result: false,
            reason: `Maximum value: ${maxValue}`
        }
    }
    return {
        result: true,
        reason: ''
    }
}

export const validateInteger = (content, minValue = 1, maxValue) => {
    if(!Number.isInteger(content)) {
        return {
            result: false,
            reason: `Number must be an integer!`
        }
    }
    if(content < minValue) {
        return {
            result: false,
            reason: `Minimum value ${minValue}`
        }
    }
    if(content > maxValue) {
        return {
            result: false,
            reason: `Maximum value: ${maxValue}`
        }
    }
    return {
        result: true,
        reason: ``
    }
}