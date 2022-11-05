import {I18n} from 'i18n';
import * as path from 'path';

const i18n = new I18n({
  locales: ['he'],
  directory: path.join(__dirname, 'locales'),
});

i18n.setLocale('he');

const __ = i18n.__.bind(i18n);
export {i18n, __};
