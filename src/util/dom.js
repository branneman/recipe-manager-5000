export const callIfEnterKeyWasPressed = (event, cb) => {
  if (event.key === 'Enter') cb()
}
