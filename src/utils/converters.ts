export const stringToBoolean = (string: string) => {
  if (string.toUpperCase() === 'TRUE') {
    return true;
  }

  if (string.toUpperCase() === 'FALSE') {
    return false;
  }

  return null;
}
