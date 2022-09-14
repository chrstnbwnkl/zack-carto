import { useState } from "react"

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue)
  const setStorage = (newValue) => {
    localStorage.setItem(key, newValue)
    setValue(newValue)
  }

  return [value, setStorage]
}
