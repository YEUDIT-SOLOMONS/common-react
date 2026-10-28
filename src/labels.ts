export const CALL_KIND_LABELS: Record<string, string> = {
  Availability: 'אימות זמינות',
  AvailabilityRetry: 'אימות זמינות - ניסיון חוזר',
  AvailabilityOwnerEmail: 'אימות זמינות - מייל',
  Reminder: 'תזכורת החזרה',
  NotReturned: 'הפריט לא הוחזר',
  ExtensionRequest: 'בקשת הארכה',
  ExtensionApproved: 'הארכה אושרה',
  ExtensionDeclined: 'הארכה לא אושרה',
  Bridge: 'שיחה מתווכת',
  Welcome: 'ברוכה הבאה',
  SaleNotice: 'הודעת מכירה',
}

export const CALL_STATUS_LABELS: Record<string, string> = {
  Scheduled: 'מתוזמנת',
  RetryScheduled: 'מתוזמנת',
  EmailScheduled: 'מייל מתוזמן',
  Placed: 'בחיוג',
  Answered: 'נענתה',
  NoAnswer: 'לא נענתה',
  Busy: 'קו תפוס',
  Failed: 'נכשלה',
  Canceled: 'בוטלה',
}
