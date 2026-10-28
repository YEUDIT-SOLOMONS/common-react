const PHONE_PATTERN = /^(?:0[57]\d{8}|0[2-489]\d{7})$/

export const onlyDigits = (value: string) => value.replace(/\D/g, '')

export const EMAIL_RULES = {
  required: 'יש להזין אימייל',
  pattern: { value: /^\S+@\S+\.\S+$/, message: 'כתובת אימייל לא תקינה' },
}

export const PHONE_RULES = {
  required: 'יש להזין טלפון',
  validate: (value: string) => PHONE_PATTERN.test(onlyDigits(value)) || 'מספר לא תקין, למשל 0521234567',
}

export const NEW_PASSWORD_RULES = {
  required: 'יש להזין סיסמה',
  minLength: { value: 6, message: 'לפחות 6 תווים' },
  validate: (value: string) => (/[a-zA-Z]/.test(value) && /\d/.test(value)) || 'הסיסמה צריכה לכלול אותיות וספרות',
}
