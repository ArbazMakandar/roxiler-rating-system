const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function validatePasswordValue(password, fieldName = "password") {
    if (!isNonEmptyString(password)) {
        return `${fieldName} is required`;
    }

    if (!PASSWORD_REGEX.test(password)) {
        return `${fieldName} must be 8 to 16 characters and include at least one uppercase letter and one special character`;
    }

    return null;
}

function sendErrors(res, errors) {
    return res.status(400).json({ message: "Validation failed", errors });
}

function validateRegister(req, res, next) {
    const { name, email, password, address } = req.body;
    const errors = [];

    if (!isNonEmptyString(name)) {
        errors.push("name is required");
    } else if (name.trim().length < 20 || name.trim().length > 60) {
        errors.push("name must be between 20 and 60 characters");
    }

    if (!isNonEmptyString(email)) {
        errors.push("email is required");
    } else if (!EMAIL_REGEX.test(email.trim())) {
        errors.push("email must be a valid email address");
    }

    const passwordError = validatePasswordValue(password);
    if (passwordError) {
        errors.push(passwordError);
    }

    if (!isNonEmptyString(address)) {
        errors.push("address is required");
    } else if (address.trim().length > 400) {
        errors.push("address must be at most 400 characters");
    }

    if (errors.length > 0) {
        return sendErrors(res, errors);
    }

    next();
}

function validateLogin(req, res, next) {
    const { email, password } = req.body;
    const errors = [];

    if (!isNonEmptyString(email)) {
        errors.push("email is required");
    } else if (!EMAIL_REGEX.test(email.trim())) {
        errors.push("email must be a valid email address");
    }

    if (!isNonEmptyString(password)) {
        errors.push("password is required");
    }

    if (errors.length > 0) {
        return sendErrors(res, errors);
    }

    next();
}

function validateChangePassword(req, res, next) {
    const { currentPassword, newPassword } = req.body;
    const errors = [];

    if (!isNonEmptyString(currentPassword)) {
        errors.push("currentPassword is required");
    }

    const newPasswordError = validatePasswordValue(newPassword, "newPassword");
    if (newPasswordError) {
        errors.push(newPasswordError);
    }

    if (errors.length > 0) {
        return sendErrors(res, errors);
    }

    next();
}

module.exports = {
    validateRegister,
    validateLogin,
    validateChangePassword
};
