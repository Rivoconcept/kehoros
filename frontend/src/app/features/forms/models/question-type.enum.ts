export enum QuestionType {
  // Basic inputs
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  PASSWORD = 'password',
  URL = 'url',

  // Date / Time
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',

  // Advanced inputs
  ADDRESS = 'address',
  LOCATION = 'location',
  MAP = 'map',

  // Choice fields
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',

  // Files
  FILE = 'file',
  IMAGE = 'image',
  SIGNATURE = 'signature',

  // Numeric interaction
  RANGE = 'range',
  RATING = 'rating',
  SCALE = 'scale',

  // Special fields
  COLOR = 'color',
  HIDDEN = 'hidden',
  HTML = 'html',
  LABEL = 'label',
  DIVIDER = 'divider',

  // Codes
  QR = 'qr',
  BARCODE = 'barcode',

  // Layout
  SECTION = 'section',
  TITLE = 'title',
  PARAGRAPH = 'paragraph',
}
