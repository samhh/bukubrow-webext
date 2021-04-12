import { useEffect } from "react"

const useListenToKeydown = (cb: (evt: KeyboardEvent) => void): void => {
  useEffect(() => {
    document.addEventListener("keydown", cb)

    return (): void => {
      document.removeEventListener("keydown", cb)
    }
  }, [])
}

export default useListenToKeydown
