export const settingTypeConverter = (id, t) => {
  if (id === 1) {
    return t('Activity');
  }
  if (id === 2) {
    return t('Sales Account MwSt');
  }
  if (id === 3) {
    return t('Einahmen/Ausgaben MwSt');
  }
};
