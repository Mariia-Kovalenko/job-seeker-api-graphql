export const validateRegisterInput = (email: string, password: string) => {
    const errors: string[] = [];
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push('Invalid email format.');
    }

    if (password.length < 6) {
        errors.push('Password must be at least 6 characters long.');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}