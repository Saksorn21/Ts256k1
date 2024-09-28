module.exports = {
  hkdfKeyCompressed: false,
  ephemeralKeyCompressed: false,
  signature: {
    enabled: true,
    throwOnInvalid: true,
    errorMessage: 'Invalid signature',
    useLowS: true
  }
}

