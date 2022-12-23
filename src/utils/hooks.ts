import { useState } from "react"

export const useLocalStorage = (
  key: string,
  initialValue: string
): [string, (newValue: string) => void] => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue)
  const setStorage = (newValue: string) => {
    localStorage.setItem(key, newValue)
    setValue(newValue)
  }

  return [value, setStorage]
}
