/* The backend stores specifications as one free-text string. HR types inconsistent
   values into it, so the form breaks it into per-category fields and composes them
   back into that single string on submit, then parses them out again on edit.

   Format written and read here: "Label: value | Label: value".
   The separator is " | " rather than " / " because values themselves often contain
   slashes (resolutions, port lists). Anything that does not parse back into a known
   label is preserved in the Additional Details box, so nothing is ever lost. */

const SPEC_FIELDS_BY_CATEGORY = {
  /* Laptops are covered by the named component fields (RAM, SSD, Processor, ...) */
  Laptop: [],

  Monitor: [
    { name: 'screenSize', label: 'Screen Size', placeholder: '24 inch' },
    { name: 'resolution', label: 'Resolution', placeholder: '1920x1080' },
    { name: 'panelType', label: 'Panel Type', placeholder: 'IPS / VA / TN' },
    { name: 'ports', label: 'Ports', placeholder: 'HDMI, DisplayPort' },
  ],

  Mobile: [
    { name: 'storage', label: 'Storage', placeholder: '128GB' },
    { name: 'ram', label: 'RAM', placeholder: '8GB' },
    { name: 'screenSize', label: 'Screen Size', placeholder: '6.1 inch' },
    { name: 'os', label: 'OS', placeholder: 'Android 14 / iOS 17' },
  ],

  Keyboard: [
    { name: 'connectivity', label: 'Connectivity', placeholder: 'Wired / Wireless' },
    { name: 'layout', label: 'Layout', placeholder: 'Full size / TKL' },
    { name: 'switchType', label: 'Switch Type', placeholder: 'Membrane / Mechanical' },
  ],

  Mouse: [
    { name: 'connectivity', label: 'Connectivity', placeholder: 'Wired / Wireless' },
    { name: 'dpi', label: 'DPI', placeholder: '1600' },
    { name: 'buttons', label: 'Buttons', placeholder: '3' },
  ],

  Headphone: [
    { name: 'connectivity', label: 'Connectivity', placeholder: 'Wired / Bluetooth' },
    { name: 'type', label: 'Type', placeholder: 'Over-ear / In-ear' },
    { name: 'microphone', label: 'Microphone', placeholder: 'Yes / No' },
  ],

  RAM: [
    { name: 'capacity', label: 'Capacity', placeholder: '8GB' },
    { name: 'type', label: 'Type', placeholder: 'DDR4' },
    { name: 'speed', label: 'Speed', placeholder: '3200 MHz' },
  ],

  SSD: [
    { name: 'capacity', label: 'Capacity', placeholder: '512GB' },
    { name: 'interface', label: 'Interface', placeholder: 'NVMe / SATA' },
    { name: 'formFactor', label: 'Form Factor', placeholder: 'M.2 / 2.5 inch' },
  ],

  Charger: [
    { name: 'wattage', label: 'Wattage', placeholder: '65W' },
    { name: 'connector', label: 'Connector', placeholder: 'USB-C / Barrel' },
  ],

  Other: [],
};

export const specFieldsFor = (category) => SPEC_FIELDS_BY_CATEGORY[category] || [];

const SEPARATOR = ' | ';

export const composeSpecifications = (category, values = {}, extra = '') => {
  const parts = specFieldsFor(category)
    .map((field) => {
      const value = (values[field.name] || '').trim();
      return value ? `${field.label}: ${value}` : null;
    })
    .filter(Boolean);

  const trimmedExtra = (extra || '').trim();
  if (trimmedExtra) {
    parts.push(trimmedExtra);
  }

  return parts.join(SEPARATOR);
};

/* Splits a stored specifications string back into the category's fields. Segments
   that do not match a known label for this category fall through to `extra`, which
   is how free-text written before this form existed survives a round trip. */
export const parseSpecifications = (specifications = '', category) => {
  const fields = specFieldsFor(category);
  const values = {};
  const leftovers = [];

  if (!specifications) {
    return { values, extra: '' };
  }

  specifications.split(SEPARATOR).forEach((segment) => {
    const trimmed = segment.trim();
    if (!trimmed) return;

    const splitAt = trimmed.indexOf(': ');
    const label = splitAt > -1 ? trimmed.slice(0, splitAt).trim() : '';
    const match = fields.find((field) => field.label === label);

    if (match) {
      values[match.name] = trimmed.slice(splitAt + 2).trim();
    } else {
      leftovers.push(trimmed);
    }
  });

  return { values, extra: leftovers.join(SEPARATOR) };
};
